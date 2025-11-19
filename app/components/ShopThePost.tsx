import {Image, Money} from '@shopify/hydrogen';
import {useRef, useState, useEffect} from 'react';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';
import {QuickView} from './QuickView';

type Product = {
  id: string;
  handle: string;
  title: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  variants?: {
    nodes: Array<{
      id: string;
      title: string;
    }>;
  };
  descriptionHtml?: string;
};

type ShopThePostProps = {
  products: Product[];
  title?: string;
};

export function ShopThePost({
  products,
  title = 'Shop the Post',
}: ShopThePostProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const maxVisible = 3;

  if (!products || products.length === 0) return null;

  const scrollByProduct = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24;
        containerRef.current.scrollBy({left: productWidth, behavior: 'smooth'});
        setVisibleIndex((prev) =>
          Math.min(prev + 1, products.length - maxVisible),
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

  const addToCart = (product: Product) => {
    const variantId = product?.variants?.nodes?.[0]?.id;
    if (!variantId) {
      alert('No variant available');
      return;
    }

    alert(`Product "${product.title}" added to cart!`);
  };

  return (
    <section className="container mx-auto py-10 px-6">
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
        {visibleIndex < products.length - maxVisible && (
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
          {products.map((product) => (
            <div
              key={product.id}
              className="relative flex-shrink-0 w-full sm:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]"
            >
              <div className="flex flex-col items-center gap-3 justify-between">
                {product.featuredImage && (
                  <div className="group relative bg-[#F6F6F6] w-full">
                    <a href={`/products/${product.handle}`}>
                      <Image
                        data={product.featuredImage}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="h-[300px] md:h-[400px] lg:h-[500px] object-cover mb-6 transition-transform duration-300 group-hover:scale-105"
                      />
                    </a>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute bottom-[1px] w-full bg-[#2B8C57] text-white uppercase hover:underline flex items-center justify-center text-xs px-2 py-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 z-20"
                    >
                      Quick View
                    </div>
                  </div>
                )}

                <h3 className="font-poppins text-xl text-[#2B8C57]">
                  {product.title}
                </h3>

                <p>{product.tags?.join(' · ')}</p>
                <div className="!font-light">
                  <Money
                    data={product.priceRange.minVariantPrice}
                    className="text-sm"
                  />
                </div>

                <div className="w-full m-auto flex items-center justify-center">
                  <button
                    className="w-[90%] border border-[#2B8C57] uppercase
                bg-white px-12 py-2 text-[#2B8C57] cursor-pointer hover:text-white
                hover:bg-[#2B8C57] !text-xs md:!text-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
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
