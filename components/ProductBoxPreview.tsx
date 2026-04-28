/**
 * ProductBoxPreview | Ultra-Premium Preview v10.0
 * Mobile-first editorial design — mirrors PremiumProductBox for in-app preview
 */

import React, { useState, useMemo } from 'react';
import { ProductDetails, DeploymentMode, FAQItem } from '../types';

interface ProductBoxPreviewProps {
  product: ProductDetails;
  affiliateTag?: string;
  mode?: DeploymentMode;
}

const DEFAULT_BULLETS = [
  "Premium build quality with attention to detail",
  "Industry-leading performance metrics",
  "Backed by comprehensive warranty",
  "Trusted by thousands of verified buyers"
];

const DEFAULT_FAQS: FAQItem[] = [
  { question: "Is this product covered by warranty?", answer: "Yes, comprehensive manufacturer warranty included for complete peace of mind." },
  { question: "How does shipping work?", answer: "Eligible for fast Prime shipping with free returns within 30 days." },
  { question: "What's included?", answer: "Complete package with all necessary accessories and documentation." },
  { question: "Is support available?", answer: "24/7 customer support available through phone, email, and live chat." }
];

const DEFAULT_VERDICT = "Engineered for discerning users who demand excellence — delivering professional-grade performance with meticulous attention to detail.";

/* ─── Star Rating ─── */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const uid = useMemo(() => `pbp-${Math.random().toString(36).slice(2, 8)}`, []);
  return (
    <div className="flex items-center gap-[2px]" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="w-4 h-4" viewBox="0 0 20 20">
          <defs><linearGradient id={uid}><stop offset="50%" stopColor="#fbbf24" /><stop offset="50%" stopColor="#e2e8f0" /></linearGradient></defs>
          <path fill={`url(#${uid})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 text-slate-200" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
};

/* ─── Main Export ─── */
export const ProductBoxPreview: React.FC<ProductBoxPreviewProps> = ({
  product,
  affiliateTag = 'tag-20',
  mode = 'ELITE_BENTO'
}) => {
  const [imgError, setImgError] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const generatePlaceholderSvg = (text: string) =>
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect fill="#f1f5f9" width="800" height="800"/><text x="400" y="410" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" font-weight="bold" fill="#94a3b8">${text}</text></svg>`)}`;

  const amazonLink = `https://www.amazon.com/dp/${product.asin || "B08N5M7S6K"}?tag=${affiliateTag}`;
  const imageSrc = imgError
    ? generatePlaceholderSvg(product.brand || 'Product')
    : (product.imageUrl || generatePlaceholderSvg('Product'));

  const bullets = useMemo(() => (product.evidenceClaims && product.evidenceClaims.length >= 3) ? product.evidenceClaims.slice(0, 4) : DEFAULT_BULLETS, [product.evidenceClaims]);
  const faqs = useMemo(() => (product.faqs && product.faqs.length >= 3) ? product.faqs.slice(0, 4) : DEFAULT_FAQS, [product.faqs]);
  const verdict = useMemo(() => (product.verdict && product.verdict.length > 30) ? product.verdict : DEFAULT_VERDICT, [product.verdict]);
  const currentDate = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), []);

  const handleImageError = () => setImgError(true);

  /* ─── Tactical Link (compact) ─── */
  if (mode === 'TACTICAL_LINK') {
    return (
      <div className="w-full max-w-[880px] mx-auto my-6 px-3 sm:px-4">
        <div className="relative bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] flex items-center gap-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-500 rounded-l-2xl" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 p-2">
            <img src={imageSrc} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply" onError={handleImageError} loading="lazy" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[7px] font-black uppercase tracking-[1.5px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Editor's Pick</span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm leading-tight line-clamp-2">{product.title}</h3>
          </div>
          <div className="flex flex-col items-center flex-shrink-0">
            <span className="text-xl font-black text-slate-900">{product.price}</span>
            <span className="text-[8px] font-bold uppercase text-blue-600 mt-1">View →</span>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Elite Bento (full) ─── */
  return (
    <div className="w-full max-w-[920px] mx-auto my-8 sm:my-12 px-3 sm:px-4 font-sans antialiased animate-fade-in">
      <div className="relative bg-white rounded-[24px] sm:rounded-[28px] border border-slate-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
          <div className="bg-slate-900/95 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-[2px] py-2 px-3.5 rounded-xl shadow-xl flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Editor's Choice
          </div>
        </div>

        {/* Image Hero */}
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 pb-4 sm:p-8 sm:pb-5 flex items-center justify-center min-h-[200px] sm:min-h-[260px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-slate-100/50" />
            <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full border border-blue-100/30" />
          </div>
          <img src={imageSrc} alt={product.title} onError={handleImageError} loading="lazy" className="relative z-10 w-auto max-h-[180px] sm:max-h-[240px] object-contain drop-shadow-2xl" />

          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-5 z-20">
            <div className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-lg px-3 py-1.5 rounded-full flex items-center gap-2">
              <StarRating rating={product.rating || 4.5} />
              <span className="text-[10px] font-bold text-slate-500">{(product.reviewCount || 0).toLocaleString()}</span>
            </div>
          </div>

          {product.prime && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-20">
              <span className="inline-flex items-center gap-1 bg-[#232f3e] text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                Prime
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 sm:px-7 pt-4 pb-5 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-[1.2px] px-3 py-1 rounded-full border border-blue-100/70">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {product.category || 'Premium Selection'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.15] tracking-tight">{product.title}</h2>

          <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl p-4 border border-slate-100/80">
            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{verdict}</p>
            <div className="flex items-center gap-2 mt-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Verified</span>
              <span className="text-[9px] font-medium text-slate-400">{currentDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-100">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-700 leading-snug">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 sm:px-7 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-[2px] block mb-1">Best Price</span>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter">{product.price}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[2px] shadow-xl flex items-center gap-2">
              Check Price
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="bg-slate-50/60 border-t border-slate-100 p-5 sm:p-7">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <h3 className="text-sm font-black text-slate-900">Common Questions</h3>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className={`w-full text-left rounded-xl border transition-all duration-300 overflow-hidden ${
                    expandedFaq === idx ? 'border-blue-200 bg-blue-50/60' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="p-3.5 flex items-start gap-2.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-black ${
                      expandedFaq === idx ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>Q{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-[13px] leading-snug">{faq.question}</h4>
                      <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: expandedFaq === idx ? '200px' : '0', opacity: expandedFaq === idx ? 1 : 0, marginTop: expandedFaq === idx ? '8px' : '0' }}>
                        <p className="text-[12px] text-slate-500 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trust */}
        <div className="border-t border-slate-100 bg-white px-5 py-3.5">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {['Amazon Verified', 'Secure Checkout', '30-Day Returns'].map(label => (
              <span key={label} className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBoxPreview;
