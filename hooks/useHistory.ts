// hooks/useHistory.ts - Enterprise Undo/Redo System

import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T, maxHistory = 50) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const lastActionRef = useRef<number>(Date.now());

  const set = useCallback((newPresent: T | ((prev: T) => T), options?: { merge?: boolean }) => {
    setHistory(prev => {
      const resolvedPresent = typeof newPresent === 'function' 
        ? (newPresent as (prev: T) => T)(prev.present) 
        : newPresent;

      // Merge rapid changes (within 500ms) into single history entry
      const now = Date.now();
      const shouldMerge = options?.merge || (now - lastActionRef.current < 500);
      lastActionRef.current = now;

      if (shouldMerge && prev.past.length > 0) {
        return {
          past: prev.past,
          present: resolvedPresent,
          future: [],
        };
      }

      const newPast = [...prev.past, prev.present].slice(-maxHistory);

      return {
        past: newPast,
        present: resolvedPresent,
        future: [],
      };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];

      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future].slice(0, maxHistory),
      };
    });
  }, [maxHistory]);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const [newPresent, ...newFuture] = prev.future;

      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  const historyLength = history.past.length;

  return {
    state: history.present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength,
    reset: (newState: T) => setHistory({ past: [], present: newState, future: [] }),
  };
}
