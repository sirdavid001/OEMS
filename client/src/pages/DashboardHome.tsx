import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export const DashboardHome = () => {
  const { user } = useAuthStore();
  
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.role],
    queryFn: async () => {
      const res = await api.get('/exams/stats');
      return res.data;
    },
    enabled: !!user,
  });

  const getStats = () => {
    if (user?.role === 'ADMIN') {
      return [
        { name: 'Total Users', value: statsLoading ? '...' : dashboardStats?.totalUsers || '0', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { name: 'Active Exams', value: statsLoading ? '...' : dashboardStats?.activeExams || '0', icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10' },
        { name: 'Pending Approvals', value: statsLoading ? '...' : dashboardStats?.pendingApprovals || '0', icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { name: 'Active Now', value: statsLoading ? '...' : dashboardStats?.activeNow || '0', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
      ];
    }
    
    if (user?.role === 'STUDENT') {
      return [
        { name: 'Exams Taken', value: statsLoading ? '...' : dashboardStats?.totalExams || '0', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { name: 'Credits Earned', value: statsLoading ? '...' : dashboardStats?.completedExams || '0', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
        { name: 'Average Score', value: statsLoading ? '...' : `${dashboardStats?.averageScore || 0}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { name: 'Hours Spent', value: statsLoading ? '...' : dashboardStats?.hoursSpent || '0h', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
      ];
    }
 
    // LECTURER, DEAN, HOD
    return [
      { name: 'Exams Created', value: statsLoading ? '...' : dashboardStats?.totalExams || '0', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
      { name: 'Total Attempts', value: statsLoading ? '...' : dashboardStats?.totalAttempts || '0', icon: Users, color: 'text-green-400', bg: 'bg-green-400/10' },
      { name: 'Active Now', value: statsLoading ? '...' : dashboardStats?.activeExams || '0', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
      { name: 'Pending Grading', value: statsLoading ? '...' : dashboardStats?.pendingGrading || '0', icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Welcome, {user?.name}</h1>
        <p className="text-foreground/60 mt-1">
          {user?.role === 'ADMIN' ? "Here's an overview of the entire system." : "Here's what's happening with your exams today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 border-card-border hover:border-primary/20 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-foreground/40 group-hover:text-primary transition-colors">View Details</span>
            </div>
            <p className="text-sm font-medium text-foreground/60">{stat.name}</p>
            <h3 className="text-2xl font-display font-bold text-foreground mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams / Admin Approvals */}
        <div className="glass-card p-6 border-card-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-foreground">
              {user?.role === 'ADMIN' ? 'Pending Registrations' : 'Recent Activity'}
            </h3>
            {user?.role === 'ADMIN' ? (
              <Link to="/dashboard/users" className="text-sm text-primary hover:underline">Manage Users</Link>
            ) : (
              <Link to="/dashboard/results" className="text-sm text-primary hover:underline">See All</Link>
            )}
          </div>
          <div className="space-y-4">
            {statsLoading ? (
              <div className="text-foreground/40 italic p-4">Loading data...</div>
            ) : user?.role === 'ADMIN' ? (
              dashboardStats?.recentApprovals?.length > 0 ? (
                dashboardStats.recentApprovals.map((req: any) => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-card-border hover:bg-secondary/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{req.name}</h4>
                        <p className="text-xs text-foreground/40">{req.role} • {new Date(req.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link to="/dashboard/users">
                       <Button size="sm" variant="ghost" className="text-xs text-primary">Review</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-foreground/40 glass-card border-dashed">
                  No pending approvals. All systems clear!
                </div>
              )
            ) : user?.role === 'STUDENT' ? (
              dashboardStats?.recentAttempts?.length > 0 ? (
                dashboardStats.recentAttempts.map((attempt: any) => (
                  <Link to={`/dashboard/results/${attempt.id}`} key={attempt.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-card-border hover:bg-secondary/50 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-6 h-6 text-foreground/40 group-hover:text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{attempt.examTitle}</h4>
                        <p className="text-xs text-foreground/40">{new Date(attempt.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${attempt.score >= 80 ? 'text-green-500' : 'text-amber-500'}`}>{attempt.score}%</p>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Score</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 text-foreground/40 glass-card border-dashed">
                  No recent activity. Start an exam to see your results here!
                </div>
              )
            ) : (
              // LECTURER/DEAN/HOD Activity
              dashboardStats?.recentCreated?.length > 0 ? (
                dashboardStats.recentCreated.map((exam: any) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-card-border hover:bg-secondary/50 hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-6 h-6 text-foreground/40 group-hover:text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{exam.title}</h4>
                        <p className="text-xs text-foreground/40">{new Date(exam.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{exam.attempts}</p>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Attempts</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-foreground/40 glass-card border-dashed">
                  No exams created yet. Click 'Create Exam' to get started!
                </div>
              )
            )}
          </div>
        </div>
 
        {/* Upcoming Schedules */}
        <div className="glass-card p-6 border-card-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-foreground">Upcoming Schedules</h3>
            <button className="text-sm text-primary hover:underline">View Calendar</button>
          </div>
          <div className="space-y-4">
            {statsLoading ? (
              <div className="text-foreground/40 italic p-4">Loading exams...</div>
            ) : dashboardStats?.upcomingExams?.length > 0 ? (
              dashboardStats.upcomingExams.map((exam: any) => (
                <div key={exam.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-card-border group hover:border-primary/20 transition-all">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary/10 rounded-xl text-primary border border-primary/20 group-hover:bg-primary/20">
                    <span className="text-lg font-bold">{new Date(exam.date).getDate()}</span>
                    <span className="text-[10px] uppercase font-bold tracking-tight">
                      {new Date(exam.date).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{exam.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-foreground/40">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(exam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {exam.duration} Min</span>
                    </div>
                  </div>
                  <Link to="/dashboard/exams">
                    <Button size="sm" variant="outline" className="text-xs px-4">Details</Button>
                  </Link>
                </div>
              ))
            ) : (
                <div className="text-center py-10 text-foreground/40 glass-card border-dashed">
                  No upcoming exams scheduled.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
