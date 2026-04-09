import { useEffect } from 'react';

export const useNoIndex = () => {
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const existed = Boolean(robots);
    const previousContent = robots?.content;

    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }

    robots.content = 'noindex, nofollow';

    return () => {
      if (!robots) {
        return;
      }

      if (existed) {
        robots.content = previousContent ?? '';
      } else {
        robots.remove();
      }
    };
  }, []);
};