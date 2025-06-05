import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getAnonymousId } from '../lib/supabase';

interface LessonProgress {
  lessonId: number;
  completed: boolean;
  completedAt: string | null;
}

interface ProgressContextType {
  completedLessons: number[];
  markLessonAsCompleted: (lessonId: number) => Promise<void>;
  checkLessonCompletion: (lessonId: number) => boolean;
  getLessonCompletionDate: (lessonId: number) => string | null;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress data when component mounts
  useEffect(() => {
    const loadProgress = async () => {
      const anonymousId = getAnonymousId();
      
      const { data, error } = await supabase
        .from('conclusoes')
        .select('aula_id, data_conclusao')
        .eq('navegador_anon_id', anonymousId);
      
      if (error) {
        console.error('Erro ao carregar progresso:', error);
        setIsLoading(false);
        return;
      }
      
      const progressData = data.map(item => ({
        lessonId: item.aula_id,
        completed: true,
        completedAt: item.data_conclusao,
      }));
      
      setProgress(progressData);
      setIsLoading(false);
    };
    
    loadProgress();
  }, []);

  // Get array of completed lesson IDs
  const completedLessons = progress.filter(p => p.completed).map(p => p.lessonId);

  // Mark a lesson as completed
  const markLessonAsCompleted = async (lessonId: number) => {
    // Check if already completed
    if (completedLessons.includes(lessonId)) {
      return;
    }
    
    const anonymousId = getAnonymousId();
    const now = new Date().toISOString();
    
    // Add to Supabase
    const { error } = await supabase.from('conclusoes').insert({
      aula_id: lessonId,
      navegador_anon_id: anonymousId,
      data_conclusao: now,
    });
    
    if (error) {
      console.error('Erro ao marcar aula como concluída:', error);
      return;
    }
    
    // Update local state
    setProgress(prev => [
      ...prev,
      { lessonId, completed: true, completedAt: now }
    ]);
  };

  // Check if a lesson is completed
  const checkLessonCompletion = (lessonId: number): boolean => {
    return completedLessons.includes(lessonId);
  };

  // Get the completion date for a lesson
  const getLessonCompletionDate = (lessonId: number): string | null => {
    const lesson = progress.find(p => p.lessonId === lessonId);
    return lesson ? lesson.completedAt : null;
  };

  const value = {
    completedLessons,
    markLessonAsCompleted,
    checkLessonCompletion,
    getLessonCompletionDate,
    isLoading,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress deve ser usado dentro de um ProgressProvider');
  }
  return context;
}