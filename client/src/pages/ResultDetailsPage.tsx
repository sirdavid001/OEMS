import React from 'react';
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
  Award
} from 'lucide-react';

export const ResultDetailsPage = () => {
  const { id } = useParams();
  
  const { data: attempt, isLoading } = useQuery({
    queryKey: ['attempt-details', id],
    queryFn: async () => {
      const res = await api.get(`/exams/attempt/${id}/details`);
      return res.data;
    },
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading breakdown...</div>;

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

      <div className="glass-card p-8 border-white/5 flex flex-col md:flex-row items-center gap-8 bg-primary/5">
        <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30">
          <Award className="w-12 h-12 text-primary-light" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-display font-bold text-white mb-2">{attempt.exam.title}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(attempt.submitTime).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" /> {attempt.exam.questions.length} Questions</span>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mb-1">Final Score</p>
          <p className="text-5xl font-display font-bold text-primary-light">{attempt.score}%</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-display font-bold text-white">Question Breakdown</h3>
        <div className="space-y-4">
          {attempt.exam.questions.map((q: any, idx: number) => {
            const studentAns = attempt.answers.find((a: any) => a.questionId === q.id);
            const isCorrect = q.type !== 'THEORY' ? q.answer === studentAns?.response : true;
            
            return (
              <div key={q.id} className="glass-card p-6 border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">{idx + 1}. {q.text}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{q.type} • {q.points} Points</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Your Response</p>
                        <p className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{studentAns?.response || 'No Answer'}</p>
                      </div>
                      {!isCorrect && q.type !== 'THEORY' && (
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Correct Answer</p>
                          <p className="text-sm text-blue-400">{q.answer}</p>
                        </div>
                      )}
                    </div>
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
