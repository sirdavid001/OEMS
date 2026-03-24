import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email, Phone, or ID Number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      setAuth(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow animate-delay-1000"></div>
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 border-card-border bg-card/60 backdrop-blur-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-primary/30">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight text-center">Welcome Back</h1>
          <p className="text-foreground/60 mt-2">Sign in to your OEMS account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/60 ml-1">Email, Phone, or ID Number</label>
            <input
              {...register('identifier')}
              className="input-field w-full"
              placeholder="Email, Phone, or Matric/Staff ID"
              autoComplete="username"
            />
            {errors.identifier && <p className="text-xs text-red-500 ml-1">{errors.identifier.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
               <label className="text-sm font-medium text-foreground/60">Password</label>
               <Link to="/forgot-password" university-theme-aware="true" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
            </div>
            <div className="relative group">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input-field w-full pr-12 transition-all duration-300 focus:ring-primary/20"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-12 text-lg" isLoading={isLoading}>
            Sign In
          </Button>

          <p className="text-center text-foreground/40 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
