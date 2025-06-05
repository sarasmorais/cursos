import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Accordion.module.css';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={styles.accordionItem}>
      <button 
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className={styles.accordionContent}>
          {children}
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
}

export function Accordion({ children }: AccordionProps) {
  return <div className={styles.accordion}>{children}</div>;
}