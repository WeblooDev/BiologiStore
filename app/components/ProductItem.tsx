import {Link, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import bullet from '~/assets/images/bulle.svg';

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
        action: '/cart', // make sure this route exists
      }
    );
  };

  return (
    <div className="product-item flex flex-col items-center justify-between">
      <Link
        prefetch="intent"
        to={variantUrl}
        className="flex flex-col items-center gap-2"
      >
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
                className="h-[300px] md:h-[400px] lg:h-[500px] object-cover mb-6"          />
        )}
         </Link>
        
        <div className='flex flex-col items-center gap-4'>
          <h4 className="text-lg font-semibold text-[#2B8C57]">{product.title}</h4>
              

      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {product.tags.map((tag, index) => (
            <div key={tag} className="flex items-center gap-2">
              <span className="text-base">{tag}</span>
              {index < product.tags.length - 1 && (
                <img src={bullet} alt="bullet" className="!w-auto h-2" />
              )}
            </div>
          ))}
        </div>
      )}



                <small className="block text-base">
                  <Money data={product.priceRange.minVariantPrice} />
                </small>
                <div>
                <button
                onClick={handleAddToCart}
                className="mt-2 w-full border border-[#2B8C57] text-[#2B8C57] text-sm py-4 px-10 uppercase  hover:bg-[#2B8C57] hover:text-white transition"
              >
                Add to Cart
              </button>
              </div>
        </div>
     
    </div>
  );
}
