// src/components/CourseCard.tsx
import { Link } from 'react-router-dom';
import { Database } from '../lib/database.types';
import { BookOpen } from 'lucide-react';
import styles from './CourseCard.module.css';

type Course = Database['public']['Tables']['cursos']['Row'];

interface CourseCardProps {
  course: Course;
  lessonCount?: number;
}

function CourseCard({ course, lessonCount = 0 }: CourseCardProps) {
  return (
    <Link to={`/curso/${course.id}`} className={`${styles.card} ${styles.fadeIn}`}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <BookOpen size={20} strokeWidth={2} />
        </div>
      </div>

      <h3 className={styles.title}>{course.titulo}</h3>
      <p className={styles.description}>{course.descricao}</p>

      <div className={styles.footer}>
        <span>{lessonCount} aula{lessonCount !== 1 ? 's' : ''}</span>
      </div>
    </Link>
  );
}

export default CourseCard;
