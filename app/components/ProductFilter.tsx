import {useState, useRef, useEffect} from 'react';
import {ChevronDown} from 'lucide-react';

export type FilterState = {
  category: string;
  skinType: string;
  skinConcern: string;
  ingredient: string;
  sort: string;
  price: string;
};

interface ProductFilterProps {
  filters: FilterState;
  skinTypes: string[];
  skinConcerns?: string[];
  onFilterChange: (updated: FilterState) => void;
  categories: {
    id: string;
    title: string;
    handle: string;
  }[];
  ingredients?: string[];
}

export function ProductFilter({
  filters,
  onFilterChange,
  categories,
  skinTypes,
  skinConcerns = [],
  ingredients = [],
}: ProductFilterProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    const updated = {...filters, [field]: value};
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

    if (updated.skinConcern) {
      url.searchParams.set('skinConcern', updated.skinConcern);
    } else {
      url.searchParams.delete('skinConcern');
    }

    if (updated.ingredient) {
      url.searchParams.set('ingredient', updated.ingredient);
    } else {
      url.searchParams.delete('ingredient');
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
        <p className="font-semibold font-poppins !text-xl">Filter By:</p>
      </div>
      <div className="flex justify-between gap-4 mb-6">
        {/* Category & Skin Type */}
        <div className="flex gap-4 items-center">
          <CustomDropdown
            value={filters.category}
            onChange={(value) => handleChange('category', value)}
            options={categories.map((collection) => ({
              value: collection.title,
              label: collection.title,
            }))}
            placeholder="Category"
            className="w-[200px]"
          />

          <CustomDropdown
            value={filters.skinType}
            onChange={(value) => handleChange('skinType', value)}
            options={skinTypes.map((type) => ({
              value: type.toLowerCase().replace(/\s+/g, '_'),
              label: type,
            }))}
            placeholder="Skin Type"
            className="w-[200px]"
          />

          <CustomDropdown
            value={filters.skinConcern}
            onChange={(value) => handleChange('skinConcern', value)}
            options={skinConcerns.map((concern) => ({
              value: concern.toLowerCase().replace(/\s+/g, '_'),
              label: concern,
            }))}
            placeholder="Skin Concern"
            className="w-[200px]"
          />

          <CustomDropdown
            value={filters.ingredient}
            onChange={(value) => handleChange('ingredient', value)}
            options={ingredients.map((ingredient) => ({
              value: ingredient.toLowerCase().replace(/\s+/g, '_'),
              label: ingredient,
            }))}
            placeholder="Ingredient"
            className="w-[200px]"
          />
        </div>

        {/* Sort Option */}
        <div className="flex gap-2 items-center">
          <p>Sort by:</p>
          <CustomDropdown
            value={filters.sort}
            onChange={(value) => handleChange('sort', value)}
            options={[
              {value: 'RELEVANCE', label: 'Relevance'},
              {value: 'PRICE_ASC', label: 'Price: Low to High'},
              {value: 'PRICE_DESC', label: 'Price: High to Low'},
              {value: 'UPDATED_AT', label: 'Newest'},
            ]}
            placeholder="Sort by"
            className="w-[200px]"
          />
        </div>
      </div>
    </div>
  );
}

// Custom Dropdown Component
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{value: string; label: string}>;
  placeholder: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-b border-gray-300 py-2 px-3 text-left flex items-center justify-between hover:border-[#2B8C57] transition-colors duration-300 cursor-pointer"
      >
        <span className={value ? 'text-black' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200 text-gray-500"
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-[#2B8C57] hover:text-white transition-colors duration-200 ${
                value === option.value ? 'bg-[#2B8C57] text-white' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
