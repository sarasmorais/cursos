import React from 'react';
import styles from './YoutubeEmbed.module.css';

interface YoutubeEmbedProps {
  videoId: string;
  title: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ videoId, title }) => {
  // Parâmetros para máxima restrição do YouTube:
  // - rel=0: Desativa vídeos relacionados
  // - modestbranding=1: Reduz a marca do YouTube
  // - controls=1: Mostra apenas controles básicos
  // - fs=0: Desativa botão de tela cheia
  // - iv_load_policy=3: Desativa anotações do vídeo
  // - showinfo=0: Remove informações do vídeo
  // - cc_load_policy=0: Desativa legendas por padrão
  // - disablekb=1: Desativa a maioria dos atalhos de teclado
  // - playsinline=1: Para dispositivos móveis
  // - widget_referrer: Remove referências externas
  
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&fs=0&controls=1&cc_load_policy=0&disablekb=1&playsinline=1&widget_referrer=deleted`;

  return (
    <div className={styles.videoContainer}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        className={styles.videoIframe}
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;