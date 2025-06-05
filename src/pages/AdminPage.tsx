import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import styles from './AdminPage.module.css';

type Course = Database['public']['Tables']['cursos']['Row'];

function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('ordem');
      
      if (error) throw error;
      
      setCourses(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar cursos:', err);
      setError(err.message || 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      // Delete all lessons first
      const { error: lessonsError } = await supabase
        .from('aulas')
        .delete()
        .eq('curso_id', id);
      
      if (lessonsError) throw lessonsError;
      
      // Then delete the course
      const { error: courseError } = await supabase
        .from('cursos')
        .delete()
        .eq('id', id);
      
      if (courseError) throw courseError;
      
      // Update UI
      setCourses(courses.filter(course => course.id !== id));
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error('Erro ao excluir curso:', err);
      setError(err.message || 'Erro ao excluir curso');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Administração de Cursos</h1>
        <Link to="/admin/curso/novo" className={styles.newButton}>
          <PlusCircle size={18} />
          <span>Novo Curso</span>
        </Link>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <div className={styles.loading}>Carregando cursos...</div>
      ) : courses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum curso cadastrado.</p>
          <p>Comece criando seu primeiro curso!</p>
        </div>
      ) : (
        <div className={styles.courseList}>
          {courses.map(course => (
            <div key={course.id} className={styles.courseItem}>
              <div className={styles.courseInfo}>
                <h3>{course.titulo}</h3>
                <p>{course.descricao}</p>
              </div>
              
              <div className={styles.courseActions}>
                <Link 
                  to={`/admin/curso/${course.id}`} 
                  className={styles.editButton}
                  title="Editar curso"
                >
                  <Edit size={18} />
                </Link>
                
                {deleteConfirm === course.id ? (
                  <div className={styles.confirmDelete}>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className={styles.confirmYes}
                    >
                      Sim
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(null)}
                      className={styles.confirmNo}
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setDeleteConfirm(course.id)}
                    className={styles.deleteButton}
                    title="Excluir curso"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;