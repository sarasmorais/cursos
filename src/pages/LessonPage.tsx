import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, ChevronRight, Edit, CheckCircle } from 'lucide-react';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { Accordion, AccordionItem } from '../components/Accordion';
import styles from './LessonPage.module.css';

type Lesson = Database['public']['Tables']['aulas']['Row'];
type Course = Database['public']['Tables']['cursos']['Row'];

function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { markLessonAsCompleted, checkLessonCompletion } = useProgress();
  const { isAdmin } = useAuth();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseId || !lessonId) return;
      
      try {
        // Fetch current lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('aulas')
          .select('*')
          .eq('id', lessonId)
          .single();
        
        if (lessonError) throw lessonError;
        
        // Fetch course
        const { data: courseData, error: courseError } = await supabase
          .from('cursos')
          .select('*')
          .eq('id', courseId)
          .single();
        
        if (courseError) throw courseError;
        
        // Fetch next and previous lessons
        const { data: allLessons, error: allLessonsError } = await supabase
          .from('aulas')
          .select('*')
          .eq('curso_id', courseId)
          .order('ordem');
        
        if (allLessonsError) throw allLessonsError;
        
        // Find current lesson index
        const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
        
        // Set next and previous lessons
        const prevLessonData = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
        const nextLessonData = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
        
        setLesson(lessonData);
        setCourse(courseData);
        setPrevLesson(prevLessonData);
        setNextLesson(nextLessonData);
        
        // Check if lesson is completed
        const completed = checkLessonCompletion(parseInt(lessonId));
        setIsCompleted(completed);
      } catch (err) {
        console.error('Erro ao carregar dados da aula:', err);
        setError('Não foi possível carregar a aula. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLessonData();
  }, [courseId, lessonId, checkLessonCompletion]);

  const handleMarkAsCompleted = async () => {
    if (!lessonId) return;
    
    try {
      await markLessonAsCompleted(parseInt(lessonId));
      setIsCompleted(true);
    } catch (error) {
      console.error('Erro ao marcar aula como concluída:', error);
    }
  };

  // Extract YouTube video ID from URL
  const getYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  if (loading) {
    return <div className={styles.loading}>Carregando aula...</div>;
  }
  
  if (error || !lesson || !course) {
    return <div className={styles.error}>{error || 'Aula não encontrada'}</div>;
  }
  
  const videoId = getYoutubeId(lesson.video_url);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to={`/curso/${courseId}`}>{course.titulo}</Link>
          <ChevronRight size={16} />
          <span>{lesson.titulo}</span>
        </div>
        
        <h1>{lesson.titulo}</h1>
        
        {isAdmin && (
          <Link to={`/admin/curso/${courseId}/aula/${lessonId}`} className={styles.editButton}>
            <Edit size={16} />
            <span>Editar Aula</span>
          </Link>
        )}
      </div>
      
      <div className={styles.videoWrapper}>
        <YoutubeEmbed videoId={videoId} title={lesson.titulo} />
      </div>
      
      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.lessonContent} dangerouslySetInnerHTML={{ __html: lesson.conteudo_texto }} />
          
          <div className={styles.lessonNavigation}>
            {prevLesson && (
              <Link to={`/curso/${courseId}/aula/${prevLesson.id}`} className={styles.navButton}>
                <ChevronLeft size={18} />
                <span>Aula Anterior</span>
              </Link>
            )}
            
            {!isCompleted ? (
              <button className={styles.completeButton} onClick={handleMarkAsCompleted}>
                <CheckCircle size={18} />
                <span>Marcar como Concluída</span>
              </button>
            ) : (
              <div className={styles.completedBadge}>
                <CheckCircle size={18} />
                <span>Aula Concluída</span>
              </div>
            )}
            
            {nextLesson && (
              <Link to={`/curso/${courseId}/aula/${nextLesson.id}`} className={styles.navButton}>
                <span>Próxima Aula</span>
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
          
          <div className={styles.resourcesSection}>
            <h2>Recursos</h2>
            <ul className={styles.resourcesList}>
              <li>
                <a href="#" className={styles.resourceLink}>
                  Link para material complementar
                </a>
              </li>
              <li>
                <a href="#" className={styles.resourceLink}>
                  Documentação oficial
                </a>
              </li>
            </ul>
          </div>
          
          <div className={styles.downloadsSection}>
            <h2>Downloads</h2>
            <ul className={styles.downloadsList}>
              <li>
                <a href="#" className={styles.downloadLink}>
                  Código fonte da aula
                </a>
              </li>
              <li>
                <a href="#" className={styles.downloadLink}>
                  PDF com resumo da aula
                </a>
              </li>
            </ul>
          </div>
          
          <div className={styles.faqSection}>
            <h2>Perguntas Frequentes</h2>
            <Accordion>
              <AccordionItem title="Quanto tempo tenho acesso a este conteúdo?">
                <p>Este é um conteúdo gratuito com acesso ilimitado. Você pode acessar a qualquer momento!</p>
              </AccordionItem>
              <AccordionItem title="Posso fazer o download do vídeo?">
                <p>Não, os vídeos estão disponíveis apenas para streaming diretamente na plataforma.</p>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;