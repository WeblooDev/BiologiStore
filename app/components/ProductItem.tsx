import {Link, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import bullet from '~/assets/images/bulle.svg';
import {useState} from 'react';
import close from '~/assets/images/closee.svg';

import {motion, AnimatePresence} from 'framer-motion';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const fetcher = useFetcher();
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const firstVariantId = product?.variants?.nodes?.[0]?.id;
  const [showQuickView, setShowQuickView] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation
    if (!firstVariantId) return;
    fetcher.submit(
      {
        variantId: firstVariantId,
        quantity: 1,
      },
      {
        method: 'post',
        action: '/cart',
      },
    );
  };

  return (
    <>
      <div className="product-item flex flex-col items-center justify-between mt-8 w-full text-center">
        <div className="relative w-full group">
          <Link to={variantUrl} className="block w-full bg-[#F6F6F6]">
            {product.metafield?.value === 'true' && (
              <div className="absolute top-3 left-3 bg-white h-[80px] w-[80px] border border-[#2B8C57] text-[#2B8C57] rounded-full flex items-center justify-center z-5 text-lg">
                NEW
              </div>
            )}
            {image && (
              <div className="overflow-hidden">
                <Image
                  alt={image.altText || product.title}
                  data={image}
                  loading={loading}
                  className="h-[300px] md:h-[400px] lg:h-[560px] object-cover mb-6 transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            )}
          </Link>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // stop <Link> navigation
              e.stopPropagation(); // prevent bubbling to parent
              console.log('Quick View Clicked'); // ✅ Confirm this logs

              setShowQuickView(true); // open modal
            }}
            className="absolute bottom-[1px] w-full bg-[#2B8C57] text-white uppercase hover:underline flex items-center justify-center text-xs px-2 py-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 z-20"
          >
            Quick View
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mt-4 w-full">
          <h4 className="font-poppins text-xl text-[#2B8C57]">
            {product.title}
          </h4>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {product.tags.map((tag, index) => (
                <div key={tag} className="flex items-center gap-1">
                  <span className="text-sm">{tag}</span>
                  {index < product.tags.length - 1 && (
                    <img
                      src={bullet}
                      alt="bullet"
                      className="!w-auto h-[7px]"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <small className="block text-sm">
            <Money data={product.priceRange.minVariantPrice} />
          </small>
          <div className="w-full m-auto flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              className="w-[90%] border border-[#2B8C57] uppercase bg-white px-14 py-2 text-[#2B8C57] cursor-pointer hover:text-white hover:bg-[#2B8C57]  !text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div
          className=" fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 shadow-2xl"
          onClick={() => setShowQuickView(false)}
        >
          <AnimatePresence>
            <motion.div
              initial={{scale: 0.7, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              exit={{scale: 0.8, opacity: 0}}
              transition={{duration: 0.5, ease: 'easeOut'}}
              className="container bg-white  relative flex flex-col md:flex-row shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full md:w-[40%] h-full bg-[#F6F6F6]">
                {image && (
                  <img
                    src={image.url}
                    alt={image.altText || ''}
                    className="w-full h-full object-cover rounded mb-4"
                  />
                )}
              </div>

              {/* Right: Info */}
              <div className="w-full md:w-[60%] flex flex-col gap-3 justify-between p-6">
                <h3 className="font-poppins text-2xl font-bold text-[#2B8C57] mb-2">
                  {product.title}
                </h3>

                {product.tags?.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm underline text-[#4F4F4F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-base mb-2 text-[#2B8C57]">
                  <Money data={product.priceRange.minVariantPrice} />
                </p>

                {product.variants?.nodes?.[0]?.title && (
                  <p className="text-gray-600 text-sm mb-2">
                    Size: {product.variants.nodes[0].title}
                  </p>
                )}

                {product.descriptionHtml && (
                  <div
                    className="text-gray-700 text-sm mb-4"
                    dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                  />
                )}

                <button
                  className="block text-center mt-2 bg-[#2B8C57] cursor-pointer uppercase border border-[#2B8C57] text-white hover:bg-[#2B8C57] hover:text-white text-sm px-4 py-2 transition-all"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <Link
                  to={`/products/${product.handle}`}
                  className="block text-center  mt-4 !underline text-sm px-4 py-2 transition-all"
                >
                  View Full Product Page
                </Link>
              </div>

              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
                onClick={() => setShowQuickView(false)}
              >
                <img src={close} className="h-[20px]" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
