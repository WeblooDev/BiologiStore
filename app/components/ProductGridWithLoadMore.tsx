import {useState} from 'react';
import {ProductItem} from './ProductItem'; // your existing component
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

type Product =
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;

export function ProductGridWithLoadMore({products}: {products: Product[]}) {
  const BATCH_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, products.length));
  };

  const progress = Math.min((visibleCount / products.length) * 100, 100);

  return (
    <section className="mt-12 w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.slice(0, visibleCount).map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 mt-10 rounded overflow-hidden">
        <div
          className="h-full bg-[#2B8C57] transition-all duration-300 ease-in-out"
          style={{width: `${progress}%`}}
        />
      </div>

      {/* Load More Button */}
      {visibleCount < products.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="bg-[#2B8C57] text-white px-6 py-3 uppercase text-sm hover:bg-[#246f45] transition"
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}
