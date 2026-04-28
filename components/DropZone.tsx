/**
 * ============================================================================
 * DropZone Component v1.0
 * ============================================================================
 * Visual drop zone indicator for drag-and-drop editing with:
 * - Animated reveal on drag hover
 * - Position-aware labeling (before/after)
 * - Smooth transitions
 * - Accessibility considerations
 * ============================================================================
 */

import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface DropZoneProps {
  isActive: boolean;
  position: 'before' | 'after';
  itemType?: 'product' | 'block' | null;
}

export const DropZone: React.FC<DropZoneProps> = ({ 
  isActive, 
  position,
  itemType = 'block'
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div 
      className={`
        relative rounded-xl ease-out
        ${prefersReducedMotion ? '' : 'transition-all duration-200'}
        ${isActive 
          ? 'h-20 my-3 bg-gradient-to-r from-indigo-500/10 via-indigo-500/20 to-indigo-500/10 border-2 border-dashed border-indigo-500/50' 
          : 'h-1 my-0 bg-transparent border-0'
        }
      `}
      role="region"
      aria-label={isActive ? `Drop zone ${position} this item` : undefined}
    >
      {isActive && (
        <div className={`absolute inset-0 flex items-center justify-center ${prefersReducedMotion ? '' : 'animate-pulse'}`}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-900/30 flex items-center gap-2">
            <i className={`fa-solid ${position === 'before' ? 'fa-arrow-up' : 'fa-arrow-down'}`} />
            Drop {itemType === 'product' ? 'Product' : 'Block'} {position === 'before' ? 'Above' : 'Below'}
          </div>
        </div>
      )}
      
      {isActive && !prefersReducedMotion && (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
        </>
      )}
    </div>
  );
};

interface DraggableItemWrapperProps {
  children: React.ReactNode;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition: 'before' | 'after' | null;
  dragType?: 'product' | 'block';
}

export const DraggableItemWrapper: React.FC<DraggableItemWrapperProps> = ({
  children,
  isDragging,
  isDropTarget,
  dropPosition,
  dragType = 'block',
}) => {
  return (
    <div className={`transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : ''}`}>
      <DropZone 
        isActive={isDropTarget && dropPosition === 'before'} 
        position="before"
        itemType={dragType}
      />
      {children}
      <DropZone 
        isActive={isDropTarget && dropPosition === 'after'} 
        position="after"
        itemType={dragType}
      />
    </div>
  );
};

export default DropZone;
