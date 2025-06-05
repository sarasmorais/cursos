import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { PlusCircle, ArrowLeft, Save } from 'lucide-react';
import styles from './AdminCourseEdit.module.css';

type Course = Database['public']['Tables']['cursos']['Row'];
type Lesson = Database['public']['Tables']['aulas']['Row'];

function AdminCourseEdit() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isNewCourse = courseId === 'novo';
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(!isNewCourse);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNewCourse) {
      fetchCourseData();
    }
  }, [courseId, isNewCourse]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      // Fetch lessons for this course
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('aulas')
        .select('*')
        .eq('curso_id', courseId)
        .order('ordem');
      
      if (lessonsError) throw lessonsError;
      
      setTitle(courseData.titulo);
      setDescription(courseData.descricao);
      setLessons(lessonsData || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados do curso:', err);
      setError(err.message || 'Erro ao carregar dados do curso');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const courseData = {
        titulo: title,
        descricao: description,
      };
      
      let savedCourseId: string | number = courseId!;
      
      if (isNewCourse) {
        // Create new course
        const { data, error } = await supabase
          .from('cursos')
          .insert([courseData])
          .select();
        
        if (error) throw error;
        
        savedCourseId = data[0].id;
      } else {
        // Update existing course
        const { error } = await supabase
          .from('cursos')
          .update(courseData)
          .eq('id', courseId);
        
        if (error) throw error;
      }
      
      // Redirect to course list or to the new course edit page
      navigate(isNewCourse ? `/admin/curso/${savedCourseId}` : '/admin');
    } catch (err: any) {
      console.error('Erro ao salvar curso:', err);
      setError(err.message || 'Erro ao salvar curso');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando curso...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/admin" className={styles.backButton}>
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </Link>
        <h1>{isNewCourse ? 'Novo Curso' : 'Editar Curso'}</h1>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Título do Curso</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Digite o título do curso"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Digite uma breve descrição do curso"
          />
        </div>
        
        <button
          type="submit"
          className={styles.saveButton}
          disabled={saving}
        >
          <Save size={18} />
          <span>{saving ? 'Salvando...' : 'Salvar Curso'}</span>
        </button>
      </form>
      
      {!isNewCourse && (
        <div className={styles.lessonsSection}>
          <div className={styles.sectionHeader}>
            <h2>Aulas</h2>
            <Link to={`/admin/curso/${courseId}/aula/nova`} className={styles.newButton}>
              <PlusCircle size={18} />
              <span>Nova Aula</span>
            </Link>
          </div>
          
          {lessons.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma aula cadastrada para este curso.</p>
            </div>
          ) : (
            <div className={styles.lessonList}>
              {lessons.map((lesson, index) => (
                <Link 
                  key={lesson.id} 
                  to={`/admin/curso/${courseId}/aula/${lesson.id}`}
                  className={styles.lessonItem}
                >
                  <div className={styles.lessonNumber}>{index + 1}</div>
                  <div className={styles.lessonInfo}>
                    <h3>{lesson.titulo}</h3>
                    <span className={styles.lessonDuration}>{lesson.duracao}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminCourseEdit;