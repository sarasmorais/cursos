import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import CourseCard from '../components/CourseCard';
import { Database } from '../lib/database.types';
import { Search, X } from 'lucide-react';
import styles from './CoursesPage.module.css';

type Course = Database['public']['Tables']['cursos']['Row'];

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonCounts, setLessonCounts] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrar cursos baseado no termo de pesquisa
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) {
      return courses;
    }

    const term = searchTerm.toLowerCase();
    return courses.filter(course =>
      course.titulo.toLowerCase().includes(term) ||
      course.descricao.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Plataforma de Cursos Gratuitos</h1>
        <p>Aprenda habilidades valiosas com nossos cursos online gratuitos.</p>
      </div>

      <section className={styles.coursesSection}>
        <div className={styles.sectionHeader}>
          <h2>Cursos Disponíveis</h2>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Pesquisar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className={styles.clearButton}
                  aria-label="Limpar pesquisa"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {searchTerm && (
          <div className={styles.searchResults}>
            <p>
              {filteredCourses.length === 0
                ? `Nenhum curso encontrado para "${searchTerm}"`
                : `${filteredCourses.length} curso${filteredCourses.length !== 1 ? 's' : ''} encontrado${filteredCourses.length !== 1 ? 's' : ''} para "${searchTerm}"`
              }
            </p>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>
            <p>Carregando cursos...</p>
          </div>
        ) : filteredCourses.length === 0 && !searchTerm ? (
          <div className={styles.emptyState}>
            <p>Nenhum curso disponível no momento.</p>
          </div>
        ) : filteredCourses.length === 0 && searchTerm ? (
          <div className={styles.noResults}>
            <p>Não encontramos cursos com os termos pesquisados.</p>
            <p>Tente usar palavras-chave diferentes ou verifique a ortografia.</p>
          </div>
        ) : (
          <div className={styles.courseGrid}>
            {filteredCourses.map(course => (
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

export default CoursesPage;
