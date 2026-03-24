import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { Lock, ShieldCheck } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: data.password,
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. Token might be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <div className="glass-card p-8 border-card-border">
          <h1 className="text-xl text-red-500 font-bold mb-4">Invalid Link</h1>
          <p className="text-foreground/60 mb-6">The password reset link is missing or malformed.</p>
          <Button onClick={() => navigate('/login')} variant="outline">Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <div className="glass-card p-8 border-card-border animate-fade-in">
          <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/30">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Password Reset Successful</h1>
          <p className="text-foreground/60">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card w-full max-w-md p-8 border-card-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-primary/30">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Set New Password</h1>
          <p className="text-foreground/60 mt-2 text-center">Choose a secure password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm italic">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 ml-1">New Password</label>
            <input
              {...register('password')}
              type="password"
              className="input-field w-full"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 ml-1">Confirm New Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="input-field w-full"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};
