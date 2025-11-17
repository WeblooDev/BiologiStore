import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {useRef, useState, useEffect} from 'react';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';
import bullet from '~/assets/images/bulle.svg';
import close from '~/assets/images/closee.svg';
import {motion} from 'framer-motion';
import {Link} from 'react-router';

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
            <Link
              to={`/products/${product.handle}`}
              key={product.id}
              className="relative flex-shrink-0 w-full sm:w-[calc(100%/2-1rem)] lg:w-[calc(100%/3-1rem)]"
            >
              <div className="flex flex-col items-center gap-3 justify-between h-full">
                {product.featuredImage && (
                  <div className="h-[300px] md:h-[400px] lg:h-[500px] group relative bg-[#F6F6F6] w-full overflow-hidden">
                    <div className="w-full h-full">
                      <Image
                        data={product.featuredImage}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="w-full h-full object-cover mb-6 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div
                      onClick={() => setSelectedProduct(product)}
                      className="absolute bottom-[1px] w-full bg-[#2B8C57] text-white uppercase hover:underline flex items-center justify-center text-xs px-2 py-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 z-20"
                    >
                      Quick View
                    </div>
                  </div>
                )}

                <h3 className="font-poppins text-xl text-[#2B8C57] text-center">
                  {product.title}
                </h3>

                <p className="text-xs text-gray-600 capitalize">
                  {product.tags?.join(' · ')}
                </p>
                <div className="!font-light">
                  <Money
                    data={product.priceRange.minVariantPrice}
                    className="text-sm"
                  />
                </div>

                <div className="w-full flex items-center justify-center">
                  <button
                    className="w-[90%] border border-[#2B8C57] uppercase
                bg-white px-12 py-2 text-[#2B8C57] cursor-pointer hover:text-white
                hover:bg-[#2B8C57] !text-xs md:!text-sm"
                    onClick={() => addToCart(product)}
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {selectedProduct && (
        <div
          className=" fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 shadow-2xl"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{scale: 0.7, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.8, opacity: 0}}
            transition={{duration: 0.5, ease: 'easeOut'}}
            className=" container bg-white relative flex shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-4 text-xl font-bold  cursor-pointer"
              onClick={() => setSelectedProduct(null)}
            >
              <img src={close} alt="" className="h-5 w-4" />
            </button>

            <div className="w-[40%] h-full bg-[#F6F6F6]">
              {selectedProduct.featuredImage && (
                <img
                  src={selectedProduct.featuredImage.url}
                  alt={selectedProduct.featuredImage.altText || ''}
                  className="w-full h-full object-cover rounded mb-4"
                />
              )}
            </div>

            <div className="w-[60%] flex flex-col gap-3 justify-between p-8">
              <h3 className="font-poppins !text-3xl font-bold text-[#2B8C57] mb-2">
                {selectedProduct.title}
              </h3>

              {selectedProduct.tags?.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag, index) => (
                    <div key={tag} className="flex items-center gap-1">
                      <span className="text-sm underline text-[#4F4F4F]">
                        {tag}
                      </span>
                      {index < selectedProduct.tags.length - 1 && (
                        <img src={bullet} alt="" className="w-[6px] h-[6px]" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="!text-base mb-2 flex items-center text-[#2B8C57]">
                <Money data={selectedProduct.priceRange.minVariantPrice} />
              </p>

              {selectedProduct.variants?.nodes?.[0]?.title && (
                <p className=" text-sm mb-2">
                  Size: {selectedProduct.variants.nodes[0].title}
                </p>
              )}

              {selectedProduct.descriptionHtml && (
                <div
                  className="text-sm mb-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedProduct.descriptionHtml,
                  }}
                />
              )}

              <div className="flex flex-col w-full">
                <button
                  className="block text-center mt-2 bg-[#2B8C57] cursor-pointer uppercase border border-[#2B8C57] text-white hover:bg-[#2B8C57] hover:text-white text-sm px-4 py-2 transition-all"
                  onClick={() => addToCart(selectedProduct)}
                >
                  Add to Bag
                </button>

                <a
                  href={`/products/${selectedProduct.handle}`}
                  className="block text-center  mt-4 !underline text-sm px-4 py-2 transition-all"
                >
                  View Full Product Details
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
