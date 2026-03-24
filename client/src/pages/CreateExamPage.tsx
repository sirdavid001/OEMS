import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Save, FileText, Target, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { ACADEMIC_DATA } from '../constants/academicData';

export const CreateExamPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      duration: 60,
      faculty: '',
      department: '',
      questions: [{ text: '', type: 'MCQ', points: 5, answer: '', options: '{"a": "", "b": "", "c": ""}' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const selectedFaculty = watch('faculty');
  const availableDepartments = React.useMemo(() => {
    const faculty = ACADEMIC_DATA.find(f => f.name === selectedFaculty);
    return faculty ? faculty.departments : [];
  }, [selectedFaculty]);

  React.useEffect(() => {
    setValue('department', '');
  }, [selectedFaculty, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      // Create Exam with Questions in one go
      await api.post('/exams', {
        ...data,
        duration: parseInt(data.duration),
        isPublished: true, // Default to published for now
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to create exam', err);
      setError(err.response?.data?.message || 'Error creating exam. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Create New Examination</h1>
          <p className="text-gray-400 mt-1">Design your assessment with questions and scoring rules.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading} className="gap-2 px-8">
          <Save className="w-5 h-5" />
          Publish Exam
        </Button>
      </div>

      <form className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="glass-card p-8 border-white/5 space-y-6">
          <div className="flex items-center gap-3 text-primary-light mb-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-gray-400">Exam Title</label>
              <input {...register('title')} className="input-field w-full" placeholder="e.g. Final Semester Physics" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-gray-400">Description</label>
              <textarea {...register('description')} className="input-field w-full min-h-[100px]" placeholder="Brief overview of the exam..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Duration (Minutes)</label>
              <input {...register('duration')} type="number" className="input-field w-full" />
            </div>
          </div>
        </div>

        {/* Targeting Info */}
        <div className="glass-card p-8 border-white/5 space-y-6">
          <div className="flex items-center gap-3 text-primary-light mb-2">
            <Target className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Target Audience</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-400">Faculty (Optional)</label>
              <div className="relative">
                <select {...register('faculty')} className="input-field w-full appearance-none pr-10">
                  <option value="">All Faculties</option>
                  {ACADEMIC_DATA.map(f => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-gray-400">Department (Optional)</label>
              <div className="relative">
                <select 
                  {...register('department')} 
                  className="input-field w-full appearance-none pr-10"
                  disabled={!selectedFaculty}
                >
                  <option value="">All Departments</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-white">Questions Palette</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ text: '', type: 'MCQ', points: 5, answer: '', options: '{"a": "", "b": "", "c": ""}' })} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="glass-card p-8 border-white/5 relative group animate-slide-up">
                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute top-6 right-6 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-bold uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center border border-primary/30">{index + 1}</span>
                    Question Details
                  </div>

                  <div className="space-y-4">
                    <textarea 
                      {...register(`questions.${index}.text` as const)} 
                      className="input-field w-full text-lg font-medium" 
                      placeholder="What is your question?"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                        <select {...register(`questions.${index}.type` as const)} className="input-field w-full">
                          <option value="MCQ">Multiple Choice</option>
                          <option value="TRUE_FALSE">True / False</option>
                          <option value="THEORY">Theory / Written</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Correct Answer (Key)</label>
                        <input {...register(`questions.${index}.answer` as const)} className="input-field w-full" placeholder="e.g. a or true" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Points</label>
                        <input {...register(`questions.${index}.points` as const)} type="number" className="input-field w-full" />
                      </div>
                    </div>

                    {watch(`questions.${index}.type`) === 'MCQ' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Options (JSON Object)</label>
                        <input {...register(`questions.${index}.options` as const)} className="input-field w-full font-mono text-sm" placeholder='{"a": "Option A", "b": "Option B"}' />
                        <p className="text-[10px] text-gray-500 italic">Format: {"{\"a\": \"...\", \"b\": \"...\"}"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
