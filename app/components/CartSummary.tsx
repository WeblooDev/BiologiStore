import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';
import {Root} from 'postcss';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  if (layout === 'page') {
    return (
      <div
        aria-labelledby="cart-summary"
        className={`${className} bg-white border border-gray-200 p-6`}
      >
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          <dl className="flex items-center justify-between text-sm">
            <dt>Subtotal</dt>
            <dd className="font-semibold">
              {cart.cost?.subtotalAmount?.amount ? (
                <Money data={cart.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </dl>

          <dl className="flex items-center justify-between text-sm">
            <dt>Sales Tax</dt>
            <dd className="text-gray-600">Calculated in Checkout</dd>
          </dl>

          <div className="border-t border-gray-200 pt-4">
            <dl className="flex items-center justify-between">
              <dt className="text-lg font-semibold">Estimated Total</dt>
              <dd className="text-lg font-bold">
                {cart.cost?.subtotalAmount?.amount ? (
                  <Money data={cart.cost?.subtotalAmount} />
                ) : (
                  '-'
                )}
              </dd>
            </dl>
          </div>
        </div>

        <div className="mb-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 underline">
            Have a promo code?
          </button>
        </div>

        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} layout={'drawer'} />
      </div>
    );
  }

  // Drawer layout - original styling
  return (
    <div
      aria-labelledby="cart-summary"
      className={`${className} flex flex-col gap-4 border-0!`}
    >
      <div className="bg-[#F6F6F6] px-3 flex flex-col gap-1 text-sm">
        <dl className="flex items-center justify-between">
          <dt className="font-semibold">Original price</dt>
          <dd className="font-semibold">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>

        <dl className="flex items-center justify-between">
          <dt className="text-[#2B8C57] font-semibold">Discount</dt>
          <dd className="text-[#2B8C57] font-semibold">
            {cart.discountCodes?.length ? (
              <CartDiscounts discountCodes={cart.discountCodes} />
            ) : (
              <span>-</span>
            )}
          </dd>
        </dl>

        <p className="text-xs text-gray-600">
          Taxes and shipping are calculated at checkout
        </p>

        <dl className="flex items-center justify-between">
          <dt className="font-semibold">Subtotal</dt>
          <dd className="font-semibold">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </dl>
      </div>

      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} layout={layout} />
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  layout,
}: {
  checkoutUrl?: string;
  layout: CartLayout;
}) {
  if (!checkoutUrl) return null;

  if (layout === 'page') {
    return (
      <div className="space-y-3">
        <a
          href={checkoutUrl}
          target="_self"
          className="block w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-center py-3 uppercase font-semibold transition-colors"
        >
          SECURE CHECKOUT
        </a>

        <div className="text-center text-sm text-gray-500">or</div>

        <button className="w-full bg-[#FFC439] hover:bg-[#FFB700] text-gray-900 py-3 rounded flex items-center justify-center gap-2 font-semibold transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.793.68H8.25c-.467 0-.825-.377-.745-.84l.014-.075L9.28 13.7a1.95 1.95 0 011.92-1.63h1.24c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327a3.327 3.327 0 00-.837-.958c.484.088.93.245 1.33.468.398.222.744.506 1.02.845z" />
            <path d="M15.067 3.623c.74 3.806-1.796 5.12-5.034 5.12H8.793a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.793.68H3.69c-.467 0-.825-.377-.745-.84L4.67 3.623C4.91 2.31 6.097 1.31 7.43 1.31h5.405c1.333 0 2.52 1 2.232 2.313z" />
          </svg>
          Checkout
        </button>
      </div>
    );
  }

  // Drawer layout - original styling
  return (
    <div className="bg-[#2B8C57] py-2 text-white flex items-center justify-center">
      <a href={checkoutUrl} target="_self" className="bg-[#2B8C57] uppercase">
        <p>Secure Checkout</p>
      </a>
      <br />
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex justify-between">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="bg-white"
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex justify-between">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="bg-white"
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
