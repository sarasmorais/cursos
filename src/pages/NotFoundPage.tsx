import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <p>Página não encontrada</p>
      <Link to="/" className={styles.homeLink}>Voltar para a página inicial</Link>
    </div>
  );
}

export default NotFoundPage;