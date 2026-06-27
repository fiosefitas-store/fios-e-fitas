'use client';

import { SlidersHorizontal, ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';

interface CategorySidebarProps {
  subcategories: string[];
  selectedSubs: string[];
  onToggle: (subcategory: string) => void;

  sortBy: string;
  onSortChange: (sort: string) => void;

  hideCategories?: boolean;
}

export default function CategorySidebar({
  subcategories,
  selectedSubs,
  onToggle,
  sortBy,
  onSortChange,
  hideCategories = false,
}: CategorySidebarProps) {

  // if (!subcategories.length) return null;

  const options = [
    {
      label: 'Menor preço',
      value: 'Menor Preço',
      icon: ArrowDown,
    },
    {
      label: 'Maior preço',
      value: 'Maior Preço',
      icon: ArrowUp,
    },
    {
      label: 'Mais vendidos',
      value: 'Popularidade',
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="hidden lg:block w-72 shrink-0">

      {!hideCategories && subcategories.length > 0 && (
        <div className="rounded-xl border border-[#ECECEC] bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#3D261D] mb-5">
            Categoria
          </h2>

          <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
            {subcategories.map((subcategory) => (
              <label
                key={subcategory}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedSubs.includes(subcategory)}
                  onChange={() => onToggle(subcategory)}
                  className="w-4 h-4 rounded accent-primary"
                />

                <span className="text-[#5C3D31] group-hover:text-primary transition-colors">
                  {subcategory}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}


      {/* CARD ORDENAÇÃO */}
      <div className="mt-6 rounded-lg border border-[#ECECEC] bg-white/70 p-6 shadow-sm pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#3D261D]">
            Ordenar por
          </h2>

          <SlidersHorizontal size={18} className="text-primary" />
        </div>

        <div className="space-y-3">
          {options.map(({ label, value, icon: Icon }) => {
            const active = sortBy === value;

            return (
              <button
                key={value}
                onClick={() => onSortChange(value)}
                className={`w-full flex items-center gap-3 rounded-lg border-2 px-4 py-2.5 text-left transition
                  ${
                    active
                      ? 'bg-primary border-orange-200 text-white'
                      : 'border-gray-200 hover:bg-[#F8F3EF] text-[#5C3D31]'
                  }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}