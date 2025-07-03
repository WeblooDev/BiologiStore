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
    <div className="product-item flex flex-col items-center justify-between mt-8 w-full">
    <Link to={variantUrl} className="relative block w-full bg-[#F6F6F6] group">
  {product.metafield?.value === 'true' && (
    <div className="absolute top-3 left-3 h-[80px] w-[80px] border border-[#2B8C57] text-[#2B8C57] rounded-full flex items-center justify-center">
      NEW
    </div>
  )}
  {image && (
    <div className="overflow-hidden ">
      <Image
        alt={image.altText || product.title}
        data={image}
        loading={loading}
        className="h-[300px] md:h-[400px] lg:h-[560px] object-cover mb-6 transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
    </div>
  )}
</Link>

        
        <div className='flex flex-col items-center gap-2 mt-4 w-full'>
          <h4 className="font-gayathri text-xl text-[#2B8C57]">{product.title}</h4>
              

      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {product.tags.map((tag, index) => (
            <div key={tag} className="flex items-center gap-1">
              <span className="text-sm">{tag}</span>
              {index < product.tags.length - 1 && (
                <img src={bullet} alt="bullet" className="!w-auto h-[7px]" />
              )}
            </div>
          ))}
        </div>
      )}



                <small className="block text-sm">
                  <Money data={product.priceRange.minVariantPrice} />
                </small>
                <div className='w-full m-auto flex items-ce'>
                  
                <button
                onClick={handleAddToCart}
className='w-[90%] m-auto border border-[#2B8C57] uppercase bg-white px-14 py-2 text-[#2B8C57] cursor-pointer hover:text-white hover:bg-[#2B8C57] !text-sm '              >
                Add to Cart
              </button>
              </div>
        </div>
     
    </div>
  );
}
