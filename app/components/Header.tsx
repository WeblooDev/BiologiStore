import {useEffect, useRef, useState} from 'react';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import logoBiologi from '~/assets/images/logoBiologi.svg';
import {Suspense} from 'react';
import {Await} from 'react-router';
import cartIcon from '~/assets/images/cart.svg';
import search from '~/assets/images/search.svg';
import signin from '~/assets/images/signin.svg';
import burger from '~/assets/images/burger.svg';

import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import {useLocation} from 'react-router';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';



interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

type Viewport = 'desktop';


function sanitizeUrl(url: string): string {
  if (url?.startsWith('/')) return url;

  const domainsToStrip = ['https://shop.biologimd.com', 'https://checkout.biologimd.com'];
  for (const domain of domainsToStrip) {
    if (url?.startsWith(domain)) {
      return url.replace(domain, '');
    }
  }

  return url;
}


export function Header({header, isLoggedIn, cart}: HeaderProps) {
    const { open } = useAside(); // ✅ ADD THIS LINE

  const {shop, menu} = header;
  const location = useLocation();

  // Check if the path starts with /products/
  const isProductPage = location.pathname.startsWith('/products/');

   return (

    
    <div
      className={` w-full absolute top-0 z-10 transition-all duration-300 ${
        isProductPage ? 'bg-transparent hover:bg-white' : 'bg-white'
      }`}
    >

      <div className='border-b border-b-[#BDBDBD] flex justify-center p-2 w-full'>
  <PromoCarousel />

      </div>
      {/* Top Logo Section */}
        <header className="container m-auto w-full flex justify-between items-center p-4 md:p-6">
        <div className="w-[10%] opacity-100 md:opacity-0 md:pointer-events-none transition-opacity duration-300">
      <button onClick={() => open('mobile')} aria-label="Open menu">
        <img
          src={burger}
          alt="Open menu"
          className="w-7 h-7 object-contain cursor-pointer"
        /> 
         \\
      </button>
    </div>

        <a href="/" className="block">
          <img src={logoBiologi} alt="BiologiMD" className=" h-10 w-[200px] md:w-auto" />
        </a>

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>

      <HeaderMenu
        menu={menu}
        viewport="desktop"
        isLoggedIn={isLoggedIn}
        cart={cart}
      />
    </div>
  );
}

