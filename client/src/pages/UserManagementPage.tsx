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
  const [selectedRole, setSelectedRole] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

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

  const filteredUsers = React.useMemo(() => {
    const baseList = activeTab === 'active' ? (users || []) : (pendingUsers || []);
    return baseList.filter((u: any) => {
      const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (u.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (u.staffId?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRole && matchesSearch;
    });
  }, [activeTab, users, pendingUsers, selectedRole, searchQuery]);

  const roleCounts = React.useMemo(() => {
    const baseList = activeTab === 'active' ? (users || []) : (pendingUsers || []);
    return {
      ALL: baseList.length,
      STUDENT: baseList.filter((u: any) => u.role === 'STUDENT').length,
      LECTURER: baseList.filter((u: any) => u.role === 'LECTURER').length,
      HOD: baseList.filter((u: any) => u.role === 'HOD').length,
      DEAN: baseList.filter((u: any) => u.role === 'DEAN').length,
    };
  }, [activeTab, users, pendingUsers]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary border border-card-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-64 text-foreground"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-card-border mb-6 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'active' ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
        >
          Active Users
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'pending' ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60'}`}
        >
          Pending Approvals ({pendingUsers?.length || 0})
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'ALL', label: 'All Roles' },
          { id: 'STUDENT', label: 'Students' },
          { id: 'LECTURER', label: 'Lecturers' },
          { id: 'HOD', label: 'HODs' },
          { id: 'DEAN', label: 'Deans' },
        ].map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedRole === role.id 
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' 
                : 'bg-secondary border-card-border text-foreground/40 hover:border-primary/20 hover:text-foreground/60'
            }`}
          >
            {role.label} <span className="ml-1 opacity-40">({(roleCounts as any)[role.id]})</span>
          </button>
        ))}
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
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-20 text-center text-foreground/40 italic">No {selectedRole.toLowerCase()}s found in this section.</td></tr>
              ) : filteredUsers.map((u: any) => (
                <tr key={u.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold ${
                        u.role === 'STUDENT' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                        u.role === 'LECTURER' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                        u.role === 'HOD' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{u.name}</p>
                        <p className="text-xs text-foreground/40 lowercase">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <p className="text-foreground/60 uppercase font-bold tracking-wider">
                        {u.role}
                      </p>
                      <p className="text-foreground/40">{u.faculty} • {u.department}</p>
                      <p className="text-foreground/40 font-mono">{u.registrationNumber || u.staffId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                      u.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      u.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activeTab === 'pending' ? (
                        <>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-green-500 hover:bg-green-500/10 rounded-lg" onClick={() => handleStatusUpdate(u.id, 'APPROVED')} title="Approve">
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-500 hover:bg-red-500/10 rounded-lg" onClick={() => handleStatusUpdate(u.id, 'REJECTED')} title="Reject">
                            <XCircle className="w-5 h-5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-foreground/40 hover:text-foreground rounded-lg">
                            <Shield className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-500 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-5 h-5" />
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
