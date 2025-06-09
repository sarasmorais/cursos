import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layers, BookOpen, User, LogOut, Home, Folder } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onNavClick?: () => void;
}

function Sidebar({ onNavClick }: SidebarProps) {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Link to="/" onClick={handleNavClick}>
          <Layers size={24} />
          <span>courseOS</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Navegação</h3>
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === '/' ? styles.active : ''}
                onClick={handleNavClick}
              >
                <Home size={18} />
                <span>Início</span>
              </Link>
            </li>
            <li>
              <Link
                to="/cursos"
                className={location.pathname.includes('/curso') ? styles.active : ''}
                onClick={handleNavClick}
              >
                <BookOpen size={18} />
                <span>Cursos</span>
              </Link>
            </li>
          </ul>
        </div>

        {isAdmin && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Administração</h3>
            <ul>
              <li>
                <Link
                  to="/admin"
                  className={location.pathname === '/admin' ? styles.active : ''}
                  onClick={handleNavClick}
                >
                  <Folder size={18} />
                  <span>Gerenciar Cursos</span>
                </Link>
              </li>

            </ul>
          </div>
        )}
      </nav>

      <div className={styles.footer}>
        {isAdmin ? (
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        ) : (
          <Link to="/login" className={styles.loginLink} onClick={handleNavClick}>
            <User size={18} />
            <span>Área do Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sidebar;