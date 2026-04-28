/**
 * ComparisonTablePreview | Ultra-Premium Mobile-First Comparison v9.0
 * Card-based layout on mobile, grid on desktop. Glass morphism + micro-animations.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ComparisonData, ProductDetails } from '../types';
import { toast } from 'sonner';

type HighlightBadge = 'top-pick' | 'authors-favorite' | 'best-value' | 'best-budget' | null;

interface ProductHighlight {
  badge: HighlightBadge;
  standoutSpecs: Array<{ label: string; value: string }>;
}

interface ComparisonTablePreviewProps {
  data: ComparisonData;
  products: ProductDetails[];
  affiliateTag: string;
  allProducts?: ProductDetails[];
  onUpdate?: (updatedData: ComparisonData) => void;
  editable?: boolean;
}

const BADGE_CONFIG: Record<
  NonNullable<HighlightBadge>,
  { label: string; icon: string; gradient: string; textColor: string; bgColor: string; glowColor: string; ring: string }
> = {
  'top-pick': {
    label: 'Top Pick',
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    gradient: 'from-blue-600 to-indigo-600',
    textColor: 'text-white',
    bgColor: 'bg-blue-50/40',
    glowColor: 'shadow-blue-500/20',
    ring: 'ring-blue-200',
  },
  'authors-favorite': {
    label: "Author's Favorite",
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    gradient: 'from-rose-500 to-pink-600',
    textColor: 'text-white',
    bgColor: 'bg-rose-50/40',
    glowColor: 'shadow-rose-500/20',
    ring: 'ring-rose-200',
  },
  'best-value': {
    label: 'Best Value',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'from-emerald-500 to-green-600',
    textColor: 'text-white',
    bgColor: 'bg-emerald-50/40',
    glowColor: 'shadow-emerald-500/20',
    ring: 'ring-emerald-200',
  },
  'best-budget': {
    label: 'Best Budget',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    gradient: 'from-amber-500 to-orange-500',
    textColor: 'text-white',
    bgColor: 'bg-amber-50/40',
    glowColor: 'shadow-amber-500/20',
    ring: 'ring-amber-200',
  },
};

const ALL_BADGES: Array<{ id: HighlightBadge; label: string }> = [
  { id: 'top-pick', label: 'Top Pick' },
  { id: 'authors-favorite', label: "Author's Favorite" },
  { id: 'best-value', label: 'Best Value' },
  { id: 'best-budget', label: 'Best Budget' },
  { id: null, label: 'No Badge' },
];

/* ─── Star Rating ─── */
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  const uid = useMemo(() => `ct-${Math.random().toString(36).slice(2, 8)}`, []);
  return (
    <div className="flex items-center gap-[1px]" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} className="w-3 h-3 text-amber-400 drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="w-3 h-3" viewBox="0 0 20 20">
          <defs><linearGradient id={uid}><stop offset="50%" stopColor="#fbbf24" /><stop offset="50%" stopColor="#e2e8f0" /></linearGradient></defs>
          <path fill={`url(#${uid})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} className="w-3 h-3 text-slate-200" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
};

const PrimeBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#232F3E] text-white text-[8px] font-extrabold uppercase tracking-wider rounded-md shadow-sm">
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    Prime
  </span>
);

/* ─── Product Picker ─── */
const ProductPicker: React.FC<{
  availableProducts: ProductDetails[];
  onSelect: (productId: string) => void;
  onClose: () => void;
}> = ({ availableProducts, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!search.trim()) return availableProducts;
    const q = search.toLowerCase();
    return availableProducts.filter(p => p.title.toLowerCase().includes(q) || (p.brand != null && p.brand.toLowerCase().includes(q)) || p.asin.toLowerCase().includes(q));
  }, [availableProducts, search]);

  return (
    <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-72 sm:w-80 max-h-80 flex flex-col animate-fade-in">
      <div className="p-3 border-b border-slate-100 sticky top-0 bg-white z-10">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" autoFocus />
      </div>
      <div className="overflow-y-auto flex-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">{availableProducts.length === 0 ? 'No products available.' : 'No matching products.'}</div>
        ) : filtered.map((p) => (
          <button key={p.id} onClick={() => onSelect(p.id)} className="w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-0">
            {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-0.5 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-slate-300 text-[8px]">IMG</span></div>}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{p.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-500">{p.price}</span>
                {p.rating != null && <span className="text-xs text-amber-500">{"\u2605"} {p.rating.toFixed(1)}</span>}
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </div>
          </button>
        ))}
      </div>
      <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-end">
        <button onClick={onClose} className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
      </div>
    </div>
  );
};

/* ─── Spec Editor ─── */
const SpecEditor: React.FC<{ specs: string[]; onUpdate: (specs: string[]) => void; onClose: () => void }> = ({ specs, onUpdate, onClose }) => {
  const [newSpec, setNewSpec] = useState('');
  const addSpec = () => { const t = newSpec.trim(); if (!t || specs.includes(t)) return; onUpdate([...specs, t]); setNewSpec(''); };
  return (
    <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-64 sm:w-72 animate-fade-in">
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-sm font-bold text-slate-900 mb-3">Comparison Specs</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {specs.map((spec) => (
            <div key={spec} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
              <span className="text-xs font-medium text-slate-700">{spec}</span>
              <button onClick={() => onUpdate(specs.filter(x => x !== spec))} className="w-5 h-5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 flex gap-2">
        <input type="text" value={newSpec} onChange={(e) => setNewSpec(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSpec()} placeholder="Add new spec..." className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400" />
        <button onClick={addSpec} disabled={!newSpec.trim()} className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-all">Add</button>
      </div>
      <div className="p-2 border-t border-slate-100 flex justify-end">
        <button onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Done</button>
      </div>
    </div>
  );
};

/* ─── Badge Picker ─── */
const BadgePicker: React.FC<{ currentBadge: HighlightBadge; onSelect: (badge: HighlightBadge) => void; onClose: () => void }> = ({ currentBadge, onSelect, onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-52 animate-fade-in">
    <div className="p-2 border-b border-slate-100"><h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">Set Badge</h4></div>
    <div className="p-2 space-y-1">
      {ALL_BADGES.map((b) => (
        <button key={b.id ?? 'none'} onClick={() => { onSelect(b.id); onClose(); }} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${currentBadge === b.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}>
          {b.id != null ? (
            <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${BADGE_CONFIG[b.id].gradient} flex items-center justify-center`}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={BADGE_CONFIG[b.id].icon} /></svg>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </div>
          )}
          <span>{b.label}</span>
          {currentBadge === b.id && <svg className="ml-auto w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>}
        </button>
      ))}
    </div>
  </div>
);

