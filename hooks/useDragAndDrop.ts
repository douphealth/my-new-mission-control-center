/**
 * ============================================================================
 * useDragAndDrop Hook v1.0
 * ============================================================================
 * Professional drag-and-drop system with:
 * - Visual drop zone indicators
 * - Smooth reordering animations
 * - Touch device support preparation
 * - Accessibility considerations
 * ============================================================================
 */

import { useState, useCallback, useRef, DragEvent } from 'react';

export interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedItemType: 'product' | 'block' | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | null;
}

export interface DragHandlers {
  onDragStart: (e: DragEvent, itemId: string, itemType: 'product' | 'block') => void;
  onDragOver: (e: DragEvent, targetId: string) => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent, targetId: string) => void;
  onDragEnd: () => void;
}

export interface UseDragAndDropReturn<T> {
  dragState: DragState;
  handlers: DragHandlers;
  getDragProps: (itemId: string, itemType: 'product' | 'block') => {
    draggable: boolean;
    onDragStart: (e: DragEvent) => void;
    onDragEnd: () => void;
  };
  getDropProps: (targetId: string) => {
    onDragOver: (e: DragEvent) => void;
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
  };
}

const initialDragState: DragState = {
  isDragging: false,
  draggedItemId: null,
  draggedItemType: null,
  dropTargetId: null,
  dropPosition: null,
};

export function useDragAndDrop<T extends { id: string }>(
  items: T[],
  onReorder: (items: T[]) => void
): UseDragAndDropReturn<T> {
  const [dragState, setDragState] = useState<DragState>(initialDragState);
  const dragCounterRef = useRef(0);

  const handleDragStart = useCallback((e: DragEvent, itemId: string, itemType: 'product' | 'block') => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.setData('application/x-item-type', itemType);
    
    const dragImage = document.createElement('div');
    dragImage.className = 'fixed pointer-events-none bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-2xl z-[9999]';
    dragImage.textContent = itemType === 'product' ? '📦 Product' : '📝 Block';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    setTimeout(() => document.body.removeChild(dragImage), 0);

    setDragState({
      isDragging: true,
      draggedItemId: itemId,
      draggedItemType: itemType,
      dropTargetId: null,
      dropPosition: null,
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position: 'before' | 'after' = e.clientY < midY ? 'before' : 'after';

    setDragState(prev => ({
      ...prev,
      dropTargetId: targetId,
      dropPosition: position,
    }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDragState(prev => ({
        ...prev,
        dropTargetId: null,
        dropPosition: null,
      }));
    }
  }, []);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
  }, []);

  const handleDrop = useCallback((e: DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounterRef.current = 0;

    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (!draggedId || draggedId === targetId) {
      setDragState(initialDragState);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position: 'before' | 'after' = e.clientY < midY ? 'before' : 'after';

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedId);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (draggedIndex !== -1) {
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      let insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
      if (draggedIndex < targetIndex) {
        insertIndex--;
      }
      newItems.splice(Math.max(0, insertIndex), 0, draggedItem);
      onReorder(newItems);
    }

    setDragState(initialDragState);
  }, [items, onReorder]);

  const handleDragEnd = useCallback(() => {
    dragCounterRef.current = 0;
    setDragState(initialDragState);
  }, []);

  const getDragProps = useCallback((itemId: string, itemType: 'product' | 'block') => ({
    draggable: true,
    onDragStart: (e: DragEvent) => handleDragStart(e, itemId, itemType),
    onDragEnd: handleDragEnd,
  }), [handleDragStart, handleDragEnd]);

  const getDropProps = useCallback((targetId: string) => ({
    onDragOver: (e: DragEvent) => handleDragOver(e, targetId),
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: (e: DragEvent) => handleDrop(e, targetId),
  }), [handleDragOver, handleDragEnter, handleDragLeave, handleDrop]);

  return {
    dragState,
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    },
    getDragProps,
    getDropProps,
  };
}

export default useDragAndDrop;
