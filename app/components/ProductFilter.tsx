import { useState } from 'react';

export type FilterState = {
  category: string;
  skinType: string;
  sort: string;
  price: string;
};

interface ProductFilterProps {
  filters: FilterState;
  skinTypes: string[];
  skinTypeCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  onFilterChange: (updated: FilterState) => void;
  categories: {
    id: string;
    title: string;
    handle: string;
  }[];
}

export function ProductFilter({
  filters,
  onFilterChange,
  categories,
  skinTypes,
  skinTypeCounts,
  categoryCounts,
}: ProductFilterProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    const updated = { ...filters, [field]: value };
    onFilterChange(updated);
    updateUrlParams(updated);
  };

  // ✅ Update the URL without full page reload
  const updateUrlParams = (updated: FilterState) => {
    const url = new URL(window.location.href);

    // Update individual params
    if (updated.category) {
      url.searchParams.set('category', updated.category);
    } else {
      url.searchParams.delete('category');
    }

    if (updated.skinType) {
      url.searchParams.set('skinType', updated.skinType);
    } else {
      url.searchParams.delete('skinType');
    }

    if (updated.sort) {
      url.searchParams.set('sort', updated.sort);
    } else {
      url.searchParams.delete('sort');
    }

    if (updated.price) {
      url.searchParams.set('price', updated.price);
    } else {
      url.searchParams.delete('price');
    }

    // Push new state to browser (no reload)
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="container flex flex-col gap-2 p-4">
      <div>
        <p className="font-semibold font-gayathri !text-xl">Filter By:</p>
      </div>
      <div className="flex justify-between gap-4 mb-6">
        {/* Category & Skin Type */}
        <div className="flex gap-4 items-center">
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="border-b py-2 w-[200px]"
          >
            <option value="">Category</option>
            {categories.map((collection) => {
              const count = categoryCounts[collection.title] || 0;
              return (
                <option key={collection.id} value={collection.title}>
                  {collection.title} ({count})
                </option>
              );
            })}
          </select>

          <select
            value={filters.skinType}
            onChange={(e) => handleChange('skinType', e.target.value)}
            className="border-b py-2 w-[200px]"
          >
            <option value="">Skin Type</option>
            {skinTypes.map((type) => {
              const count = skinTypeCounts[type] || 0;
              return (
                <option key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                  {type} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Sort Option */}
        <div className="flex gap-2 items-center">
          <p>Sort by:</p>
          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="border-b py-2 w-[200px]"
          >
            <option value="RELEVANCE">Relevance</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="UPDATED_AT">Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