export function HeaderMenu({
  menu,
  viewport,
  isLoggedIn,
  cart,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  viewport: 'desktop' | 'mobile';
  isLoggedIn: HeaderProps['isLoggedIn'];
  cart: HeaderProps['cart'];
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}) {
  const {close} = useAside();

if (viewport === 'mobile') {
  return (
    <nav className="flex flex-col w-full">
      {menu.items.map((item) => (
        <MobileMenuItem key={item.id} item={item} />
      ))}

      {/* Sign In block after all links */}
      <div className="flex items-center gap-3 px-4 py-6  bg-[#f6f6f6]">
        <img src={signin} alt="Sign in" className="w-5 h-5" />
        <a href="/account" className="text-base  text-[#2B8C57]">
          Sign In
        </a>
      </div>
    </nav>
  );
}


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
      }
    };

    updateMeasurements();
    window.addEventListener('resize', updateMeasurements);
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop >= offsetTop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offsetTop]);

  return (
    <>
      <div style={{ height: isSticky ? menuHeight : undefined }} />
      <div
        ref={menuRef}
        className={`w-full transition-all duration-300 ${
          isSticky ? 'fixed top-0 left-0 z-50 bg-white' : 'relative'
        }`}
      >
<div role="navigation" className="hidden md:block">
          <RenderMenuItems
            items={(menu || FALLBACK_HEADER_MENU).items}
            isSticky={isSticky}
            isLoggedIn={isLoggedIn}
            cart={cart}
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
}: {
  items: any[];
  isSticky: boolean;
  isLoggedIn: HeaderProps['isLoggedIn'];
  cart: HeaderProps['cart'];
}) {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({left: 0, width: 0});
  const containerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const foundIndex = items.findIndex((item) => item?.url === currentPath);
    if (foundIndex !== -1) setActiveIndex(foundIndex);
  }, [items]);

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
      <div className="relative w-full px-2" onMouseLeave={() => setActiveIndex(null)}>
        <div className="container m-auto w-full flex items-center justify-between px-4 ">
          <div>
                    <a href="/" className="block">

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
            <ul ref={containerRef} className="font-gayathri flex gap-8 justify-center relative !py-4">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="group cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                  ref={(el) => (itemRefs.current[index] = el)}
                >
                  <a href={sanitizeUrl(item.url)}
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

          <div  className={`transform  ${
            isSticky ? 'opacity-100 ' : 'opacity-0 '
          }`}>
                   <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />

          </div>
        </div>

        <div
          className={`absolute top-full left-0 w-screen bg-[#F6F6F6] z-40 shadow-md transform transition-all duration-300 ease-out ${
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
                  <p className="text-base font-semibold font-gayathri !text-[#2B8C57]">
                    {subItem.title}
                  </p>
                  <NestedMenuItems items={subItem.items} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NestedMenuItems({items}: {items: any[]}) {
  if (!items?.length) return null;

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.id}>
         <a href={sanitizeUrl(item.url)} className="!text-sm text-[#3F3F3F] font-gayathri">
            {item.title}
          </a>
          {item.items?.length > 0 && <NestedMenuItems items={item.items} />}
        </li>
      ))}
    </ul>
  );
}



function MobileMenuItem({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border-b border-gray-400">
      {/* Top-level item toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full text-left p-4 flex justify-between items-center text-lg "
      >
        {item.title}
        {item.items?.length > 0 && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 cursor-pointer ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            {!isOpen && (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
            )}
          </svg>
        )}
      </button>

      {/* Submenu list */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2 flex flex-col bg-[#f6f6f6]">
          {item.items.map((subItem: any) => (
            <div key={subItem.id} className="flex flex-col px-4 py-3 gap-3">
              {/* Sub-item toggle */}
              <button
                onClick={() => toggleSubmenu(subItem.id)}
                className="text-base text-[#2B8C57] text-left flex justify-between items-center"
              >
                {subItem.title}
                {subItem.items?.length > 0 && (
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 cursor-pointer${
                      openSubmenus[subItem.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    {!openSubmenus[subItem.id] && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
                    )}
                  </svg>
                )}
              </button>

              {/* Sub-sub-items */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openSubmenus[subItem.id]
                    ? 'max-h-[500px] opacity-100 mt-1'
                    : 'max-h-0 opacity-0'
                } flex flex-col gap-3`}
              >
                {subItem.items?.map((subSubItem: any) => (
                 <a
                    key={subSubItem.id}
                    href={sanitizeUrl(subSubItem.url)}
                    className="text-base cursor-pointer"
                  >
                    {subSubItem.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileMenuItem;





function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas flex items-center gap-2 md:gap-6" role="navigation">
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
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}


function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      <img src={search} alt="Search" className="w-5 h-5" />
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

        // ✅ Add this debug log here
        console.log("🟢 CartToggle clicked – triggering open('cart')");

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
      <img src={cartIcon} alt="Cart" className='h-5 w-6' />
      {typeof count === 'number' && count > 0 && (
        <span className="absolute -top-[7px] -right-[8px] text-xs bg-[#2B8C57] flex items-center justify-center p-2 text-white w-2 h-2 rounded-full text-[10px]">
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



export function PromoCarousel() {
  const messages = [
    'FREE STANDARD SHIPPING ON ORDERS OF $175+',
    'BUY ONE GET ONE FREE ON SELECT ITEMS',
    'JOIN OUR VIP CLUB AND SAVE 10%',
  ];

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="relative w-full max-w-[800px] overflow-hidden px-6">
      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 z-10 cursor-pointer"
        aria-label="Previous"
      >
        <img src={left} alt="Previous" className="w-4 h-4" />
      </button>

      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${messages.length * 100}%`,
            transform: `translateX(-${index * (100 / messages.length)}%)`,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 flex justify-center items-center"
              style={{ width: `${100 / messages.length}%` }}
            >
              <p className="text-[13px] text-[#4F4F4F] uppercase text-center whitespace-nowrap">
                {msg}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 z-10 cursor-pointer"
        aria-label="Next"
      >
        <img src={right} alt="Next" className="w-4 h-4" />
      </button>
    </div>
  );
}


