import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import bullet from '~/assets/images/bulle.svg';
import {useRef} from 'react';
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

  const scrollByProduct = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24; // 24 = approx. margin/padding
        containerRef.current.scrollBy({left: productWidth, behavior: 'smooth'});
      }
    }
  };

  const scrollBack = () => {
    if (containerRef.current) {
      const child = containerRef.current.querySelector('div');
      if (child) {
        const productWidth = child.clientWidth + 24;
        containerRef.current.scrollBy({left: -productWidth, behavior: 'smooth'});
      }
    }
  };

  return (
    <section className="container mx-auto py-10">
      <div className="flex justify-center mb-6">
        <h2 className="font-gayathri !text-4xl !font-normal">{title}</h2>
      </div>

      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={scrollBack}
          className="absolute -left-[5%] top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
        >
          <img src={left} alt="" className='h-[30px]'/>
        </button>
        <button
          onClick={scrollByProduct}
          className="absolute -right-[5%] top-[40%] -translate-y-1/2 z-10 px-3 py-2 cursor-pointer"
        >
          <img src={right} alt="" className='h-[30px]'/>
        </button>

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="flex overflow-hidden scroll-smooth gap-6 no-scrollbar px-2"
        >
          {productList.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[calc(100%/3-1rem)] min-w-[calc(100%/3-1rem)]"
            >
              <div className="flex flex-col items-center gap-4 justify-between">
                {product.featuredImage && (
                  <div className="bg-[#F6F6F6] w-full">
                    <Image
                      data={product.featuredImage}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="h-[300px] md:h-[400px] lg:h-[500px] object-cover mb-6"
                    />
                  </div>
                )}
                <h3 className="font-gayathri text-xl text-[#2B8C57]">{product.title}</h3>

             

                <div className="mt-2 !font-light
 text-gray-900">
                  <Money data={product.priceRange.minVariantPrice} />
                </div>

                <button
                  className="border border-[#2B8C57] uppercase bg-white px-12 py-3 text-[#2B8C57] cursor-pointer hover:text-white hover:bg-[#2B8C57]"
                  onClick={() => console.log(`Add to cart: ${product.id}`)}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
