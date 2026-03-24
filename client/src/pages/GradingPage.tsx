import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { 
  ChevronLeft, 
  CheckCircle2, 
  MessageSquare,
  Award,
  AlertCircle
} from 'lucide-react';
import { MathContent } from '../components/ui/MathContent';

export const GradingPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [grades, setGrades] = React.useState<Record<string, { points: number; feedback: string }>>({});

  const { data: attempt, isLoading } = useQuery({
    queryKey: ['attempt-details', attemptId],
    queryFn: async () => {
      const res = await api.get(`/exams/attempt/${attemptId}/details`);
      return res.data;
    }
  });

  React.useEffect(() => {
    if (attempt?.answers) {
      const initialGrades: Record<string, { points: number; feedback: string }> = {};
      (attempt as any).answers.forEach((ans: any) => {
        initialGrades[ans.questionId] = {
          points: ans.pointsEarned,
          feedback: ans.feedback || ''
        };
      });
      setGrades(initialGrades);
    }
  }, [attempt]);

  const gradeMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/exams/attempt/${attemptId}/grade`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-attempts'] });
      navigate(-1);
    }
  });

  const handleGradeChange = (questionId: string, field: 'points' | 'feedback', value: any) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    const payload = {
      grades: Object.entries(grades).map(([questionId, data]) => ({
        questionId,
        points: Number(data.points),
        feedback: data.feedback
      }))
    };
    gradeMutation.mutate(payload);
  };

  if (isLoading) return <div className="p-8 text-foreground italic">Loading attempt data...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Evaluate Submission</h1>
            <p className="text-foreground/60 mt-1">{(attempt as any).user.name} • {(attempt as any).exam.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-xs text-foreground/40 uppercase font-black tracking-widest">Current Total</p>
             <p className="text-2xl font-display font-bold text-primary">
                {Object.values(grades).reduce((acc, curr) => acc + (Number(curr.points) || 0), 0)} / {(attempt as any).exam.questions.reduce((acc: number, q: any) => acc + q.points, 0)}
             </p>
          </div>
          <Button className="gap-2" onClick={handleSubmit} isLoading={gradeMutation.isPending}>
            <CheckCircle2 className="w-4 h-4" />
            Finalize Grades
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {(attempt as any).exam.questions.map((q: any, idx: number) => {
          const answer = (attempt as any).answers.find((a: any) => a.questionId === q.id);
          const isTheory = q.type === 'THEORY';
          const isMCQ = q.type === 'MCQ' || q.type === 'TRUE_FALSE';
          const isCorrect = isMCQ && answer?.response === q.answer;

          return (
            <div key={q.id} className="glass-card border-card-border overflow-hidden">
              <div className="bg-secondary/30 px-6 py-4 border-b border-card-border flex items-center justify-between">
                <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Question {idx + 1} ({q.type})</span>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-xs font-bold">
                      <Award className="w-4 h-4 text-primary" />
                      Points: 
                      <input 
                        type="number" 
                        max={q.points}
                        min={0}
                        className="w-16 bg-background border border-card-border rounded px-2 py-1 text-foreground focus:border-primary/50 outline-none"
                        value={grades[q.id]?.points || 0}
                        onChange={(e) => handleGradeChange(q.id, 'points', e.target.value)}
                      />
                      <span className="text-foreground/40">/ {q.points}</span>
                   </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Question & Model Answer */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-foreground/30 uppercase tracking-widest mb-2">Question Content</h4>
                    <MathContent className="text-lg text-foreground font-medium" content={q.content || q.text} />
                  </div>
                  {isMCQ && (
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                       <h4 className="text-[10px] font-black text-green-600/60 uppercase tracking-widest mb-1">Model Answer</h4>
                       <p className="text-green-600 font-bold">{q.answer}</p>
                    </div>
                  )}
                  {isTheory && q.answer && (
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                       <h4 className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-1">Grading Rubric / Key Points</h4>
                       <p className="text-sm text-blue-600/80 italic">{q.answer}</p>
                    </div>
                  )}
                </div>

                {/* Right Side: Student Response & Feedback */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-xs font-black text-foreground/30 uppercase tracking-widest">Student Response</h4>
                       {isMCQ && (
                         isCorrect ? <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded uppercase">Correct</span>
                         : <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Incorrect</span>
                       )}
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/20 border border-card-border min-h-[100px]">
                      {answer?.response ? (
                        <MathContent className="text-foreground/80 whitespace-pre-wrap" content={answer.response} />
                      ) : (
                        <p className="text-foreground/40 italic">No response provided.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Instructor Feedback
                    </label>
                    <textarea 
                      className="input-field w-full text-sm min-h-[80px]"
                      placeholder="Add specific feedback for this answer..."
                      value={grades[q.id]?.feedback || ''}
                      onChange={(e) => handleGradeChange(q.id, 'feedback', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
