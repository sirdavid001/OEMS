import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Award,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const ResultsPage = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ['results'],
    queryFn: async () => {
      const res = await api.get('/exams/results');
      return res.data;
    },
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground italic">Retrieving your achievements...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Your Results</h1>
          <p className="text-foreground/60 mt-1">Track your performance and progress over time.</p>
        </div>
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Summary & Trends */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trend Chart (CSS-based) */}
          <div className="glass-card p-8 border-card-border">
            <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-8">Performance Trend</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {[65, 78, 72, 85, 92, 88].map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="relative w-full">
                    <div 
                      className="w-full bg-primary/20 border-t border-primary/40 rounded-t-xl group-hover:bg-primary/30 transition-all duration-500 box-content" 
                      style={{ height: `${score}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-card-border px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-foreground shadow-xl">
                        {score}%
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-foreground/40 font-bold uppercase">Test {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold text-foreground">Recent Submissions</h3>
            {results?.map((result: any) => (
              <div key={result.id} className="glass-card p-6 border-card-border flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                <Link to={`/dashboard/results/${result.id}`} className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-foreground">{result.exam.title}</h3>
                    <p className="text-sm text-foreground/40">Submitted on {new Date(result.submitTime).toLocaleDateString()}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-foreground/40 uppercase font-bold tracking-widest mb-1">Score</p>
                    <p className={`text-2xl font-display font-bold ${result.score >= 80 ? 'text-green-500' : 'text-amber-500'}`}>{result.score}%</p>
                  </div>
                  <div className="h-10 w-px bg-card-border mx-2 hidden md:block"></div>
                  <div className="flex gap-2">
                    <Link to={`/dashboard/results/${result.id}`}>
                      <Button size="sm" variant="ghost">Details</Button>
                    </Link>
                    <Button size="sm" variant="outline" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/exams/attempt/${result.id}/pdf`, '_blank')}>
                      Certificate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Card */}
        <div className="space-y-6">
          <div className="glass-card p-8 border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-24 h-24 text-primary" />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground mb-2">Overall Rank</h3>
            <p className="text-4xl font-display font-bold text-primary">Top 5%</p>
            <p className="text-sm text-foreground/60 mt-4 leading-relaxed">You are performing better than 95% of candidates in this category. Keep up the great work!</p>
            <Button className="w-full mt-8 bg-secondary border-card-border hover:bg-secondary/80">Download Report</Button>
          </div>

          <div className="glass-card p-6 border-card-border text-foreground">
            <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Strength Map</h3>
            <div className="space-y-4">
              {[
                { label: 'Algebra', value: 92, color: 'bg-green-500' },
                { label: 'Calculus', value: 78, color: 'bg-amber-500' },
                { label: 'Geometry', value: 85, color: 'bg-blue-500' },
              ].map((skill) => (
                <div key={skill.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground/80">{skill.label}</span>
                    <span className="text-foreground/40">{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
