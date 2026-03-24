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
          <h1 className="text-3xl font-display font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage and audit all system users.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-64"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/5 mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'active' ? 'text-primary-light' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Active Users
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'pending' ? 'text-primary-light' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Pending Approvals ({pendingUsers?.length || 0})
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>}
        </button>
      </div>

      <div className="glass-card border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">User</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Details</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(activeTab === 'active' ? usersLoading : pendingLoading) ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : (activeTab === 'active' ? (users || []) : (pendingUsers || [])).length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-500">No users found.</td></tr>
            ) : (activeTab === 'active' ? users : pendingUsers).map((u: any) => (
              <tr key={u.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary-light font-bold">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1">
                    <p className="text-gray-300 uppercase font-medium">{u.role}</p>
                    <p className="text-gray-500">{u.faculty} • {u.department}</p>
                    <p className="text-gray-500 font-mono">{u.registrationNumber || u.staffId}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                    u.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    u.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeTab === 'pending' ? (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-400 hover:bg-green-500/10" onClick={() => handleStatusUpdate(u.id, 'APPROVED')}>
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10" onClick={() => handleStatusUpdate(u.id, 'REJECTED')}>
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
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
  );
};
