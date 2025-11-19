import {useEffect, useRef, useState, Suspense} from 'react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import logoBiologi from '~/assets/images/logoBiologi.svg';
import {Await, useLocation, useRouteLoaderData} from 'react-router';
import cartIcon from '~/assets/images/cart.svg';
import search from '~/assets/images/search.svg';
import signin from '~/assets/images/signin.svg';
import burger from '~/assets/images/burger.svg';
import facebook from '~/assets/images/facebook.svg';
import instagram from '~/assets/images/instagram.svg';
import {useLocalePath, getLocalePrefix} from '~/lib/useLocale';

import {
  CartForm,
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';
import {Drawer, useDrawer} from './Drawer';
import {CartMain} from './CartMain';
import {useCartFetchers} from '~/lib/cart-utils';
import type {RootLoader} from '~/root';

interface HeaderProps {
  header: HeaderQuery;
  cart: CartApiQueryFragment | null;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop';

function sanitizeUrl(url: string, localePrefix: string = ''): string {
  if (url?.startsWith('/')) {
    // Add locale prefix to internal URLs
    return localePrefix ? `${localePrefix}${url}` : url;
  }

  const domainsToStrip = [
    'https://shop.biologimd.com',
    'https://checkout.biologimd.com',
  ];
  for (const domain of domainsToStrip) {
    if (url?.startsWith(domain)) {
      const path = url.replace(domain, '');
      return localePrefix ? `${localePrefix}${path}` : path;
    }
  }

  return url;
}

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const location = useLocation();
  const localePrefix = getLocalePrefix(location.pathname);
  const getLocalePath = useLocalePath();
  // Desktop view logic with sticky behavior
  const menuRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    const updateMeasurements = () => {
      if (menuRef.current) {
        setOffsetTop(menuRef.current.offsetTop);
        setMenuHeight(menuRef.current.offsetHeight);
        setIsSticky(false);
      }
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const shouldBeSticky = scrollTop >= offsetTop;
      setIsSticky((prev) => {
        if (prev !== shouldBeSticky) {
          return shouldBeSticky;
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offsetTop]);

  const {shop, menu} = header;

  // Check if the path starts with /products/
  const isProductPage =
    location.pathname.startsWith('/products/') ||
    location.pathname.startsWith('/bundles');

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <div
      className={` w-full absolute top-0 z-[100] transition-all duration-300 ${
        isProductPage ? 'bg-transparent hover:bg-white' : 'bg-white'
      }`}
    >
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        menu={menu}
        localePrefix={localePrefix}
        getLocalePath={getLocalePath}
      />
      <div className="border-b border-b-[#BDBDBD] flex justify-center p-2 w-full">
        <PromoCarousel />
      </div>
      {/* Top Logo Section */}
      <header className="container m-auto w-full flex justify-between items-center p-4 md:p-6">
        <div className="w-[10%] opacity-100 md:opacity-0 md:pointer-events-none transition-opacity duration-300 flex justify-center items-center">
          <button onClick={() => openMenu()} aria-label="Open menu">
            <img
              src={burger}
              alt="Open menu"
              className="w-7 h-7 object-contain cursor-pointer"
            />
          </button>
        </div>

        <a href={localePrefix || '/'} className="block">
          <img
            src={logoBiologi}
            alt="BiologiMD"
            className=" h-10 w-[120px] md:w-[200px] md:w-auto"
          />
        </a>

        <HeaderCtas
          isLoggedIn={isLoggedIn}
          cart={cart}
          openCart={openCart}
          getLocalePath={getLocalePath}
        />
      </header>

      <HeaderMenu
        menu={menu}
        viewport="desktop"
        isLoggedIn={isLoggedIn}
        cart={cart}
        isSticky={isSticky}
        offsetTop={offsetTop}
        menuHeight={menuHeight}
        menuRef={menuRef}
        openCart={openCart}
        openMenu={openMenu}
        localePrefix={localePrefix}
        getLocalePath={getLocalePath}
      />
    </div>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');

  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Your Bag" openFrom="right">
      <Suspense fallback={<CartMain layout="drawer" cart={rootData.cart} />}>
        <Await resolve={rootData.recommendedProducts}>
          {(recommendedProducts) => (
            <CartMain
              layout="drawer"
              cart={rootData.cart}
              recommendedProducts={recommendedProducts}
            />
          )}
        </Await>
      </Suspense>
    </Drawer>
  );
}

function MobileMenuDrawer({
  isOpen,
  onClose,
  menu,
  localePrefix,
  getLocalePath,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: HeaderProps['header']['menu'];
  localePrefix: string;
  getLocalePath: (path: string) => string;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} heading="Menu" openFrom="left">
      <nav className="flex flex-col h-full">
        {menu?.items?.map((item) => (
          <MobileMenuItem
            key={item.id}
            item={item}
            onClose={onClose}
            localePrefix={localePrefix}
          />
        ))}

        {/* Sign In block at bottom */}
        <div className="mt-auto border-t border-gray-200 pt-4">
          <a
            href={getLocalePath('/account')}
            className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors rounded-lg"
            onClick={onClose}
          >
            <img src={signin} alt="Sign in" className="w-5 h-5" />
            <span className="text-base text-[#2B8C57] font-medium">
              Sign In
            </span>
          </a>
        </div>
      </nav>
    </Drawer>
  );
}

export function HeaderMenu({
  menu,
  viewport,
  isLoggedIn,
  cart,
  isSticky,
  offsetTop,
  menuHeight,
  menuRef,
  openCart,
  openMenu,
  localePrefix,
  getLocalePath,
}: {
  menu: HeaderProps['header']['menu'];
  viewport: 'desktop' | 'mobile';
  isLoggedIn: HeaderProps['isLoggedIn'];
  cart: HeaderProps['cart'];
  isSticky: boolean;
  offsetTop: number;
  menuHeight: number;
  menuRef: React.RefObject<HTMLDivElement>;
  openCart: () => void;
  openMenu: () => void;
  localePrefix: string;
  getLocalePath: (path: string) => string;
}) {
  // Mobile menu is now handled by MobileMenuDrawer component
  return (
    <>
      <div style={{height: isSticky ? menuHeight : undefined}} />
      <div
        ref={menuRef}
        className={`w-full transition-all duration-300 ${
          isSticky ? 'fixed top-0 left-0 z-[110] bg-white' : 'relative'
        }`}
      >
        <div role="navigation" className="hidden md:block">
          <RenderMenuItems
            items={(menu || FALLBACK_HEADER_MENU).items}
            isSticky={isSticky}
            isLoggedIn={isLoggedIn}
            cart={cart}
            openCart={openCart}
            localePrefix={localePrefix}
            getLocalePath={getLocalePath}
          />
        </div>
      </div>
    </>
  );
}

function RenderMenuItems({
  items,
  isSticky,
  isLoggedIn,
  cart,
  openCart,
  localePrefix,
  getLocalePath,
}: {
  items: any[];
  isSticky: boolean;
  isLoggedIn: HeaderProps['isLoggedIn'];
  cart: HeaderProps['cart'];
  openCart: () => void;
  localePrefix: string;
  getLocalePath: (path: string) => string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const foundIndex = items.findIndex((item) => item?.url === currentPath);
    if (foundIndex !== -1) setActiveIndex(foundIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateUnderline = () => {
      if (
        activeIndex !== null &&
        itemRefs.current[activeIndex] &&
        containerRef.current
      ) {
        const el = itemRefs.current[activeIndex];
        const containerRect = containerRef.current.getBoundingClientRect();
        const elRect = el!.getBoundingClientRect();
        setUnderlineStyle({
          left: elRect.left - containerRect.left,
          width: elRect.width,
        });
      }
    };
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeIndex]);

  if (!items?.length) return null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div>
      <div
        className="relative w-full px-2"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <div className="container m-auto w-full flex items-center justify-between px-4 ">
          <div>
            <a href={localePrefix || '/'} className="block">
              <img
                src={logoBiologi}
                alt="Logo"
                className={` transform duration-0  ${
                  isSticky ? 'opacity-100 ' : 'opacity-0 '
                }`}
              />
            </a>
          </div>

          <div className="relative">
            <ul
              ref={containerRef}
              className="font-poppins flex gap-8 justify-center relative !py-4"
            >
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                  ref={(el) => (itemRefs.current[index] = el)}
                >
                  <a
                    href={sanitizeUrl(item.url, localePrefix)}
                    className={`text-base px-2 py-1 transition-colors duration-200 !no-underline ${
                      index === activeIndex ? '!text-[#2B8C57]' : 'text-black'
                    }`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <div
              className="absolute bottom-0 h-[3px] bg-[#2B8C57] transition-all duration-300 ease-in-out"
              style={{left: underlineStyle.left, width: underlineStyle.width}}
            />
          </div>

          <div
            className={`transform  ${isSticky ? 'opacity-100 ' : 'opacity-0 '}`}
          >
            <HeaderCtas
              isLoggedIn={isLoggedIn}
              cart={cart}
              openCart={openCart}
              getLocalePath={getLocalePath}
            />
          </div>
        </div>

        <div
          className={`absolute top-full left-0 w-screen bg-[#F6F6F6] z-[105] shadow-md transform transition-all duration-300 ease-out ${
            activeItem?.items?.length
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          {activeItem?.items?.length > 0 && (
            <div className="container mx-auto p-12 flex justify-center gap-16">
              {activeItem.items.map((subItem) => (
                <div
                  key={subItem.id}
                  className="flex flex-col gap-3 overflow-y-auto pr-4"
                >
                  <p className="text-base font-semibold font-poppins !text-[#2B8C57]">
                    {subItem.title}
                  </p>
                  <NestedMenuItems
                    items={subItem.items}
                    localePrefix={localePrefix}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NestedMenuItems({
  items,
  localePrefix,
}: {
  items: any[];
  localePrefix: string;
}) {
  if (!items?.length) return null;

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={sanitizeUrl(item.url, localePrefix)}
            className="!text-sm text-[#3F3F3F] font-poppins"
          >
            {item.title}
          </a>
          {item.items?.length > 0 && (
            <NestedMenuItems items={item.items} localePrefix={localePrefix} />
          )}
        </li>
      ))}
    </ul>
  );
}

function MobileMenuItem({
  item,
  onClose,
  localePrefix,
}: {
  item: any;
  onClose: () => void;
  localePrefix: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{[key: string]: boolean}>(
    {},
  );

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // If no subitems, render as a direct link
  if (!item.items || item.items.length === 0) {
    return (
      <a
        href={sanitizeUrl(item.url, localePrefix)}
        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
        onClick={onClose}
      >
        <span className="text-base font-medium text-gray-900">
          {item.title}
        </span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    );
  }

  return (
    <div className="border-b border-gray-100">
      {/* Top-level item toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-base font-medium text-gray-900">
          {item.title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Submenu list */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-50 py-2">
          {item.items.map((subItem: any) => (
            <div key={subItem.id}>
              {/* If subItem has children, make it expandable */}
              {subItem.items && subItem.items.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(subItem.id)}
                    className="w-full flex items-center justify-between px-8 py-3 hover:bg-white transition-colors"
                  >
                    <span className="text-sm font-medium text-[#2B8C57]">
                      {subItem.title}
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#2B8C57] transition-transform duration-200 ${
                        openSubmenus[subItem.id] ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Sub-sub-items */}
                  <div
                    className={`transition-all duration-200 ease-in-out overflow-hidden ${
                      openSubmenus[subItem.id]
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="bg-white">
                      {subItem.items?.map((subSubItem: any) => (
                        <a
                          key={subSubItem.id}
                          href={sanitizeUrl(subSubItem.url, localePrefix)}
                          className="block px-12 py-2.5 text-sm text-gray-700 hover:text-[#2B8C57] hover:bg-gray-50 transition-colors"
                          onClick={onClose}
                        >
                          {subSubItem.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Direct link if no children
                <a
                  href={sanitizeUrl(subItem.url, localePrefix)}
                  className="block px-8 py-3 text-sm font-medium text-[#2B8C57] hover:bg-white transition-colors"
                  onClick={onClose}
                >
                  {subItem.title}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  openCart,
  getLocalePath,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {
  openCart: () => void;
  getLocalePath: (path: string) => string;
}) {
  return (
    <nav
      className="header-ctas flex items-center gap-2 md:gap-8"
      role="navigation"
    >
      <Suspense
        fallback={
          <a href="/account">
            <img src={signin} alt="Sign in" className="w-5 h-5" />
          </a>
        }
      >
        <Await
          resolve={isLoggedIn}
          errorElement={
            <a href="/account">
              <img src={signin} alt="Sign in" className="w-5 h-5" />
            </a>
          }
        >
          {(loggedIn) => (
            <a href="/account">
              <img
                src={signin}
                alt={loggedIn ? 'Account' : 'Sign in'}
                className="w-5 h-5"
              />
            </a>
          )}
        </Await>
      </Suspense>
      <SearchToggle getLocalePath={getLocalePath} />
      <CartToggle cart={cart} openCart={openCart} />
    </nav>
  );
}

function SearchToggle({getLocalePath}: any) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Focus the input when the drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search function
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        // Use dedicated API route for predictive search
        const response = await fetch(
          `/api/predictive-search?q=${encodeURIComponent(searchQuery)}&limit=6`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: any = await response.json();
        // Predictive search returns products as an array directly, not in nodes
        if (
          data.result?.items?.products &&
          Array.isArray(data.result.items.products)
        ) {
          setSearchResults(data.result.items.products.slice(0, 6));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <button
        className="reset cursor-pointer"
        onClick={openDrawer}
        aria-label="Search"
      >
        <img src={search} alt="Search" className="w-5 h-5" />
      </button>

      <Drawer
        open={isOpen}
        onClose={closeDrawer}
        heading="Search"
        openFrom="right"
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8C57] focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2B8C57]"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Search Results */}
          {isSearching && (
            <div className="mt-4 text-center text-gray-500">
              <p>Searching...</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Products ({searchResults.length})
              </h3>
              <div className="space-y-3">
                {searchResults.map((product: any) => {
                  const variant = product.selectedOrFirstAvailableVariant;
                  const imageUrl = variant?.image?.url;
                  const price = variant?.price;

                  return (
                    <a
                      key={product.id}
                      href={getLocalePath(`/products/${product.handle}`)}
                      className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                      onClick={closeDrawer}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {product.title}
                        </h4>
                        {price && (
                          <p className="text-sm text-gray-600 mt-1">
                            ${parseFloat(price.amount).toFixed(2)}{' '}
                            {price.currencyCode}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
              {searchResults.length >= 6 && (
                <button
                  onClick={() => {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }}
                  className="mt-4 w-full py-2 text-sm text-[#2B8C57] hover:bg-gray-50 rounded-md transition"
                >
                  View all results
                </button>
              )}
            </div>
          )}

          {!isSearching &&
            searchQuery.trim().length >= 2 &&
            searchResults.length === 0 && (
              <div className="mt-4 text-center text-gray-500">
                <p>No products found for &quot;{searchQuery}&quot;</p>
              </div>
            )}

          {/* Popular Searches */}
          {searchQuery.trim().length < 2 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Skincare', 'Moisturizer', 'Cleanser', 'Sunscreen'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                    >
                      {term}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}

function CartBadge({
  count,
  openCart,
}: {
  count: number | null;
  openCart: () => void;
}) {
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      onClick={() => {
        openCart();
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative inline-block reset cursor-pointer"
    >
      <img src={cartIcon} alt="Cart" className="h-5 w-6" />
      {typeof count === 'number' && count > 0 && (
        <span className="absolute -top-[7px] -right-[8px] text-xs bg-[#2B8C57] flex items-center justify-center p-2 text-white w-2 h-2 rounded-full text-[10px]">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({
  cart,
  openCart,
}: Pick<HeaderProps, 'cart'> & {openCart: () => void}) {
  return <CartBanner cartData={cart} openCart={openCart} />;
}

function CartBanner({
  cartData,
  openCart,
}: {
  cartData: CartApiQueryFragment | null;
  openCart: () => void;
}) {
  const cart = useOptimisticCart(cartData);
  return <CartBadge count={cart?.totalQuantity ?? 0} openCart={openCart} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [],
};

export function PromoCarousel() {
  const messages = ['Free shipping for orders above a $300 total'];

  // const [index, setIndex] = useState(0);
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const handlePrev = () => {
  //   setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  // };

  // const handleNext = () => {
  //   setIndex((prev) => (prev + 1) % messages.length);
  // };

  // useEffect(() => {
  //   timeoutRef.current = setTimeout(() => {
  //     setIndex((prev) => (prev + 1) % messages.length);
  //   }, 5000);

  //   return () => {
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   };
  // }, [index, messages.length]);

  return (
    <div className="relative w-full max-w-[800px] overflow-hidden px-6">
      {/* Arrows */}
      {/* <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 z-10 cursor-pointer"
        aria-label="Previous"
      >
        <img src={left} alt="Previous" className="w-4 h-4" />
      </button> */}

      <div className="overflow-hidden w-full">
        <div className="flex">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="w-full shrink-0 flex justify-center items-center"
            >
              <p className="text-[13px] text-[#4F4F4F] uppercase text-center whitespace-nowrap">
                {msg}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 z-10 cursor-pointer"
        aria-label="Next"
      >
        <img src={right} alt="Next" className="w-4 h-4" />
      </button> */}
    </div>
  );
}
