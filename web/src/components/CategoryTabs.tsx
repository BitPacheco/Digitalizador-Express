import React from 'react';
import { StoreTheme } from '../types/catalog';
import { getThemeColors } from '../utils/theme';

interface CategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  theme?: StoreTheme;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  theme,
}) => {
  const colors = getThemeColors(theme);

  return (
    <div className="sticky top-[108px] z-20 backdrop-blur-md bg-slate-50/90 py-2.5 border-b border-slate-200/60">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                style={
                  isSelected && colors.primary
                    ? { backgroundColor: colors.primary }
                    : undefined
                }
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight shrink-0 transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
