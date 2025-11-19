import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {XIcon} from 'lucide-react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li
      key={id}
      className="cart-line flex gap-4 !px-0 border-b last:border-b-0 border-[#E5E5E5]"
    >
      <div className="bg-[#F6F6F6] shrink-0 w-32 h-auto aspect-[1/1.5] flex items-center justify-center">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1.5"
            data={image}
            height={240}
            loading="lazy"
            width={240}
          />
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 gap-2 relative">
        <div className="space-y-1">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
          >
            <p className="text-sm font-semibold">{product.title}</p>
          </Link>
          <p className="text-sm text-[#2B8C57] font-semibold">
            <ProductPrice price={line?.cost?.totalAmount} />
          </p>
          <p className="!text-sm mt-2">
            {
              selectedOptions.find((opt) => opt.name.toLowerCase() === 'size')
                ?.value
            }
          </p>
        </div>

        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            type="submit"
            className="bg-[#F6F6F6] h-5 w-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#2B8C57] hover:text-white hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F6F6F6] disabled:hover:text-black disabled:hover:scale-100"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <span>&#8722;</span>
          </button>
        </CartLineUpdateButton>
        <span>{quantity}</span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            type="submit"
            className="bg-[#F6F6F6] h-5 w-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#2B8C57] hover:text-white hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F6F6F6] disabled:hover:text-black disabled:hover:scale-100"
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            <span>&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>
      <div className="ml-auto">
        <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
      </div>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="absolute top-0 right-0 cursor-pointer transition-all duration-300 hover:scale-125 hover:text-red-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:text-current"
      >
        <XIcon size={24} strokeWidth={0.5} />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
