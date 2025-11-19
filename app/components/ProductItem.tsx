import {Link, useFetcher} from 'react-router';
import {
  CartForm,
  Image,
  Money,
  OptimisticCartLineInput,
} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import bullet from '~/assets/images/bulle.svg';
import {useState} from 'react';
import {QuickView} from './QuickView';

export function ProductItem({
  product,
  loading,
  className,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
  className?: string;
}) {
  const fetcher = useFetcher();
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const firstVariantId = product?.variants?.nodes?.[0]?.id;
  const [showQuickView, setShowQuickView] = useState(false);

  const getCartLines = (): OptimisticCartLineInput[] => {
    const variantId = product?.variants?.nodes?.[0]?.id;
    if (!variantId) return [];

    return [
      {
        merchandiseId: variantId,
        quantity: 1,
      },
    ];
  };

  return (
    <div
      className={`product-item flex flex-col items-center justify-between mt-8 text-center ${className || 'w-full'}`}
    >
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

            setShowQuickView(true); // open modal
          }}
          className="absolute bottom-[1px] w-full bg-[#2B8C57] text-white uppercase hover:underline flex items-center justify-center text-xs px-2 py-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300 z-20"
        >
          Quick View
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 mt-4 w-full">
        <h4 className="font-poppins text-xl text-[#2B8C57]">{product.title}</h4>

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
        <div className="w-full">
          <CartForm
            route="/cart"
            inputs={{lines: getCartLines()}}
            action={CartForm.ACTIONS.LinesAdd}
          >
            {(fetcher) => (
              <button
                type="submit"
                disabled={fetcher.state !== 'idle'}
                className="w-[90%] border border-[#2B8C57] uppercase
                  bg-white px-12 py-2 text-[#2B8C57] cursor-pointer hover:text-white
                  hover:bg-[#2B8C57] !text-xs md:!text-sm disabled:opacity-50 transition-colors duration-200"
              >
                {fetcher.state !== 'idle' ? 'Adding...' : 'Add to Bag'}
              </button>
            )}
          </CartForm>
        </div>
      </div>

      <QuickView
        product={product as any}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        onAddToCart={() => {
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
        }}
      />
    </div>
  );
}
