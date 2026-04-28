/**
 * ProductCarousel | Swipeable Product Showcase v1.0
 * Touch-friendly horizontal carousel for multiple product boxes
 * Supports both PremiumProductBox and ProductBoxPreview
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ProductDetails, DeploymentMode } from '../types';
import { PremiumProductBox } from './PremiumProductBox';
import { ProductBoxPreview } from './ProductBoxPreview';

interface ProductCarouselProps {
  products: ProductDetails[];
  affiliateTag?: string;
  mode?: DeploymentMode;
  variant?: 'production' | 'preview';
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  affiliateTag,
  mode = 'ELITE_BENTO',
  variant = 'production',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const total = products.length;

  const scrollToIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, total - 1));
    setActiveIndex(clamped);
    if (scrollRef.current) {
      const child = scrollRef.current.children[clamped] as HTMLElement;
      if (child) {
        scrollRef.current.scrollTo({
          left: child.offsetLeft - scrollRef.current.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [total]);

  const goNext = useCallback(() => scrollToIndex(activeIndex + 1), [activeIndex, scrollToIndex]);
  const goPrev = useCallback(() => scrollToIndex(activeIndex - 1), [activeIndex, scrollToIndex]);

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
    setIsDragging(true);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsDragging(false);
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    
    // Only swipe if horizontal movement > vertical and fast enough
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40 && dt < 500) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStart.current = null;
  }, [goNext, goPrev]);

  // Scroll snap observer
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(el.children).indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIndex(idx);
          }
        });
      },
      { root: el, threshold: 0.6 }
    );
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [total]);

  if (total <= 1) {
    const product = products[0];
    if (!product) return null;
    return variant === 'preview'
      ? <ProductBoxPreview product={product} affiliateTag={affiliateTag} mode={mode} />
      : <PremiumProductBox product={product} affiliateTag={affiliateTag} mode={mode} />;
  }

  const ProductComponent = variant === 'preview' ? ProductBoxPreview : PremiumProductBox;

  return (
    <div className="relative w-full max-w-[960px] mx-auto my-8 sm:my-12">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 12H4M4 12l6-6M4 12l6 6" /></svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">
            {activeIndex + 1} / {total} Products
          </span>
        </div>

        {/* Nav arrows - desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-blue-300 hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous product"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={goNext}
            disabled={activeIndex === total - 1}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-blue-300 hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next product"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={scrollRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product, idx) => (
          <div key={product.id || idx} className="w-full flex-shrink-0 snap-center">
            <ProductComponent product={product} affiliateTag={affiliateTag} mode={mode} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === activeIndex
                ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm'
                : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Go to product ${idx + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint on mobile */}
      <p className="text-center text-[9px] text-slate-400 mt-2 sm:hidden font-medium">
        ← Swipe to browse products →
      </p>
    </div>
  );
};

export default ProductCarousel;
