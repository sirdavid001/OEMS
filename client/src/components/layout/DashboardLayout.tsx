import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut, 
  User, 
  Menu, 
  X,
  PlusCircle,
  BarChart2,
  Users,
  FileText
} from 'lucide-react';
import { Button } from '../ui/Button';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['STUDENT', 'LECTURER', 'ADMIN', 'DEAN', 'HOD'] },
    { name: 'Take Exam', icon: BookOpen, path: '/dashboard/exams', roles: ['STUDENT'] },
    { name: 'My Exams', icon: FileText, path: '/dashboard/lecturer-exams', roles: ['LECTURER', 'DEAN', 'HOD', 'ADMIN'] },
    { name: 'Create Exam', icon: PlusCircle, path: '/dashboard/create-exam', roles: ['LECTURER', 'ADMIN'] },
    { name: 'Manage Users', icon: Users, path: '/dashboard/users', roles: ['ADMIN', 'DEAN', 'HOD'] },
    { name: 'Results', icon: BarChart2, path: '/dashboard/results', roles: ['STUDENT', 'LECTURER', 'ADMIN'] },
    { name: 'Profile', icon: User, path: '/dashboard/profile', roles: ['STUDENT', 'LECTURER', 'ADMIN', 'DEAN', 'HOD'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className={`glass-card fixed md:static inset-y-0 left-0 z-50 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-card-border bg-card`}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/dashboard" className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">O</div>
            OEMS
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-foreground/60">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/60 hover:bg-primary/5 hover:text-primary'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-card-border bg-card/50 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-foreground/60">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-foreground/50 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
