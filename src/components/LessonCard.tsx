import { Link } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';
import { Database } from '../lib/database.types';
import { Play, CheckCircle } from 'lucide-react';
import styles from './LessonCard.module.css';

type Lesson = Database['public']['Tables']['aulas']['Row'];

interface LessonCardProps {
  lesson: Lesson;
  courseId: number;
}

function LessonCard({ lesson, courseId }: LessonCardProps) {
  const { checkLessonCompletion } = useProgress();
  const isCompleted = checkLessonCompletion(lesson.id);

  return (
    <Link to={`/curso/${courseId}/aula/${lesson.id}`} className={styles.card}>
      <div className={`${styles.iconWrapper} ${isCompleted ? styles.completed : ''}`}>
        {isCompleted ? <CheckCircle size={20} /> : <Play size={20} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{lesson.titulo}</h3>
        <div className={styles.meta}>
          <span>{lesson.duracao}</span>
          {isCompleted && <span className={styles.completedBadge}>Concluída</span>}
        </div>
      </div>
      <button className={styles.startButton}>
        {isCompleted ? 'Rever' : 'Iniciar'}
      </button>
    </Link>
  );
}

export default LessonCard;