/* ─── Standout Spec Editor ─── */
const StandoutSpecEditor: React.FC<{
  specs: Array<{ label: string; value: string }>;
  onUpdate: (specs: Array<{ label: string; value: string }>) => void;
  onClose: () => void;
}> = ({ specs, onUpdate, onClose }) => {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const addSpec = () => { if (!label.trim() || !value.trim()) return; if (specs.length >= 2) { toast('Maximum 2 standout specs'); return; } onUpdate([...specs, { label: label.trim(), value: value.trim() }]); setLabel(''); setValue(''); };
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden w-64 sm:w-72 animate-fade-in">
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-sm font-bold text-slate-900 mb-1">Standout Specs</h4>
        <p className="text-[10px] text-slate-400">Up to 2 specs</p>
      </div>
      {specs.length > 0 && (
        <div className="p-3 space-y-2 border-b border-slate-100">
          {specs.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <div><span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{s.label}</span><span className="text-xs font-semibold text-slate-700 ml-2">{s.value}</span></div>
              <button onClick={() => onUpdate(specs.filter((_, j) => j !== i))} className="w-5 h-5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {specs.length < 2 && (
        <div className="p-3 space-y-2">
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Spec name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400" />
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" onKeyDown={(e) => e.key === 'Enter' && addSpec()} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400" />
          <button onClick={addSpec} disabled={!label.trim() || !value.trim()} className="w-full px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-all">Add Spec</button>
        </div>
      )}
      <div className="p-2 border-t border-slate-100 flex justify-end"><button onClick={onClose} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Done</button></div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export const ComparisonTablePreview: React.FC<ComparisonTablePreviewProps> = ({
  data,
  products,
  affiliateTag,
  allProducts,
  onUpdate,
  editable = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showSpecEditor, setShowSpecEditor] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [badgePickerFor, setBadgePickerFor] = useState<string | null>(null);
  const [standoutEditorFor, setStandoutEditorFor] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Record<string, ProductHighlight>>({});

  const finalTag = (affiliateTag || 'tag-20').trim();

  const sortedProducts = useMemo(
    () => data.productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as ProductDetails[],
    [data.productIds, products],
  );

  const addableProducts = useMemo(() => {
    const inTable = new Set(data.productIds);
    return (allProducts || products).filter((p) => !inTable.has(p.id));
  }, [allProducts, products, data.productIds]);

  const handleAddProduct = useCallback((productId: string) => {
    if (data.productIds.includes(productId)) { toast('Product already in comparison'); return; }
    onUpdate?.({ ...data, productIds: [...data.productIds, productId] });
    setShowPicker(false);
    toast('Product added');
  }, [data, onUpdate]);

  const handleRemoveProduct = useCallback((productId: string) => {
    if (data.productIds.length <= 2) { toast('Need at least 2 products'); return; }
    const newIds = data.productIds.filter((id) => id !== productId);
    onUpdate?.({ ...data, productIds: newIds, winnerId: data.winnerId === productId ? newIds[0] : data.winnerId });
    setHighlights((prev) => { const next = { ...prev }; delete next[productId]; return next; });
    toast('Product removed');
  }, [data, onUpdate]);

  const handleMoveProduct = useCallback((productId: string, direction: -1 | 1) => {
    const idx = data.productIds.indexOf(productId);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= data.productIds.length) return;
    const newIds = [...data.productIds];
    [newIds[idx], newIds[newIdx]] = [newIds[newIdx], newIds[idx]];
    onUpdate?.({ ...data, productIds: newIds });
  }, [data, onUpdate]);

  const handleSetBadge = useCallback((productId: string, badge: HighlightBadge) => {
    if (badge != null) onUpdate?.({ ...data, winnerId: productId });
    setHighlights((prev) => ({ ...prev, [productId]: { ...(prev[productId] || { badge: null, standoutSpecs: [] }), badge } }));
    setBadgePickerFor(null);
    if (badge != null) toast(`Badge: ${BADGE_CONFIG[badge].label}`);
  }, [data, onUpdate]);

  const handleUpdateStandoutSpecs = useCallback((productId: string, specs: Array<{ label: string; value: string }>) => {
    setHighlights((prev) => ({ ...prev, [productId]: { ...(prev[productId] || { badge: null, standoutSpecs: [] }), standoutSpecs: specs } }));
  }, []);

  const handleUpdateSpecs = useCallback((newSpecs: string[]) => { onUpdate?.({ ...data, specs: newSpecs }); }, [data, onUpdate]);
  const handleUpdateTitle = useCallback((newTitle: string) => { onUpdate?.({ ...data, title: newTitle }); }, [data, onUpdate]);

  const customSpecs = (data.specs || []).filter(s => !['rating', 'reviews', 'price', 'prime'].includes(s.toLowerCase()));

  const getSpecValue = (product: ProductDetails, spec: string): React.ReactNode => {
    const key = spec.toLowerCase();
    if (key === 'rating') return <StarRating rating={product.rating || 0} />;
    if (key === 'reviews') return <span className="font-semibold text-slate-700">{(product.reviewCount || 0).toLocaleString()}</span>;
    if (key === 'price') return <span className="text-base font-black text-slate-900">{product.price}</span>;
    if (key === 'prime') return product.prime ? <PrimeBadge /> : <span className="text-slate-400 text-xs">N/A</span>;
    const val = product.specs != null ? product.specs[spec] : undefined;
    if (val != null) return <span className="font-semibold text-slate-700">{val}</span>;
    return <span className="text-slate-300">{"\u2014"}</span>;
  };

  if (sortedProducts.length === 0) {
    return (
      <div className="w-full max-w-[1060px] mx-auto my-10 p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
        <p className="text-slate-400 font-bold mb-4">No products in comparison</p>
        {editable && onUpdate && (
          <div className="relative inline-block">
            <button onClick={() => setShowPicker(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all">Add Products</button>
            {showPicker && <ProductPicker availableProducts={addableProducts} onSelect={handleAddProduct} onClose={() => setShowPicker(false)} />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1060px] mx-auto my-8 sm:my-10 font-sans antialiased animate-fade-in px-3 sm:px-0">
      <div className="bg-white border border-slate-200/70 rounded-2xl sm:rounded-3xl shadow-[0_12px_48px_-12px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* ═══ Header ═══ */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 sm:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              {editable && onUpdate ? (
                <input type="text" value={data.title} onChange={(e) => handleUpdateTitle(e.target.value)} className="bg-transparent text-white font-black text-base sm:text-lg tracking-tight border-none outline-none w-full placeholder-slate-500 focus:ring-0" placeholder="Table title..." />
              ) : (
                <h3 className="text-white font-black text-base sm:text-lg tracking-tight">{data.title}</h3>
              )}
              <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">{sortedProducts.length} products compared</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Live Prices</span>
              </div>

              {editable && onUpdate && (
                <div className="flex items-center gap-1.5 ml-2 sm:ml-4">
                  <div className="relative">
                    <button onClick={() => { setShowPicker(!showPicker); setShowSpecEditor(false); }} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all" title="Add product">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                    {showPicker && <ProductPicker availableProducts={addableProducts} onSelect={handleAddProduct} onClose={() => setShowPicker(false)} />}
                  </div>
                  <div className="relative">
                    <button onClick={() => { setShowSpecEditor(!showSpecEditor); setShowPicker(false); }} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all" title="Edit specs">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>
                    </button>
                    {showSpecEditor && <SpecEditor specs={data.specs || []} onUpdate={handleUpdateSpecs} onClose={() => setShowSpecEditor(false)} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Product Cards / Columns ═══ */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${Math.max(540, sortedProducts.length * 200)}px` }}>
            <div className="grid divide-x divide-slate-100/80" style={{ gridTemplateColumns: `repeat(${sortedProducts.length}, 1fr)` }}>
              {sortedProducts.map((p, idx) => {
                const highlight = highlights[p.id] || { badge: null, standoutSpecs: [] };
                const badgeCfg = highlight.badge != null ? BADGE_CONFIG[highlight.badge] : null;
                const isHighlighted = badgeCfg != null;
                const isHovered = hoveredCol === p.id;

                return (
                  <div
                    key={p.id}
                    className={`relative p-4 sm:p-5 text-center transition-all duration-300 ${
                      isHighlighted ? `${badgeCfg.bgColor}` : 'bg-white hover:bg-slate-50/30'
                    }`}
                    onMouseEnter={() => setHoveredCol(p.id)}
                    onMouseLeave={() => { setHoveredCol(null); setBadgePickerFor(null); setStandoutEditorFor(null); }}
                  >
                    {/* Highlight top bar */}
                    {isHighlighted && <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${badgeCfg.gradient}`} />}

                    {/* Badge */}
                    {isHighlighted && (
                      <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                        <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${badgeCfg.gradient} ${badgeCfg.textColor} text-[7px] sm:text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg shadow-md ${badgeCfg.glowColor}`}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={badgeCfg.icon} /></svg>
                          {badgeCfg.label}
                        </span>
                      </div>
                    )}

                    {/* Edit Controls */}
                    {editable && onUpdate && isHovered && (
                      <div className="absolute top-2 right-2 z-20 flex flex-wrap gap-1 animate-fade-in max-w-[100px] justify-end">
                        <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); setBadgePickerFor(badgePickerFor === p.id ? null : p.id); setStandoutEditorFor(null); }} className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200 flex items-center justify-center transition-all shadow-sm" title="Set badge">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          </button>
                          {badgePickerFor === p.id && <BadgePicker currentBadge={highlight.badge} onSelect={(b) => handleSetBadge(p.id, b)} onClose={() => setBadgePickerFor(null)} />}
                        </div>
                        {isHighlighted && (
                          <div className="relative">
                            <button onClick={(e) => { e.stopPropagation(); setStandoutEditorFor(standoutEditorFor === p.id ? null : p.id); setBadgePickerFor(null); }} className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 flex items-center justify-center transition-all shadow-sm" title="Standout specs">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                            </button>
                            {standoutEditorFor === p.id && <StandoutSpecEditor specs={highlight.standoutSpecs} onUpdate={(s) => handleUpdateStandoutSpecs(p.id, s)} onClose={() => setStandoutEditorFor(null)} />}
                          </div>
                        )}
                        {idx > 0 && (
                          <button onClick={() => handleMoveProduct(p.id, -1)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all shadow-sm" title="Move left">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 19l-7-7 7-7" /></svg>
                          </button>
                        )}
                        {idx < sortedProducts.length - 1 && (
                          <button onClick={() => handleMoveProduct(p.id, 1)} className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all shadow-sm" title="Move right">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
                          </button>
                        )}
                        <button onClick={() => handleRemoveProduct(p.id)} className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-all shadow-sm" title="Remove">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className={`h-28 sm:h-32 flex items-center justify-center mb-3 ${isHighlighted ? 'mt-3' : 'mt-1'}`}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} className={`max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`} alt={p.title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center"><span className="text-slate-300 text-xs">No image</span></div>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-[12px] sm:text-[13px] font-bold text-slate-900 leading-snug mb-2.5 line-clamp-2 min-h-[36px]">{p.title}</h4>

                    {/* Rating */}
                    <div className="flex justify-center mb-2.5">
                      <div className="flex items-center gap-1">
                        <StarRating rating={p.rating || 0} />
                        <span className="text-[9px] font-bold text-slate-400">({(p.reviewCount || 0).toLocaleString()})</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mb-0.5">{p.price}</div>
                    <div className="text-[9px] text-slate-400 font-medium mb-2">{p.prime ? 'FREE Prime delivery' : 'Standard shipping'}</div>

                    {/* Standout specs */}
                    {highlight.standoutSpecs.length > 0 && (
                      <div className="flex flex-col gap-1 mb-3">
                        {highlight.standoutSpecs.map((s, i) => (
                          <div key={i} className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100/80 border border-amber-200/60 rounded-lg px-2.5 py-1 mx-auto">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            <span className="text-[8px] font-black uppercase tracking-wider text-amber-700">{s.label}:</span>
                            <span className="text-[9px] font-bold text-slate-800">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <a
                      href={`https://www.amazon.com/dp/${p.asin}?tag=${finalTag}`}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className={`inline-flex items-center justify-center w-full gap-1.5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                        isHighlighted && badgeCfg != null
                          ? `bg-gradient-to-r ${badgeCfg.gradient} text-white`
                          : 'bg-slate-900 text-white hover:bg-slate-700'
                      }`}
                    >
                      Check Price
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17l9.2-9.2M17 17V8H8" /></svg>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Spec Rows */}
            {customSpecs.length > 0 && (
              <div className="border-t border-slate-100/80">
                {customSpecs.map((spec, sIdx) => (
                  <div key={spec} className={`grid divide-x divide-slate-100/80 ${sIdx % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}`} style={{ gridTemplateColumns: `repeat(${sortedProducts.length}, 1fr)` }}>
                    {sortedProducts.map((p) => {
                      const hl = highlights[p.id];
                      const isHl = hl != null && hl.badge != null;
                      const cfg = isHl ? BADGE_CONFIG[hl.badge!] : null;
                      return (
                        <div key={p.id} className={`px-4 sm:px-5 py-3 text-center ${isHl ? `${cfg!.bgColor}` : ''}`}>
                          <div className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1">{spec}</div>
                          <div className="text-sm">{getSpecValue(p, spec)}</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Prime Row */}
            {sortedProducts.some((p) => p.prime) && (
              <div className="grid divide-x divide-slate-100/80 border-t border-slate-100/80" style={{ gridTemplateColumns: `repeat(${sortedProducts.length}, 1fr)` }}>
                {sortedProducts.map((p) => {
                  const hl = highlights[p.id];
                  const isHl = hl != null && hl.badge != null;
                  const cfg = isHl ? BADGE_CONFIG[hl.badge!] : null;
                  return (
                    <div key={p.id} className={`px-4 sm:px-5 py-2.5 text-center ${isHl ? `${cfg!.bgColor}` : 'bg-slate-50/30'}`}>
                      <div className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1">Shipping</div>
                      <div className="text-sm">{p.prime ? <PrimeBadge /> : <span className="text-slate-400 text-xs">Standard</span>}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50/60 px-5 sm:px-8 py-2.5 border-t border-slate-100/80 flex items-center justify-between">
          <p className="text-[8px] sm:text-[9px] text-slate-400">Prices and availability subject to change.</p>
          {editable && onUpdate && (
            <button onClick={() => setShowPicker(true)} className="text-[9px] font-bold text-blue-500 hover:text-blue-600 uppercase tracking-wider transition-colors flex items-center gap-1">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTablePreview;
