import {useOptimisticCart, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {
  CartApiQueryFragment,
  RecommendedProductsForCartQuery,
} from 'storefrontapi.generated';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'drawer';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
  recommendedProducts?: RecommendedProductsForCartQuery | null;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({
  layout,
  cart: originalCart,
  recommendedProducts,
}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div
      className={`${className} flex flex-col h-full gap-6 ${layout === 'drawer' ? 'p-6' : ''}`}
    >
      <CartEmpty hidden={linesCount} layout={layout} />

      <div className="cart-details flex flex-col justify-between flex-1 gap-6">
        <div aria-labelledby="cart-lines" className="overflow-y-auto">
          <ul className="space-y-6">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>

        {recommendedProducts && (
          <CartRecommendations products={recommendedProducts} />
        )}

        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}

function CartRecommendations({
  products,
}: {
  products: RecommendedProductsForCartQuery | null;
}) {
  if (!products || typeof window === 'undefined') return null;

  const allNodes = products.products?.nodes ?? [];
  if (!allNodes.length) return null;

  // Read recently viewed handles from localStorage and preserve that order
  let handles: string[] = [];
  try {
    const stored = window.localStorage.getItem('recentlyViewedProducts');
    handles = stored ? JSON.parse(stored) : [];
  } catch (e) {
    handles = [];
  }

  if (!handles.length) return null;

  const byHandle = new Map(allNodes.map((p) => [p.handle, p] as const));
  const nodes = handles
    .map((h) => byHandle.get(h))
    .filter((p): p is (typeof allNodes)[number] => Boolean(p));

  if (!nodes.length) return null;

  return (
    <section className="mt-4">
      <h3 className="text-xl font-semibold mb-8 text-[#2B8C57]">
        Still interested in these?
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {nodes.map((product) => {
          const imgBg = (product as any)?.imgBackground?.reference?.image;
          const imageUrl = imgBg?.url as string | undefined;

          return (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="min-w-[220px] max-w-[350px] bg-white flex flex-row items-center justify-center shrink-0 relative"
            >
              {imageUrl && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
                  style={{backgroundImage: `url(${imageUrl})`}}
                />
              )}
              <div className="p-4 flex flex-col gap-2 ps-40 z-10">
                <p className="text-sm font-semibold line-clamp-2">
                  {product.title}
                </p>
                <p className="text-[11px] text-gray-700 line-clamp-2">
                  {product.tags.includes('bundle')
                    ? (product as any).bundleProducts?.references?.nodes
                        ?.map((p: any) => p?.title)
                        .filter(Boolean)
                        .join(' • ') || null
                    : (() => {
                        const raw = (product as any).skintype;
                        let values: string[] = [];

                        try {
                          if (Array.isArray(raw)) {
                            values = raw.filter(Boolean);
                          } else if (typeof raw?.value === 'string') {
                            // Try to parse as JSON first
                            const parsed = JSON.parse(raw.value);
                            if (Array.isArray(parsed)) {
                              values = parsed.filter(Boolean);
                            }
                          }
                        } catch (e) {
                          // If JSON parse fails, treat as comma-separated string
                          if (typeof raw?.value === 'string') {
                            values = raw.value
                              .split(',')
                              .map((v: string) => v.trim())
                              .filter(Boolean);
                          }
                        }

                        return values.join(' • ');
                      })()}
                </p>
                <Money
                  data={product.priceRange.minVariantPrice}
                  className="text-sm font-semibold text-[#2B8C57]"
                />
                <span className="mt-2 inline-block text-center bg-[#2B8C57] text-white text-xs py-2 uppercase">
                  Add to bag
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <hr className="!my-5 !border-[#E5E5E5]" />
    </section>
  );
}
