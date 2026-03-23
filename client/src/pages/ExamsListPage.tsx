import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { BookOpen, Clock, AlertCircle, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExamsListPage = () => {
  const navigate = useNavigate();
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const response = await api.get('/exams');
      return response.data;
    },
  });

  const handleStartExam = async (examId: string) => {
    try {
      const response = await api.post(`/exams/${examId}/start`);
      const attempt = response.data;
      navigate(`/exam/${examId}/attempt/${attempt.id}`);
    } catch (err) {
      console.error('Failed to start exam', err);
      alert('Unable to start examination. Please try again.');
    }
  };

  if (isLoading) return <div className="text-white">Loading exams...</div>;
  if (error) return <div className="text-red-500">Error loading exams</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Available Exams</h1>
        <p className="text-gray-400 mt-1">Browse and participate in scheduled examinations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams?.map((exam: any) => (
          <div key={exam.id} className="glass-card p-6 border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-all">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary-light" />
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">Active</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">{exam.title}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{exam.description || 'No description available for this exam.'}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Clock className="w-4 h-4" />
                  <span>{exam.duration} Minutes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>100 Possible Points</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full gap-2 group-hover:bg-primary-hover"
              onClick={() => handleStartExam(exam.id)}
            >
              <PlayCircle className="w-5 h-5" />
              Start Examination
            </Button>
          </div>
        ))}

        {exams?.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center glass-card border-dashed border-white/10">
            <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-display font-bold text-gray-400">No exams available</h3>
            <p className="text-gray-500 mt-2">Check back later for scheduled assessments.</p>
          </div>
        )}
      </div>
    </div>
  );
};
