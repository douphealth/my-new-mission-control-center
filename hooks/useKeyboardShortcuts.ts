/**
 * ============================================================================
 * useKeyboardShortcuts Hook v1.0
 * ============================================================================
 * Enterprise-grade keyboard shortcut management with:
 * - Cross-platform support (Ctrl/Cmd)
 * - Conflict prevention
 * - Focus-aware activation
 * - Modifier key combinations
 * ============================================================================
 */

import { useEffect, useCallback, useRef } from 'react';

type ShortcutHandler = (e: KeyboardEvent) => void;
type ShortcutMap = Record<string, ShortcutHandler>;

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  ignoreInputs?: boolean;
}

const MODIFIER_KEYS = ['ctrl', 'meta', 'alt', 'shift'];

const parseShortcut = (shortcut: string): { modifiers: Set<string>; key: string } => {
  const parts = shortcut.toLowerCase().split('+').map(p => p.trim());
  const modifiers = new Set<string>();
  let key = '';

  for (const part of parts) {
    if (MODIFIER_KEYS.includes(part)) {
      modifiers.add(part);
    } else {
      key = part;
    }
  }

  return { modifiers, key };
};

const matchesShortcut = (e: KeyboardEvent, shortcut: string): boolean => {
  const { modifiers, key } = parseShortcut(shortcut);
  
  const eventKey = e.key.toLowerCase();
  const hasCtrl = modifiers.has('ctrl') === e.ctrlKey;
  const hasMeta = modifiers.has('meta') === e.metaKey;
  const hasAlt = modifiers.has('alt') === e.altKey;
  const hasShift = modifiers.has('shift') === e.shiftKey;
  
  const ctrlOrMeta = (modifiers.has('ctrl') && (e.ctrlKey || e.metaKey)) || 
                     (modifiers.has('meta') && (e.ctrlKey || e.metaKey));
  
  const modifiersMatch = modifiers.has('ctrl') || modifiers.has('meta')
    ? ctrlOrMeta && hasAlt && hasShift
    : hasCtrl && hasMeta && hasAlt && hasShift;

  return modifiersMatch && eventKey === key;
};

const isInputElement = (element: Element | null): boolean => {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || 
         (element as HTMLElement).isContentEditable;
};

export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  options: UseKeyboardShortcutsOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
  } = options;

  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    if (ignoreInputs && isInputElement(document.activeElement)) {
      const allowedInInputs = ['escape'];
      const shortcutKeys = Object.keys(shortcutsRef.current);
      const matchesAllowedInput = shortcutKeys.some(shortcut => {
        const { key } = parseShortcut(shortcut);
        return allowedInInputs.includes(key) && matchesShortcut(e, shortcut);
      });
      if (!matchesAllowedInput) return;
    }

    for (const [shortcut, handler] of Object.entries(shortcutsRef.current)) {
      if (matchesShortcut(e, shortcut)) {
        if (preventDefault) e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        handler(e);
        return;
      }
    }
  }, [enabled, preventDefault, stopPropagation, ignoreInputs]);

  useEffect(() => {
    if (!enabled) return;
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcuts;
