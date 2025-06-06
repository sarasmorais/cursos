import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ArrowLeft, PlusCircle } from 'lucide-react';
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
    if (!isNewCourse && courseId && courseId !== 'undefined' && courseId !== 'novo') {
      fetchCourseData();
    } else {
      setLoading(false);
    }
  }, [courseId, isNewCourse]);

  const fetchCourseData = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('cursos')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

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
        ordem: 0,
      };

      const isCreating = courseId === 'novo' || !courseId;
      let savedCourseId: string | number;

      if (isCreating) {
        const { data, error } = await supabase
          .from('cursos')
          .insert([courseData])
          .select('id');

        if (error || !data || !data[0]) throw error || new Error('Curso não foi salvo.');

        savedCourseId = data[0].id;
      } else {
        if (!courseId) throw new Error('ID do curso não encontrado.');

        const { error } = await supabase
          .from('cursos')
          .update(courseData)
          .eq('id', courseId);

        if (error) throw error;
        savedCourseId = courseId;
      }

      navigate(`/admin/curso/${savedCourseId}`);
    } catch (err: any) {
      console.error('Erro ao salvar curso:', err);
      setError(err.message || 'Erro ao salvar curso');
    } finally {
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
            placeholder="Digite uma breve descrição do curso"
          />
        </div>

        <button type="submit" className={styles.saveButton} disabled={saving}>
          Salvar Curso
        </button>
      </form>

      {!isNewCourse && (
        <div className={styles.lessonsSection}>
          <h2>Aulas</h2>
          <div className={styles.lessonsList}>
            {lessons.map((lesson) => (
              <div key={lesson.id} className={styles.lessonItem}>
                <div>
                  <strong>{lesson.titulo}</strong>
                  <p>{lesson.descricao}</p>
                  <small>Duração: {lesson.duracao} min</small>                </div>
              </div>
            ))}
          </div>

          <Link to={`/admin/curso/${courseId}/aula/nova`} className={styles.linkButton}>
            <PlusCircle size={18} />
            Nova Aula
          </Link>

        </div>
      )}
    </div>
  );
}

export default AdminCourseEdit;
