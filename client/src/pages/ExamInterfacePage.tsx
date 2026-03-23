import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertTriangle 
} from 'lucide-react';
import api from '../services/api';

export const ExamInterfacePage = () => {
  const { examId, attemptId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  
  const [exam, setExam] = React.useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const fetchExam = async () => {
      const res = await api.get(`/exams/${examId}`);
      setExam(res.data);
    };
    fetchExam();

    // Socket Setup
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token },
    });

    newSocket.emit('joinExam', { examId, attemptId });

    newSocket.on('timerSync', (data) => {
      setTimeLeft(data.timeLeft);
    });

    newSocket.on('examFinished', () => {
      handleSubmit();
    });

    setSocket(newSocket);

    // Fullscreen Enforcement
    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error('Fullscreen request failed', err);
      }
    };
    requestFullscreen();

    // Anti-cheating: Tab visibility & Fullscreen exit
    const handleVisibilityChange = () => {
      if (document.hidden) {
        newSocket.emit('cheatAlert', { attemptId, type: 'TAB_SWITCH' });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        newSocket.emit('cheatAlert', { attemptId, type: 'FULLSCREEN_EXIT' });
        alert('Warning: Escaping fullscreen mode is logged as suspicious activity.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      newSocket.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [examId, attemptId]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, response]) => ({
      questionId,
      response,
    }));

    try {
      await api.post(`/exams/attempt/${attemptId}/submit`, { answers: formattedAnswers });
      socket?.disconnect();
      navigate('/dashboard/results');
    } catch (err) {
      console.error('Submission failed', err);
    }
  };

  if (!exam || timeLeft === null) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Initializing Secure Session...</div>;

  const currentQuestion = exam.questions[currentQuestionIdx];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      {/* Top Bar */}
      <header className="h-20 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-display font-bold truncate max-w-md">{exam.title}</h2>
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-xs text-gray-500 font-medium">Candidate</p>
            <p className="text-sm font-bold">{user?.name}</p>
          </div>
          <Button variant="primary" className="gap-2" onClick={handleSubmit}>
            <Send className="w-4 h-4" />
            Submit Exam
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Navigation */}
        <aside className="w-80 border-r border-white/5 bg-white/[0.01] p-6 hidden lg:block overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Question Palette</h3>
          <div className="grid grid-cols-4 gap-3">
            {exam.questions.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIdx(idx)}
                className={`h-12 rounded-xl border flex items-center justify-center font-bold transition-all ${currentQuestionIdx === idx ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-110' : answers[exam.questions[idx].id] ? 'bg-green-500/20 border-green-500/30 text-green-500' : 'bg-secondary border-white/5 text-gray-500 hover:border-white/10'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex gap-3 text-amber-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase">Proctoring Active</p>
                <p className="text-[10px] text-amber-500/70 mt-1 leading-relaxed">System is monitoring tab switches and display activity. Any suspicious behavior will be flagged.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Question Area */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-10 animate-slide-up">
            <div className="space-y-4">
              <span className="text-primary-light font-bold text-sm tracking-widest uppercase">Question {currentQuestionIdx + 1} of {exam.questions.length}</span>
              <h1 className="text-2xl md:text-3xl font-display font-medium leading-tight">{currentQuestion.text}</h1>
            </div>

            <div className="space-y-4">
              {currentQuestion.options ? (
                // MCQ Options
                Object.entries(JSON.parse(currentQuestion.options)).map(([key, value]: [string, any]) => (
                  <label key={key} className={`group flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${answers[currentQuestion.id] === key ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : 'bg-secondary border-white/5 hover:border-white/10'}`}>
                    <input 
                      type="radio" 
                      name="option" 
                      className="sr-only" 
                      checked={answers[currentQuestion.id] === key}
                      onChange={() => handleAnswer(currentQuestion.id, key)}
                    />
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold transition-colors ${answers[currentQuestion.id] === key ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-400 group-hover:border-primary/50'}`}>
                      {key.toUpperCase()}
                    </div>
                    <span className="text-lg text-gray-200">{value}</span>
                  </label>
                ))
              ) : (
                // Theory/Text Answer
                <textarea 
                  className="input-field w-full min-h-[300px] py-4 text-lg"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-10 border-t border-white/5">
              <Button 
                variant="ghost" 
                className="gap-2" 
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(idx => idx - 1)}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Question
              </Button>
              <Button 
                variant="secondary" 
                className="gap-2"
                disabled={currentQuestionIdx === exam.questions.length - 1}
                onClick={() => setCurrentQuestionIdx(idx => idx + 1)}
              >
                Next Question
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
