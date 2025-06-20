import {useState, Suspense} from 'react';
import {Await} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import logoBiologi from '~/assets/images/logoBiologi.svg';
import cartIcon from '~/assets/images/cart.svg';
import search from '~/assets/images/search.svg';
import signin from '~/assets/images/signin.svg';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <div className="relative flex flex-col gap-6 justify-center items-center py-8">
      <header className="header !justify-between w-full flex items-center">
        <div></div>
        <a href="/" className="block">
          <img src={logoBiologi} alt="BiologiMD" className="h-10 w-auto " />
        </a>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>

      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <div className="relative w-full">
      <nav className={`${className} w-full`} role="navigation" onClick={close}>
        <RenderMenuItems
          items={(menu || FALLBACK_HEADER_MENU).items}
          publicStoreDomain={publicStoreDomain}
          primaryDomainUrl={primaryDomainUrl}
        />
      </nav>
    </div>
  );
}

function RenderMenuItems({
  items,
  publicStoreDomain,
  primaryDomainUrl,
}: {
  items: any[];
  publicStoreDomain: string;
  primaryDomainUrl: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!items?.length) return null;

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div
      className="w-full flex flex-col items-center"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <ul className="flex gap-8">
        {items.map((item, index) => {
          if (!item?.url) return null;

          const isInternal =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl);

          const href = isInternal ? new URL(item.url).pathname : item.url;

          return (
            <li
              key={item.id}
              className="group"
              onMouseEnter={() => setActiveIndex(index)}
            >
              <a
                href={href}
                className="text-base "
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>

      {activeItem?.items?.length > 0 && (
        <div className="absolute top-full left-0 w-screen bg-[#F6F6F6] z-50 shadow-md">
          <div className="container mx-auto p-12 flex justify-center gap-12">
            {activeItem.items.map((subItem) => {
              const subHref =
                subItem.url.includes('myshopify.com') ||
                subItem.url.includes(publicStoreDomain) ||
                subItem.url.includes(primaryDomainUrl)
                  ? new URL(subItem.url).pathname
                  : subItem.url;

              return (
                <div key={subItem.id} className="flex flex-col gap-3">
                  <p
                    
                    className="text-base font-semibold !text-[#2B8C57]"
                  >
                    {subItem.title}
                  </p>
                  {subItem.items?.length > 0 && (
                    <ul className="flex flex-col gap-3">
                      {subItem.items.map((subSub) => {
                        const subSubHref =
                          subSub.url.includes('myshopify.com') ||
                          subSub.url.includes(publicStoreDomain) ||
                          subSub.url.includes(primaryDomainUrl)
                            ? new URL(subSub.url).pathname
                            : subSub.url;
                        return (
                          <li key={subSub.id}>
                            <a
                              href={subSubHref}
                              className="text-sm text-gray-700 hover:underline"
                            >
                              {subSub.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas flex items-center gap-4" role="navigation">
      <HeaderMenuMobileToggle />
      <Suspense
        fallback={
          <a href="/account">
            <img src={signin} alt="Sign in" className="w-6 h-6" />
          </a>
        }
      >
        <Await
          resolve={isLoggedIn}
          errorElement={
            <a href="/account">
              <img src={signin} alt="Sign in" className="w-6 h-6" />
            </a>
          }
        >
          {(loggedIn) => (
            <a href="/account">
              <img
                src={signin}
                alt={loggedIn ? 'Account' : 'Sign in'}
                className="w-6 h-6"
              />
            </a>
          )}
        </Await>
      </Suspense>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      <img src={search} alt="Search" className="w-6 h-6" />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative inline-block"
    >
      <img src={cartIcon} alt="Cart" className="w-6 h-6" />
      {typeof count === 'number' && count > 0 && (
        <span className="absolute -top-1 -right-2 text-xs bg-black text-white px-1 rounded-full">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(resolvedCart) => {
          const safeCart = resolvedCart ?? null;
          return <CartBanner cartData={safeCart} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBanner({cartData}: {cartData: CartApiQueryFragment | null}) {
  const cart = useOptimisticCart(cartData);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [],
};
