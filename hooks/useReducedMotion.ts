/**
 * ============================================================================
 * useReducedMotion Hook v1.0
 * ============================================================================
 * Accessibility-first motion detection hook that respects user preferences.
 * Detects system-level reduced motion preferences for:
 * - Vestibular disorders
 * - Motion sensitivity
 * - Power saving modes
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    query.addEventListener('change', handler);
    
    return () => query.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

export const getAnimationStyle = (prefersReducedMotion: boolean): React.CSSProperties => {
  return prefersReducedMotion 
    ? { animation: 'none', transition: 'none' }
    : {};
};

export default useReducedMotion;
