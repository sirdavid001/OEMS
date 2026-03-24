import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { 
  FileText, 
  ChevronLeft, 
  ExternalLink,
  Search
} from 'lucide-react';

export const ExamAttemptsPage = () => {
  const { examId } = useParams();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      const res = await api.get(`/exams/${examId}`);
      return res.data;
    }
  });

  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ['exam-attempts', examId],
    queryFn: async () => {
      const res = await api.get(`/exams/${examId}/attempts`);
      return res.data;
    }
  });

  if (examLoading || attemptsLoading) return <div className="p-8 text-foreground italic">Loading submissions...</div>;

  const filteredAttempts = attempts?.filter((a: any) => 
    a.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.user.registrationNumber && a.user.registrationNumber.includes(searchTerm))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/lecturer-exams">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Submissions</h1>
          <p className="text-foreground/60 mt-1">{exam?.title}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search student by name or ID..." 
            className="input-field pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
          <FileText className="w-4 h-4" />
          {attempts?.length || 0} Total Submissions
        </div>
      </div>

      <div className="glass-card border-card-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary/30 border-b border-card-border">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Student</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">ID Number</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40 text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40 text-center">Current Score</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filteredAttempts?.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-20 text-center text-foreground/40">No submissions matching your search.</td></tr>
            ) : filteredAttempts?.map((a: any) => (
              <tr key={a.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-foreground">{a.user.name}</p>
                    <p className="text-xs text-foreground/40">{a.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-foreground/60">
                  {a.user.registrationNumber || a.user.staffId || 'N/A'}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                    a.status === 'GRADED' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                    a.status === 'SUBMITTED' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    'bg-secondary text-foreground/40'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-foreground">
                  {Math.round(a.score)}%
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/dashboard/grade/${a.id}`}>
                    <Button variant={a.status === 'GRADED' ? 'outline' : 'primary'} size="sm" className="gap-2">
                       {a.status === 'GRADED' ? 'Review Grade' : 'Grade Attempt'}
                       <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
