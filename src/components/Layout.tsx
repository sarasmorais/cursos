import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import styles from './Layout.module.css';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <button 
        className={styles.menuToggle}
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <Sidebar onNavClick={() => setSidebarOpen(false)} />
      </aside>
      
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;