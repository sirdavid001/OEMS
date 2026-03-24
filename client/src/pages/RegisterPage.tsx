import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import api from '../services/api';
import { UserPlus, ChevronDown } from 'lucide-react';
import { ACADEMIC_DATA } from '../constants/academicData';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['STUDENT', 'LECTURER']),
  registrationNumber: z.string().optional(),
  staffId: z.string().optional(),
  faculty: z.string().min(1, 'Faculty is required'),
  department: z.string().min(1, 'Department is required'),
}).refine(data => {
  if (data.role === 'STUDENT' && !data.registrationNumber) return false;
  if (data.role === 'LECTURER' && !data.staffId) return false;
  return true;
}, {
  message: "ID Number is required",
  path: ["registrationNumber"]
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' },
  });

  const selectedRole = watch('role');
  const selectedFaculty = watch('faculty');

  React.useEffect(() => {
    setValue('department', '');
  }, [selectedFaculty, setValue]);

  const availableDepartments = React.useMemo(() => {
    const faculty = ACADEMIC_DATA.find(f => f.name === selectedFaculty);
    return faculty ? faculty.departments : [];
  }, [selectedFaculty]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/register', data);
      setIsSubmitSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <div className="glass-card max-w-md p-8 border-card-border">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <UserPlus className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Registration Submitted</h2>
          <p className="text-foreground/60 mb-8">Your account has been created and is now pending approval by the Dean or HOD of the {watch('faculty')} Faculty.</p>
          <Link to="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] animate-pulse-slow animate-delay-1000"></div>
      </div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 border-card-border bg-card/60 backdrop-blur-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-primary/30">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Create Account</h1>
          <p className="text-foreground/60 mt-2">Join the OEMS platform today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground/80 ml-1">Full Name</label>
            <input {...register('name')} className="input-field w-full" placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground/80 ml-1">Phone Number</label>
            <input {...register('phoneNumber')} className="input-field w-full" placeholder="08012345678" />
            {errors.phoneNumber && <p className="text-xs text-red-500 ml-1">{errors.phoneNumber.message}</p>}
          </div>


          <div className="space-y-1 pb-2">
            <label className="text-sm font-medium text-foreground/60 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'STUDENT' ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 text-foreground' : 'bg-secondary border-card-border text-foreground/40 hover:border-primary/20'}`}>
                <input {...register('role')} type="radio" value="STUDENT" className="sr-only" />
                <span className="text-sm font-medium">Student</span>
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'LECTURER' ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 text-foreground' : 'bg-secondary border-card-border text-foreground/40 hover:border-primary/20'}`}>
                <input {...register('role')} type="radio" value="LECTURER" className="sr-only" />
                <span className="text-sm font-medium">Lecturer</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-foreground/80 ml-1">Faculty</label>
              <div className="relative">
                <select {...register('faculty')} className="input-field w-full appearance-none pr-10">
                  <option value="">Select Faculty</option>
                  {ACADEMIC_DATA.map(f => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              </div>
              {errors.faculty && <p className="text-xs text-red-500 ml-1">{errors.faculty.message}</p>}
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-foreground/80 ml-1">Department</label>
              <div className="relative">
                <select {...register('department')} className="input-field w-full appearance-none pr-10" disabled={!selectedFaculty}>
                  <option value="">Select Department</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              </div>
              {errors.department && <p className="text-xs text-red-500 ml-1">{errors.department.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground/80 ml-1">
              {selectedRole === 'STUDENT' ? 'Matric Number' : 'Staff ID'}
            </label>
            <input 
              {...register(selectedRole === 'STUDENT' ? 'registrationNumber' : 'staffId')} 
              className="input-field w-full uppercase" 
              placeholder={selectedRole === 'STUDENT' ? 'ENG/12/3456' : 'STAFF/001'} 
            />
            {(errors.registrationNumber || errors.staffId) && (
              <p className="text-xs text-red-500 ml-1">ID Number is required</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 text-lg" isLoading={isLoading}>
            Submit Registration
          </Button>

          <p className="text-center text-foreground/60 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
