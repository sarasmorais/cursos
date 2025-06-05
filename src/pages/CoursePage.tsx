import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, Edit } from 'lucide-react';
import LessonCard from '../components/LessonCard';
import { Accordion, AccordionItem } from '../components/Accordion';
import styles from './CoursePage.module.css';

type Course = Database['public']['Tables']['cursos']['Row'];
type Lesson = Database['public']['Tables']['aulas']['Row'];
type Module = Database['public']['Tables']['modulos']['Row'];

interface LessonWithModule extends Lesson {
  modulo_id?: number;
}

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAdmin } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('cursos')
          .select('*')
          .eq('id', courseId)
          .single();
        
        if (courseError) throw courseError;
        
        // Fetch modules for this course
        const { data: modulesData, error: modulesError } = await supabase
          .from('modulos')
          .select('*')
          .eq('curso_id', courseId)
          .order('ordem');
        
        if (modulesError) throw modulesError;
        
        // Fetch lessons for this course
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('aulas')
          .select('*')
          .eq('curso_id', courseId)
          .order('ordem');
        
        if (lessonsError) throw lessonsError;
        
        // Group lessons by module
        const modulesWithLessons = modulesData.map(module => {
          const moduleLessons = lessonsData.filter(
            (lesson: LessonWithModule) => lesson.modulo_id === module.id
          );
          
          return {
            ...module,
            lessons: moduleLessons,
          };
        });
        
        // Handle lessons without modules
        const lessonsWithoutModule = lessonsData.filter(
          (lesson: LessonWithModule) => !lesson.modulo_id
        );
        
        if (lessonsWithoutModule.length > 0) {
          modulesWithLessons.push({
            id: 0,
            curso_id: parseInt(courseId),
            titulo: 'Aulas',
            descricao: 'Aulas sem módulo específico',
            ordem: 9999,
            created_at: '',
            updated_at: '',
            lessons: lessonsWithoutModule,
          });
        }
        
        setCourse(courseData);
        setModules(modulesWithLessons);
      } catch (err) {
        console.error('Erro ao carregar dados do curso:', err);
        setError('Não foi possível carregar o curso. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return <div className={styles.loading}>Carregando curso...</div>;
  }
  
  if (error || !course) {
    return <div className={styles.error}>{error || 'Curso não encontrado'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/">Cursos</Link>
          <ChevronRight size={16} />
          <span>{course.titulo}</span>
        </div>
        
        <h1>{course.titulo}</h1>
        <p className={styles.description}>{course.descricao}</p>
        
        {isAdmin && (
          <Link to={`/admin/curso/${courseId}`} className={styles.editButton}>
            <Edit size={16} />
            <span>Editar Curso</span>
          </Link>
        )}
      </div>
      
      <div className={styles.content}>
        {modules.length === 0 ? (
          <p>Este curso ainda não possui aulas.</p>
        ) : (
          modules.map(module => (
            <div key={module.id} className={styles.module}>
              <div className={styles.moduleHeader}>
                <h2>{module.titulo}</h2>
                <p>{module.descricao}</p>
              </div>
              
              <div className={styles.lessons}>
                {module.lessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    courseId={parseInt(courseId!)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className={styles.faqSection}>
        <h2>Perguntas Frequentes</h2>
        <Accordion>
          <AccordionItem title="Como acessar as aulas?">
            <p>Basta clicar em uma aula na lista acima para começar a assistir. Não é necessário criar uma conta.</p>
          </AccordionItem>
          <AccordionItem title="Este curso tem certificado?">
            <p>Não, este é um curso gratuito e não oferecemos certificados no momento.</p>
          </AccordionItem>
          <AccordionItem title="Posso baixar as aulas para assistir offline?">
            <p>Não, as aulas são disponibilizadas apenas online através da nossa plataforma.</p>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default CoursePage;