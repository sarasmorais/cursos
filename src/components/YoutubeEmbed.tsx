import React from 'react';
import styles from './YoutubeEmbed.module.css';

interface YoutubeEmbedProps {
  videoId: string;
  title: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ videoId, title }) => {
  // Options to restrict YouTube player functionality:
  // - rel=0: Disables related videos
  // - modestbranding=1: Reduces YouTube branding
  // - disablekb=1: Disables keyboard controls
  // - controls=1: Shows video controls
  // - fs=0: Disables fullscreen button
  // - iv_load_policy=3: Disables video annotations
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;

  return (
    <div className={styles.videoContainer}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        className={styles.videoIframe}
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;