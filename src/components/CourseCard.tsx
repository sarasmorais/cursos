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
    <Link to={`/curso/${course.id}`} className={styles.card}>
      <div className={styles.iconWrapper}>
        <BookOpen size={24} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{course.titulo}</h3>
        <p className={styles.description}>{course.descricao}</p>
        <div className={styles.meta}>
          <span>{lessonCount} aulas</span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;