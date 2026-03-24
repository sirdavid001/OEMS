import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { FileText, Users, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InstructorExamsPage = () => {
  const queryClient = useQueryClient();
  
  const { data: exams, isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: async () => {
      const res = await api.get('/exams/my-exams');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (examId: string) => api.delete(`/exams/${examId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-exams'] });
    }
  });

  if (isLoading) return <div className="text-white">Loading your exams...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Examinations</h1>
          <p className="text-gray-400 mt-1">Manage, monitor, and evaluate your created assessments.</p>
        </div>
        <Link to="/dashboard/create-exam">
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            Create New Exam
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {exams?.map((exam: any) => (
          <div key={exam.id} className="glass-card p-6 border-white/5 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/30 transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <FileText className="w-8 h-8 text-primary-light" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-display font-bold text-white mb-1">{exam.title}</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {exam._count.attempts} Total Attempts</span>
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {exam._count.questions} Questions</span>
                <span className="flex items-center gap-1.5">
                  {exam.isPublished ? (
                    <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Published</span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Draft</span>
                  )}
                </span>
                <span>Created {new Date(exam.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" variant="secondary" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-400 border-red-400/20 hover:bg-red-400/10 gap-2"
                onClick={() => {
                   if (window.confirm('Are you sure you want to delete this exam?')) {
                     deleteMutation.mutate(exam.id);
                   }
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}

        {exams?.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center glass-card border-dashed border-white/10">
            <FileText className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-400">No exams created</h3>
            <p className="text-gray-500 mt-2">Start by creating your first examination module.</p>
          </div>
        )}
      </div>
    </div>
  );
};
