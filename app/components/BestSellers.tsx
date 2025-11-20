import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {useRef, useState, useEffect} from 'react';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';
import {Link} from 'react-router';
import {QuickView} from './QuickView';
import {ProductItem} from './ProductItem';

type ProductNode = RecommendedProductsQuery['products']['nodes'][0];

type BestSellersProps = {
  products: RecommendedProductsQuery | null;
  title?: string;
};

export function BestSellers({
  products,
  title = 'Best Sellers',
}: BestSellersProps) {
  if (!products) return null;

  const productList: ProductNode[] = products.products.nodes;
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const desktopContainerRef = useRef<HTMLDivElement | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductNode | null>(
    null,
  );

  // Mobile scroll functions (1 product at a time)
  const scrollMobileNext = () => {
    if (mobileContainerRef.current) {
      const child = mobileContainerRef.current.querySelector('div');
      if (child) {
        const scrollAmount = child.clientWidth + 24;
        mobileContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
        setMobileIndex((prev) => Math.min(prev + 1, productList.length - 1));
      }
    }
  };

  const scrollMobileBack = () => {
    if (mobileContainerRef.current) {
      const child = mobileContainerRef.current.querySelector('div');
      if (child) {
        const scrollAmount = child.clientWidth + 24;
        mobileContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });
        setMobileIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  // Desktop scroll functions (3 products at a time)
  const scrollDesktopNext = () => {
    if (desktopContainerRef.current) {
      const child = desktopContainerRef.current.querySelector('div');
      if (child) {
        const scrollAmount = (child.clientWidth + 24) * 3;
        desktopContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
        setDesktopIndex((prev) => Math.min(prev + 3, productList.length - 3));
      }
    }
  };

  const scrollDesktopBack = () => {
    if (desktopContainerRef.current) {
      const child = desktopContainerRef.current.querySelector('div');
      if (child) {
        const scrollAmount = (child.clientWidth + 24) * 3;
        desktopContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });
        setDesktopIndex((prev) => Math.max(prev - 3, 0));
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setMobileIndex(0);
      setDesktopIndex(0);
      if (mobileContainerRef.current)
        mobileContainerRef.current.scrollTo({left: 0});
      if (desktopContainerRef.current)
        desktopContainerRef.current.scrollTo({left: 0});
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

    // Replace this with Shopify/Hydrogen logic
    console.log('Added to cart:', variantId);
    alert(`Product "${product.title}" added to cart!`);
  };

  return (
    <section className="container mx-auto py-10 px-6 mb-16">
      <div className="flex justify-center mb-12">
        <h2 className="font-poppins !text-2xl !font-bold">{title}</h2>
      </div>

      {/* Mobile Slider (< 640px) */}
      <div className="relative sm:hidden">
        {mobileIndex > 0 && (
          <button
            onClick={scrollMobileBack}
            className="absolute -left-0 top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={left} alt="Scroll left" className="h-[30px]" />
          </button>
        )}
        {mobileIndex < productList.length - 1 && (
          <button
            onClick={scrollMobileNext}
            className="absolute -right-0 top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={right} alt="Scroll right" className="h-[30px]" />
          </button>
        )}

        <div
          ref={mobileContainerRef}
          className="flex overflow-hidden scroll-smooth gap-6 no-scrollbar"
        >
          {productList.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="shrink-0 w-full"
            />
          ))}
        </div>
      </div>

      {/* Desktop Slider (>= 640px) */}
      <div className="relative hidden sm:block">
        {desktopIndex > 0 && (
          <button
            onClick={scrollDesktopBack}
            className="absolute -left-0 top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={left} alt="Scroll left" className="h-[30px]" />
          </button>
        )}
        {desktopIndex < productList.length - 3 && (
          <button
            onClick={scrollDesktopNext}
            className="absolute -right-0 top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={right} alt="Scroll right" className="h-[30px]" />
          </button>
        )}

        <div
          ref={desktopContainerRef}
          className="flex overflow-hidden scroll-smooth gap-6 no-scrollbar md:px-4 md:w-[85%] m-auto"
        >
          {productList.map((product) => (
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
