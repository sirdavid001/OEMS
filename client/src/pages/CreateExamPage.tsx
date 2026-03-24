import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Save, FileText, Target, ChevronDown, Upload, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { ACADEMIC_DATA } from '../constants/academicData';
import { MathContent } from '../components/ui/MathContent';
import Papa from 'papaparse';

export const CreateExamPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPreview, setShowPreview] = React.useState<Record<number, boolean>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
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

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedQuestions = results.data.map((row: any) => ({
          text: row.Question || row.text || '',
          type: (row.Type || row.type || 'MCQ').toUpperCase(),
          points: parseInt(row.Points || row.points || '5'),
          answer: row.Answer || row.answer || '',
          options: row.Options || row.options || (row.type === 'MCQ' ? '{"a": "", "b": "", "c": ""}' : '')
        }));
        
        if (importedQuestions.length > 0) {
          const currentData = watch();
          reset({
            ...currentData,
            questions: importedQuestions
          });
        }
      },
      error: (err) => {
        setError('Error parsing CSV file');
        console.error(err);
      }
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/exams', {
        ...data,
        duration: parseInt(data.duration),
        isPublished: true,
      });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to create exam', err);
      setError(err.response?.data?.message || 'Error creating exam. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreview = (index: number) => {
    setShowPreview(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Create New Examination</h1>
          <p className="text-foreground/60 mt-1">Design your assessment with questions and scoring rules.</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <Button 
            variant="secondary" 
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-5 h-5" />
            Bulk Import (CSV)
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading} className="gap-2 px-8">
            <Save className="w-5 h-5" />
            Publish Exam
          </Button>
        </div>
      </div>

      <form className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Basic Info & Targeting (omitted for brevity in replace, but keeping structure) */}
        {/* ... (Basic Info and Targeting Info components here - I'll keep them as they were but wrapped in the form) */}
        <div className="glass-card p-8 border-card-border space-y-6">
          <div className="flex items-center gap-3 text-primary mb-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm text-foreground/40">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-foreground/60">Exam Title</label>
              <input {...register('title')} className="input-field w-full" placeholder="e.g. Final Semester Physics" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-foreground/60">Description</label>
              <textarea {...register('description')} className="input-field w-full min-h-[100px]" placeholder="Brief overview of the exam..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/60">Duration (Minutes)</label>
              <input {...register('duration')} type="number" className="input-field w-full" />
            </div>
          </div>
        </div>

        <div className="glass-card p-8 border-card-border space-y-6">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Target className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-widest text-sm text-foreground/40">Target Audience</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-foreground/60">Faculty (Optional)</label>
              <div className="relative">
                <select {...register('faculty')} className="input-field w-full appearance-none pr-10">
                  <option value="">All Faculties</option>
                  {ACADEMIC_DATA.map(f => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-foreground/60">Department (Optional)</label>
              <div className="relative">
                <select {...register('department')} className="input-field w-full appearance-none pr-10" disabled={!selectedFaculty}>
                  <option value="">All Departments</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-foreground">Questions Palette</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => append({ text: '', type: 'MCQ', points: 5, answer: '', options: '{"a": "", "b": "", "c": ""}' })} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="glass-card p-8 border-card-border relative group animate-slide-up">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => togglePreview(index)}
                    className="p-2 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Toggle Formula Preview"
                  >
                    {showPreview[index] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-sm text-foreground/40 font-bold uppercase tracking-widest">
                    <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/30">{index + 1}</span>
                    Question Details
                  </div>

                  <div className="space-y-4">
                    {showPreview[index] ? (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 min-h-[100px]">
                        <MathContent content={watch(`questions.${index}.text`)} />
                      </div>
                    ) : (
                      <textarea 
                        {...register(`questions.${index}.text` as const)} 
                        className="input-field w-full text-lg font-medium" 
                        placeholder="What is your question? Use $...$ for equations."
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase">Type</label>
                        <select {...register(`questions.${index}.type` as const)} className="input-field w-full">
                          <option value="MCQ">Multiple Choice</option>
                          <option value="TRUE_FALSE">True / False</option>
                          <option value="THEORY">Theory / Written</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase">Correct Answer</label>
                        <input {...register(`questions.${index}.answer` as const)} className="input-field w-full" placeholder="e.g. a or true" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase">Points</label>
                        <input {...register(`questions.${index}.points` as const)} type="number" className="input-field w-full" />
                      </div>
                    </div>

                    {watch(`questions.${index}.type`) === 'MCQ' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-foreground/40 uppercase">Options (JSON Object)</label>
                        <input {...register(`questions.${index}.options` as const)} className="input-field w-full font-mono text-sm" placeholder='{"a": "Option A", "b": "Option B"}' />
                        {showPreview[index] && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {Object.entries(JSON.parse(watch(`questions.${index}.options`) || '{}')).map(([k, v]: [string, any]) => (
                              <div key={k} className="text-xs text-foreground/60 bg-primary/5 p-2 rounded flex gap-2 border border-primary/10">
                                <span className="font-bold text-primary uppercase">{k}:</span>
                                <MathContent content={v} />
                              </div>
                            ))}
                          </div>
                        )}
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
