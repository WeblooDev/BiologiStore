import {useEffect, useRef, useState, Suspense} from 'react';
import {Await, Link, useRouteLoaderData} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import type {RootLoader} from '~/root';
import {Drawer, useDrawer} from '~/components/Drawer';
import {CartMain} from '~/components/CartMain';
import {useCartFetchers} from '~/lib/cart-utils';
import logoBiologi from '~/assets/images/logoBiologi.svg';
import cartIcon from '~/assets/images/cart.svg';
import search from '~/assets/images/search.svg';
import signin from '~/assets/images/signin.svg';
import burger from '~/assets/images/burger.svg';
import facebook from '~/assets/images/facebook.svg';
import instagram from '~/assets/images/instagram.svg';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';

interface HeaderProps {
  title: string;
  menu?: any;
}

export function Header({title, menu}: HeaderProps) {
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
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        title={title}
        menu={menu}
        openCart={openCart}
        openMenu={openMenu}
      />
      <MobileHeader title={title} openCart={openCart} openMenu={openMenu} />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Your bag" openFrom="right">
      <Suspense fallback={<p className="p-6">Loading cart...</p>}>
        <Await resolve={rootData?.cart}>
          {(cart) => <CartMain layout="aside" cart={cart} />}
        </Await>
      </Suspense>
    </Drawer>
  );
}

function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: any;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <nav className="flex flex-col w-full">
        {menu?.items?.map((item: any) => (
          <Link
            key={item.id}
            to={item.url}
            onClick={onClose}
            className="px-6 py-4 border-b hover:bg-gray-50"
          >
            {item.title}
          </Link>
        ))}

        {/* Sign In block */}
        <div className="flex items-center gap-3 px-6 py-6 bg-[#f6f6f6] mt-auto">
          <img src={signin} alt="Sign in" className="w-5 h-5" />
          <Link
            to="/account"
            className="text-base text-[#2B8C57]"
            onClick={onClose}
          >
            Sign In
          </Link>
        </div>
      </nav>
    </Drawer>
  );
}

function DesktopHeader({
  title,
  menu,
  openCart,
  openMenu,
}: {
  title: string;
  menu?: any;
  openCart: () => void;
  openMenu: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

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

  useEffect(() => {
    const currentPath = window.location.pathname;
    const foundIndex = menu?.items?.findIndex(
      (item: any) => item?.url === currentPath,
    );
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

  return (
    <header className="hidden lg:block bg-white">
      {/* Promo Carousel */}
      <PromoCarousel />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-20 py-4 border-b">
        <div className="flex items-center gap-4">
          <img src={facebook} alt="Facebook" className="w-4 h-4" />
          <img src={instagram} alt="Instagram" className="w-4 h-4" />
        </div>
        <Link to="/">
          <img src={logoBiologi} alt={title} className="h-8" />
        </Link>
        <div className="flex items-center gap-6">
          <img src={search} alt="Search" className="w-5 h-5 cursor-pointer" />
          <Link to="/account">
            <img src={signin} alt="Sign in" className="w-5 h-5" />
          </Link>
          <CartCount openCart={openCart} />
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        ref={menuRef}
        className={`${
          isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative'
        } bg-white transition-all duration-300`}
      >
        <nav className="px-20">
          <ul
            ref={containerRef}
            className="flex items-center justify-center gap-8 py-4 relative"
          >
            {menu?.items?.map((item: any, index: number) => (
              <li
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <Link
                  to={item.url}
                  className="text-sm uppercase tracking-wide hover:text-[#2B8C57] transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            {activeIndex !== null && (
              <div
                className="absolute bottom-0 h-0.5 bg-[#2B8C57] transition-all duration-300"
                style={{
                  left: `${underlineStyle.left}px`,
                  width: `${underlineStyle.width}px`,
                }}
              />
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function MobileHeader({
  title,
  openCart,
  openMenu,
}: {
  title: string;
  openCart: () => void;
  openMenu: () => void;
}) {
  return (
    <header className="lg:hidden bg-white border-b sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={openMenu} className="p-2">
          <img src={burger} alt="Menu" className="w-6 h-6" />
        </button>
        <Link to="/">
          <img src={logoBiologi} alt={title} className="h-6" />
        </Link>
        <div className="flex items-center gap-4">
          <img src={search} alt="Search" className="w-5 h-5" />
          <CartCount openCart={openCart} />
        </div>
      </div>
    </header>
  );
}

function CartCount({openCart}: {openCart: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<CartBadge count={0} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <CartBadge openCart={openCart} count={cart?.totalQuantity || 0} />
        )}
      </Await>
    </Suspense>
  );
}

function CartBadge({openCart, count}: {count: number; openCart: () => void}) {
  return (
    <button onClick={openCart} className="relative cursor-pointer">
      <img src={cartIcon} alt="Cart" className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#2B8C57] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function PromoCarousel() {
  const messages = [
    'FREE STANDARD SHIPPING ON ORDERS OF $175+',
    'BUY ONE GET ONE FREE ON SELECT ITEMS',
    'JOIN OUR VIP CLUB AND SAVE 10%',
  ];

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % messages.length);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, messages.length]);

  return (
    <div className="bg-[#2B8C57] text-white py-2">
      <div className="relative w-full max-w-[800px] mx-auto overflow-hidden px-12">
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 z-10 cursor-pointer"
          aria-label="Previous"
        >
          <img src={left} alt="Previous" className="w-4 h-4" />
        </button>

        <div className="text-center text-sm font-medium">{messages[index]}</div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 z-10 cursor-pointer"
          aria-label="Next"
        >
          <img src={right} alt="Next" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
