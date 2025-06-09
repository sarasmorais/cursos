import { GraduationCap, LayoutDashboard, Bolt } from 'lucide-react';
import styles from './LandingPage.module.css';

function LandingPage() {
  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <header className={styles.header}>
        <h1>Bem-vindo ao <span className={styles.highlight}>courseOS</span></h1>
        <p>Uma plataforma gratuita para aprender no seu ritmo, sem barreiras.</p>
      </header>

      <section className={styles.features}>
        <h2>Por que escolher o <span className={styles.highlight}>courseOS</span>?</h2>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.icon}><GraduationCap size={36} /></div>
            <h3>Cursos Gratuitos</h3>
            <p>Aprenda habilidades práticas com conteúdos 100% gratuitos e acessíveis.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}><LayoutDashboard size={36} /></div>
            <h3>Conteúdo Modular</h3>
            <p>Aulas divididas por tópicos e módulos, para você acompanhar seu progresso.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}><Bolt size={36} /></div>
            <h3>Acesso Imediato</h3>
            <p>Comece agora mesmo, sem necessidade de login ou cadastro obrigatório.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Clique em <strong>"Cursos"</strong> no menu lateral para explorar os conteúdos disponíveis.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
