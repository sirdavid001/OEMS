import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'INSTRUCTOR']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', data);
      setAuth(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow animate-delay-1000"></div>
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-primary/30">
            <UserPlus className="w-8 h-8 text-primary-light" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2">Join the OEMS platform today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <input {...register('name')} className="input-field w-full" placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <input {...register('email')} className="input-field w-full" placeholder="john@example.com" />
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="input-field w-full"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1 pb-2">
            <label className="text-sm font-medium text-gray-300 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'STUDENT' ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 text-white' : 'bg-secondary border-white/5 text-gray-400 hover:border-white/10'}`}>
                <input {...register('role')} type="radio" value="STUDENT" className="sr-only" />
                <span className="text-sm font-medium">Student</span>
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'INSTRUCTOR' ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 text-white' : 'bg-secondary border-white/5 text-gray-400 hover:border-white/10'}`}>
                <input {...register('role')} type="radio" value="INSTRUCTOR" className="sr-only" />
                <span className="text-sm font-medium">Instructor</span>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg" isLoading={isLoading}>
            Get Started
          </Button>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-light font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
