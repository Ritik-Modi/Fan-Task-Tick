import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BreakpointState {
  current: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export function useBreakpoint(): BreakpointState {
  const [breakpoint, setBreakpoint] = useState<BreakpointState>({
    current: 'xl',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let current: Breakpoint;
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < 640) {
        current = 'xs';
        isMobile = true;
      } else if (width >= 640 && width < 768) {
        current = 'sm';
        isMobile = true;
      } else if (width >= 768 && width < 1024) {
        current = 'md';
        isTablet = true;
      } else if (width >= 1024 && width < 1280) {
        current = 'lg';
        isDesktop = true;
      } else if (width >= 1280 && width < 1536) {
        current = 'xl';
        isDesktop = true;
      } else {
        current = '2xl';
        isDesktop = true;
      }

      setBreakpoint({ current, isMobile, isTablet, isDesktop, width });
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}



// ========================================
// TAILWIND BREAKPOINTS REFERENCE
// ========================================

/*
Default Tailwind CSS Breakpoints:

sm:  640px  and up   (Small devices - landscape phones)
md:  768px  and up   (Medium devices - tablets)
lg:  1024px and up   (Large devices - desktops)
xl:  1280px and up   (Extra large devices)
2xl: 1536px and up   (2X Extra large devices)

Usage in className:
- Mobile First (default, no prefix): styles apply to all sizes
- sm: applies from 640px and up
- md: applies from 768px and up
- lg: applies from 1024px and up
- xl: applies from 1280px and up
- 2xl: applies from 1536px and up

Examples:
className="text-sm md:text-base lg:text-lg"
  - Mobile: text-sm
  - Tablet (768px+): text-base
  - Desktop (1024px+): text-lg

className="hidden lg:block"
  - Mobile/Tablet: hidden
  - Desktop (1024px+): visible
*/



// ========================================
// QUICK REFERENCE CHEAT SHEET
// ========================================

/*
Common Breakpoint Patterns:

1. MOBILE FIRST (Tailwind Default):
   className="text-sm md:text-base lg:text-lg"

2. HIDE ON MOBILE:
   className="hidden md:block"

3. SHOW ONLY ON MOBILE:
   className="block md:hidden"

4. DIFFERENT LAYOUTS:
   className="flex-col md:flex-row"

5. RESPONSIVE GRID:
   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

6. RESPONSIVE SPACING:
   className="p-4 md:p-6 lg:p-8"

7. RESPONSIVE TEXT:
   className="text-sm md:text-base lg:text-lg xl:text-xl"

8. RESPONSIVE WIDTH:
   className="w-full md:w-1/2 lg:w-1/3"
   */