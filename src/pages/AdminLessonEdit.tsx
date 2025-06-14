import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import styles from './AdminLessonEdit.module.css';

// Tipo para módulos
type Module = {
  id: number;
  titulo: string;
  curso_id: number;
  ordem: number;
};

function AdminLessonEdit() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const isNewLesson = lessonId === 'nova';

  const cursoId = parseInt(courseId ?? '', 10);

  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('');
  const [order, setOrder] = useState(0);
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(!isNewLesson);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (cursoId && !isNaN(cursoId)) {
      fetchModules();
    }
    
    if (lessonId && lessonId !== 'nova') {
      fetchLessonData();
    } else if (cursoId && !isNaN(cursoId)) {
      fetchNextOrderValue();
    }
  }, [cursoId, lessonId]);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('modulos')
        .select('*')
        .eq('curso_id', cursoId)
        .order('ordem');

      if (error) throw error;

      setModules(data || []);
      
      // Se for uma nova aula e só há um módulo, seleciona automaticamente
      if (isNewLesson && data && data.length === 1) {
        setModuleId(data[0].id);
      }
    } catch (err: any) {
      console.error('Erro ao carregar módulos:', err);
      setError(err.message || 'Erro ao carregar módulos');
    }
  };

  const fetchLessonData = async () => {
    try {
      if (!lessonId || isNaN(Number(lessonId))) return;
      const { data, error } = await supabase
        .from('aulas')
        .select('*')
        .eq('id', parseInt(lessonId))
        .single();

      if (error) throw error;

      setTitle(data.titulo);
      setVideoUrl(data.video_url);
      setContent(data.conteudo_texto);
      setDuration(data.duracao);
      setOrder(data.ordem);
      setModuleId(data.modulo_id);
    } catch (err: any) {
      console.error('Erro ao carregar dados da aula:', err);
      setError(err.message || 'Erro ao carregar dados da aula');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextOrderValue = async () => {
    try {
      const { data, error } = await supabase
        .from('aulas')
        .select('ordem')
        .eq('curso_id', cursoId)
        .order('ordem', { ascending: false })
        .limit(1);

      if (error) throw error;

      const nextOrder = data.length > 0 ? data[0].ordem + 1 : 1;
      setOrder(nextOrder);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao determinar próxima ordem:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!cursoId || isNaN(cursoId)) {
        throw new Error('ID do curso inválido.');
      }

      if (!moduleId) {
        throw new Error('Por favor, selecione um módulo para a aula.');
      }

      const lessonData = {
        curso_id: cursoId,
        modulo_id: moduleId,
        titulo: title,
        video_url: videoUrl,
        conteudo_texto: content,
        duracao: duration,
        ordem: order,
      };

      if (isNewLesson || !lessonId || lessonId === 'undefined') {
        const { error } = await supabase.from('aulas').insert([lessonData]);
        if (error) throw error;
      } else {
        const parsedLessonId = parseInt(lessonId);
        if (isNaN(parsedLessonId)) throw new Error('ID da aula inválido.');
        const { error } = await supabase
          .from('aulas')
          .update(lessonData)
          .eq('id', parsedLessonId);
        if (error) throw error;
      }

      navigate(`/admin/curso/${courseId}`);
    } catch (err: any) {
      console.error('Erro ao salvar aula:', err);
      setError(err.message || 'Erro ao salvar aula');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lessonId || isNewLesson || isNaN(Number(lessonId))) return;

    setDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('aulas')
        .delete()
        .eq('id', parseInt(lessonId));

      if (error) throw error;

      navigate(`/admin/curso/${courseId}`);
    } catch (err: any) {
      console.error('Erro ao excluir aula:', err);
      setError(err.message || 'Erro ao excluir aula');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando aula...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/admin/curso/${courseId}`} className={styles.backButton}>
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </Link>
        <h1>{isNewLesson ? 'Nova Aula' : 'Editar Aula'}</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Título da Aula</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Digite o título da aula"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="module">Módulo</label>
          <select
            id="module"
            value={moduleId || ''}
            onChange={(e) => setModuleId(e.target.value ? parseInt(e.target.value) : null)}
            required
          >
            <option value="">Selecione um módulo</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.titulo}
              </option>
            ))}
          </select>
          <small className={styles.helper}>
            Escolha o módulo ao qual esta aula pertence
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="videoUrl">URL do Vídeo (YouTube)</label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <small className={styles.helper}>
            Cole a URL completa do vídeo do YouTube
          </small>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="duration">Duração</label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              placeholder="ex: 10:30"
            />
            <small className={styles.helper}>Formato: minutos:segundos</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="order">Ordem</label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              required
              min="1"
            />
            <small className={styles.helper}>Posição da aula no curso</small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Conteúdo da Aula</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            placeholder="Digite o conteúdo da aula (suporta HTML)"
          />
          <small className={styles.helper}>
            Você pode usar tags HTML para formatar o conteúdo
          </small>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            <Save size={18} />
            <span>{saving ? 'Salvando...' : 'Salvar Aula'}</span>
          </button>

          {!isNewLesson && (
            <>
              {showDeleteConfirm ? (
                <div className={styles.deleteConfirm}>
                  <p>Tem certeza que deseja excluir esta aula?</p>
                  <div className={styles.confirmButtons}>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className={styles.confirmYes}
                      disabled={deleting}
                    >
                      {deleting ? 'Excluindo...' : 'Sim, excluir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className={styles.confirmNo}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={18} />
                  <span>Excluir Aula</span>
                </button>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminLessonEdit;