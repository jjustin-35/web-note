import { readable } from 'svelte/store';
import { browser } from '$app/environment';

interface Viewport {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const createViewportStore = () => {
  if (!browser) {
    return readable<Viewport>({
      width: 0,
      height: 0,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  }

  return readable<Viewport>(
    {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
    },
    (set) => {
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        set({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  );
};

export const viewport = createViewportStore();
