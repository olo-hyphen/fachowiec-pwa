import { useIsMobile } from "./use-mobile";

/**
 * Hook to determine whether to use Dialog or Drawer based on screen size
 * On mobile devices, Drawer provides a better UX with full-screen forms
 * On desktop, Dialog provides a modal experience
 */
export function useResponsiveDialog() {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    // Returns true if we should use Drawer instead of Dialog
    shouldUseDrawer: isMobile,
  };
}
