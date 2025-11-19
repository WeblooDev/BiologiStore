import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {useRef, useState, useEffect} from 'react';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';
import {Link} from 'react-router';
import {QuickView} from './QuickView';
import {ProductItem} from './ProductItem';

type ProductNode = RecommendedProductsQuery['products']['nodes'][0];

type RecentlyViewedProps = {
  products: RecommendedProductsQuery | null;
  title?: string;
  currentProductHandle?: string;
};

export function RecentlyViewed({
  products,
  title = 'Recently Viewed',
  currentProductHandle,
}: RecentlyViewedProps) {
  const [filteredProducts, setFilteredProducts] = useState<ProductNode[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductNode | null>(
    null,
  );
  const maxVisible = 3;

  useEffect(() => {
    if (!products || typeof window === 'undefined') return;

    const allNodes = products.products?.nodes ?? [];
    if (!allNodes.length) return;

    // Read recently viewed handles from localStorage
    let handles: string[] = [];
    try {
      const stored = window.localStorage.getItem('recentlyViewedProducts');
      handles = stored ? JSON.parse(stored) : [];
    } catch (e) {
      handles = [];
    }

    if (!handles.length) return;

    // Filter out current product
    const filteredHandles = handles.filter((h) => h !== currentProductHandle);

    // Map handles to products in order
    const byHandle = new Map(allNodes.map((p) => [p.handle, p] as const));
    const orderedProducts = filteredHandles
      .map((h) => byHandle.get(h))
      .filter((p): p is ProductNode => Boolean(p));

    setFilteredProducts(orderedProducts);
  }, [products, currentProductHandle]);

  const scrollByProduct = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24;
        containerRef.current.scrollBy({left: productWidth, behavior: 'smooth'});
        setVisibleIndex((prev) =>
          Math.min(prev + 1, filteredProducts.length - maxVisible),
        );
      }
    }
  };

  const scrollBack = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24;
        containerRef.current.scrollBy({
          left: -productWidth,
          behavior: 'smooth',
        });
        setVisibleIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setVisibleIndex(0);
      if (containerRef.current) containerRef.current.scrollTo({left: 0});
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addToCart = (product: ProductNode) => {
    const variantId = product?.variants?.nodes?.[0]?.id;
    if (!variantId) {
      alert('No variant available');
      return;
    }

    console.log('Added to cart:', variantId);
    alert(`Product "${product.title}" added to cart!`);
  };

  if (!filteredProducts.length) return null;

  return (
    <section className="container mx-auto py-10 px-6 mb-16">
      <div className="flex justify-center mb-12">
        <h2 className="font-poppins !text-2xl !font-bold">{title}</h2>
      </div>

      <div className="relative">
        {visibleIndex > 0 && (
          <button
            onClick={scrollBack}
            className="absolute -left-0 top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={left} alt="Scroll left" className="h-[30px]" />
          </button>
        )}
        {visibleIndex < filteredProducts.length - maxVisible && (
          <button
            onClick={scrollByProduct}
            className="absolute -right-0 top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={right} alt="Scroll right" className="h-[30px]" />
          </button>
        )}

        <div
          ref={containerRef}
          className="flex overflow-hidden scroll-smooth gap-6 no-scrollbar px-4 w-[85%] m-auto"
        >
          {filteredProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <QuickView
          product={selectedProduct as any}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => addToCart(selectedProduct)}
        />
      )}
    </section>
  );
}
