// components/ProductFilter.tsx

import {useState} from 'react';

export type FilterState = {
  category: string;
  skinType: string;
  sort: string;
  price: string;
};

interface ProductFilterProps {
  filters: FilterState;
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
}: ProductFilterProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({...filters, [field]: value});
  };

  return (
    <div className="container flex flex-col gap-2">
      <div>
        <p className="font-semibold">Filter By:</p>
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
            {categories.map((collection) => (
                <option key={collection.id} value={collection.title}>
                {collection.title}
                </option>
            ))}
            </select>


          <select
            value={filters.skinType}
            onChange={(e) => handleChange('skinType', e.target.value)}
            className="border-b py-2 w-[200px]"
          >
            <option value="">Skin Type</option>
            <option value="dry">Dry</option>
            <option value="oily">Oily</option>
            <option value="sensitive">Sensitive</option>
            <option value="combination">Combination</option>
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
