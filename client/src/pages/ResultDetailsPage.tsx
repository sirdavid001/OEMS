import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock,
  Award,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { MathContent } from '../components/ui/MathContent';

export const ResultDetailsPage = () => {
  const { id } = useParams();
  
  const { data: attempt, isLoading } = useQuery({
    queryKey: ['attempt-details', id],
    queryFn: async () => {
      const res = await api.get(`/exams/attempt/${id}/details`);
      return res.data;
    },
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground italic">Loading breakdown...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Link to="/dashboard/results">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </Button>
        </Link>
        <Button variant="outline" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/exams/attempt/${id}/pdf`, '_blank')}>
          Download PDF
        </Button>
      </div>

      <div className="glass-card p-8 border-card-border flex flex-col md:flex-row items-center gap-8 bg-primary/5">
        <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30">
          <Award className="w-12 h-12 text-primary" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{attempt.exam.title}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-foreground/40">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(attempt.submitTime).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {attempt.exam.questions.length} Questions</span>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm text-foreground/40 uppercase font-bold tracking-widest mb-1">Final Score</p>
          <p className="text-5xl font-display font-bold text-primary">{attempt.score}%</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold text-foreground">Question Breakdown</h3>
        <div className="space-y-4">
          {attempt.exam.questions.map((q: any, idx: number) => {
            const studentAns = attempt.answers.find((a: any) => a.questionId === q.id);
            const isTheory = q.type === 'THEORY';
            const isCorrect = !isTheory ? q.answer === studentAns?.response : studentAns?.pointsEarned > 0;
            const isGraded = attempt.status === 'GRADED' || !isTheory;
            
            return (
              <div key={q.id} className="glass-card p-6 border-card-border hover:border-primary/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                    !isGraded ? 'bg-amber-500/20 text-amber-600' :
                    isCorrect ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                  }`}>
                    {!isGraded ? <Clock className="w-4 h-4" /> :
                     isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <MathContent className="font-medium text-foreground mb-1" content={`${idx + 1}. ${q.content || q.text}`} />
                        <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">{q.type}</p>
                      </div>
                      <div className="text-right">
                         <span className={`text-xs font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                           {studentAns?.pointsEarned || 0} / {q.points}
                         </span>
                         <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">Points</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border ${
                        !isGraded ? 'bg-amber-500/5 border-amber-500/10' :
                        isCorrect ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'
                      }`}>
                        <p className="text-[10px] text-foreground/40 font-bold uppercase mb-2">Your Response</p>
                        <MathContent className={`text-sm ${
                          !isGraded ? 'text-amber-600' :
                          isCorrect ? 'text-green-600' : 'text-red-500'
                        }`} content={studentAns?.response || 'No Answer'} />
                      </div>
                      
                      {isGraded && !isCorrect && !isTheory && (
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                          <p className="text-[10px] text-foreground/40 font-bold uppercase mb-2">Correct Answer</p>
                          <p className="text-sm text-blue-600">{q.answer}</p>
                        </div>
                      )}

                      {isTheory && !isGraded && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600">
                           <AlertCircle className="w-5 h-5" />
                           <p className="text-xs font-medium">Pending manual review by lecturer.</p>
                        </div>
                      )}
                    </div>

                    {studentAns?.feedback && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare className="w-3 h-3" /> Instructor Feedback
                        </p>
                        <p className="text-sm text-foreground/80 italic">"{studentAns.feedback}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
