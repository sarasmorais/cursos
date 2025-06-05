import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CourseCard from '../components/CourseCard';
import { Database } from '../lib/database.types';
import styles from './HomePage.module.css';

type Course = Database['public']['Tables']['cursos']['Row'];

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonCounts, setLessonCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('cursos')
          .select('*')
          .order('ordem');
        
        if (coursesError) throw coursesError;
        
        // Fetch lesson counts for each course
        const courseIds = coursesData.map(course => course.id);
        const { data: lessonData, error: lessonError } = await supabase
          .from('aulas')
          .select('curso_id, id')
          .in('curso_id', courseIds);
        
        if (lessonError) throw lessonError;
        
        // Count lessons per course
        const counts: Record<number, number> = {};
        lessonData.forEach(lesson => {
          counts[lesson.curso_id] = (counts[lesson.curso_id] || 0) + 1;
        });
        
        setCourses(coursesData);
        setLessonCounts(counts);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Plataforma de Cursos Gratuitos</h1>
        <p>Aprenda habilidades valiosas com nossos cursos online gratuitos.</p>
      </div>
      
      <section className={styles.coursesSection}>
        <h2>Cursos Disponíveis</h2>
        
        {loading ? (
          <p>Carregando cursos...</p>
        ) : courses.length === 0 ? (
          <p>Nenhum curso disponível no momento.</p>
        ) : (
          <div className={styles.courseGrid}>
            {courses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                lessonCount={lessonCounts[course.id] || 0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;