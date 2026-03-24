import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
  const { user, setAuth, token } = useAuthStore();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    setError('');
    setIsSuccess(false);
    
    const updateData: any = { name: data.name, email: data.email };
    if (data.password) updateData.password = data.password;

    try {
      const response = await api.patch('/users/profile', updateData);
      setAuth(response.data, token!);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Your Profile</h1>
        <p className="text-gray-400 mt-1">Manage your personal information and security settings.</p>
      </div>

      <div className="glass-card p-8 border-white/5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5" />
              Profile updated successfully!
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                {...register('name')}
                className="input-field w-full"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                {...register('email')}
                className="input-field w-full"
                placeholder="john@example.com"
                disabled // Email usually restricted or needs verification
              />
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                <Lock className="w-4 h-4" /> New Password (Optional)
              </label>
              <input
                {...register('password')}
                type="password"
                className="input-field w-full"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-gray-500 ml-1 tracking-wider uppercase">Leave blank to keep current password</p>
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};
