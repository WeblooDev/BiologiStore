import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import bullet from '~/assets/images/bulle.svg';
import {useRef, useState, useEffect} from 'react';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';

type ProductNode = RecommendedProductsQuery['products']['nodes'][0];

type BestSellersProps = {
  products: RecommendedProductsQuery | null;
  title?: string;
};

export function BestSellers({products, title = 'Best Sellers'}: BestSellersProps) {
  if (!products) return null;

  const productList: ProductNode[] = products.products.nodes;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const maxVisible = 3; // max items in view at large screen

  const scrollByProduct = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24;
        containerRef.current.scrollBy({left: productWidth, behavior: 'smooth'});
        setVisibleIndex((prev) => Math.min(prev + 1, productList.length - maxVisible));
      }
    }
  };

  const scrollBack = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24;
        containerRef.current.scrollBy({left: -productWidth, behavior: 'smooth'});
        setVisibleIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  // Adjust visibleIndex when resizing
  useEffect(() => {
    const handleResize = () => {
      setVisibleIndex(0);
      if (containerRef.current) containerRef.current.scrollTo({left: 0});
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="container mx-auto py-10">
      <div className="flex justify-center mb-6">
        <h2 className="font-gayathri !text-4xl !font-normal">{title}</h2>
      </div>

      <div className="relative">
        {/* Scroll buttons */}
        {visibleIndex > 0 && (
          <button
            onClick={scrollBack}
            className="absolute -left-[5%] top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={left} alt="Scroll left" className="h-[30px]" />
          </button>
        )}
        {visibleIndex < productList.length - maxVisible && (
          <button
            onClick={scrollByProduct}
            className="absolute -right-[5%] top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
          >
            <img src={right} alt="Scroll right" className="h-[30px]" />
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex overflow-hidden scroll-smooth gap-6 no-scrollbar px-2"
        >
          {productList.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-full sm:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]"
            >
              <div className="flex flex-col items-center gap-3 justify-between">
                {product.featuredImage && (
                  <div className="bg-[#F6F6F6] w-full">
                    <Image
                      data={product.featuredImage}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="h-[300px] md:h-[400px] lg:h-[500px] object-cover mb-6 transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="font-gayathri text-xl text-[#2B8C57]">{product.title}</h3>
                <div className="!font-light text-gray-900">
                  <Money data={product.priceRange.minVariantPrice} className="text-sm" />
                </div>

                <div className="w-full m-auto flex items-center justify-center">
                  <button
                    className="w-[90%] border border-[#2B8C57] uppercase bg-white px-12 py-2 text-[#2B8C57] cursor-pointer hover:text-white hover:bg-[#2B8C57] !text-sm"
                    onClick={() => console.log(`Add to cart: ${product.id}`)}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
