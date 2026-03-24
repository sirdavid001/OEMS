import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { 
  Trash2, 
  Shield, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';

export const UserManagementPage = () => {
  const [activeTab, setActiveTab] = React.useState<'active' | 'pending'>('active');

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users'); 
      return response.data;
    },
  });

  const { data: pendingUsers, isLoading: pendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const response = await api.get('/users/pending');
      return response.data;
    },
  });

  const handleStatusUpdate = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/users/${userId}/status`, { status });
      refetchPending();
      refetchUsers();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">User Management</h1>
          <p className="text-foreground/60 mt-1">Manage and audit all system users.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-secondary border border-card-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-64 text-foreground"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-card-border mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'active' ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
        >
          Active Users
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'pending' ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
        >
          Pending Approvals ({pendingUsers?.length || 0})
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>}
        </button>
      </div>

      <div className="glass-card border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/30 border-b border-card-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-foreground/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {(activeTab === 'active' ? usersLoading : pendingLoading) ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-foreground/40 italic">Loading...</td></tr>
              ) : (activeTab === 'active' ? (users || []) : (pendingUsers || [])).length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-foreground/40">No users found.</td></tr>
              ) : (activeTab === 'active' ? users : pendingUsers).map((u: any) => (
                <tr key={u.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary font-bold">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{u.name}</p>
                        <p className="text-xs text-foreground/40">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <p className="text-foreground/60 uppercase font-medium">
                        {u.role === 'LECTURER' ? 'Lecturer' : u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                      </p>
                      <p className="text-foreground/40">{u.faculty} • {u.department}</p>
                      <p className="text-foreground/40 font-mono">{u.registrationNumber || u.staffId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                      u.status === 'APPROVED' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                      u.status === 'REJECTED' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === 'pending' ? (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600 hover:bg-green-500/10" onClick={() => handleStatusUpdate(u.id, 'APPROVED')}>
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-500/10" onClick={() => handleStatusUpdate(u.id, 'REJECTED')}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-foreground/40 hover:text-foreground">
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-foreground/40">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
