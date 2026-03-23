import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

export const DashboardHome = () => {
  const { user } = useAuthStore();

  const stats = user?.role === 'ADMIN' ? [
    { name: 'Total Users', value: '1,280', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Active Exams', value: '42', icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'System Load', value: '18%', icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Total Revenue', value: '$12k', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ] : [
    { name: 'Active Exams', value: '12', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Completed', value: '48', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { name: 'Average Score', value: '84%', icon: ArrowUpRight, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Hours Spent', value: '24h', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Welcome, {user?.name}</h1>
        <p className="text-gray-400 mt-1">
          {user?.role === 'ADMIN' ? "Here's an overview of the entire system." : "Here's what's happening with your exams today."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 border-white/5 hover:border-white/10 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-500 group-hover:text-primary-light transition-colors">View Details</span>
            </div>
            <p className="text-sm font-medium text-gray-400">{stat.name}</p>
            <h3 className="text-2xl font-display font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-white">Recent Exams</h3>
            <button className="text-sm text-primary-light hover:underline">See All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-6 h-6 text-gray-400 group-hover:text-primary-light" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Advanced Mathematics II</h4>
                    <p className="text-xs text-gray-500">Instructor: Dr. Sarah Smith</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white font-medium">88%</p>
                  <p className="text-xs text-green-500">Passed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedules */}
        <div className="glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold text-white">Upcoming Schedules</h3>
            <button className="text-sm text-primary-light hover:underline">View Calendar</button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-primary/20 rounded-xl text-primary-light border border-primary/30">
                  <span className="text-lg font-bold">24</span>
                  <span className="text-[10px] uppercase font-bold tracking-tight">March</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">Introduction to Web Security</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 10:00 AM</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 120 Registered</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs px-4">Remind</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
