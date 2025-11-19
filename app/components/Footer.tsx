import {Suspense, useState} from 'react';
import {Await, NavLink, useFetcher} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import facebook from '~/assets/images/facebook.svg';
import instagram from '~/assets/images/instagram.svg';
import tiktok from '~/assets/images/tiktok.svg';

interface CollectionsQueryResult {
  collections: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
    }>;
  };
}

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  collections: Promise<CollectionsQueryResult | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  collections: collectionsPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer className="">
      {/* Middle Section */}
      <div className="py-12 px-6 bg-[#F6F6F6] justify-between items-start gap-8 border-b border-gray-300">
        <div className="container m-auto flex flex-col md:flex-row gap-6">
          {/* Left: Newsletter + Social */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="!text-lg text-[#2B8C57] font-poppins">
                Keep In Touch With BiologiMd®
              </p>
              <p className="!text-sm max-w-[75%]">
                Join the BiologiMD® newsletter. Sign up to be the first to
                access new skincare launches, expert tips, and exclusive offers.
              </p>
            </div>
            <NewsletterForm />
            <div>
              <p className="!text-sm max-w-[75%]">
                This site is protected by reCAPTCHA Enterprise and the Google{' '}
                <span>
                  <a
                    href="https://policies.google.com/privacy"
                    className="!underline"
                  >
                    Privacy Policy
                  </a>{' '}
                </span>
                and{' '}
                <a
                  href="https://policies.google.com/terms"
                  className="!underline"
                >
                  Terms of Service
                </a>{' '}
                apply.
              </p>
            </div>
            <div className="gap-3 flex flex-col">
              <p className="text-[#2B8C57] font-poppins !text-lg">
                Follow BiologiMD®
              </p>
              <p className="!text-sm">Enhance your natural beauty™</p>
              <div className="flex items-center gap-6 mt-2">
                <a
                  href="https://www.tiktok.com/@biologimdclinic"
                  className="cursor-pointer"
                >
                  <img
                    src={tiktok}
                    alt="TikTok"
                    className="w-5 h-5 hover:scale-125 transition-all duration-300 hover:opacity-80"
                  />
                </a>
                <a
                  href="https://www.facebook.com/thebiologimd"
                  className="cursor-pointer"
                >
                  <img
                    src={facebook}
                    alt="Facebook"
                    className="w-5 h-5 hover:scale-125 transition-all duration-300 hover:opacity-80"
                  />
                </a>
                <a
                  href="https://www.instagram.com/biologimdclinic/#"
                  className="cursor-pointer"
                >
                  <img
                    src={instagram}
                    alt="Instagram"
                    className="w-5 h-5 hover:scale-125 transition-all duration-300 hover:opacity-80"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Footer Menu */}
          <div className="md:w-1/2 flex justify-around gap-5">
            <div className="flex flex-col gap-3">
              <h1 className="font-poppins !m-0 !text-[16px]">Shop All</h1>
              <Suspense fallback={null}>
                <Await resolve={collectionsPromise}>
                  {(collections) => (
                    <>
                      {collections?.collections?.nodes?.map(
                        (collection) =>
                          collection.title !== 'home' && (
                            <NavLink
                              key={collection.id}
                              className="font-poppins text-sm text-gray-800 font-light hover:underline cursor-pointer transition-all duration-300 hover:text-[#2B8C57] hover:translate-x-1"
                              to={`/collections/all?category=${collection.handle}`}
                              prefetch="intent"
                            >
                              {collection.title}
                            </NavLink>
                          ),
                      )}
                    </>
                  )}
                </Await>
              </Suspense>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-poppins !m-0 !text-[16px]">Learn More</h1>
              <NavLink
                className="font-poppins text-sm text-gray-800 font-light hover:underline cursor-pointer transition-all duration-300 hover:text-[#2B8C57] hover:translate-x-1"
                to="/about"
                prefetch="intent"
              >
                The BiologiMD Story
              </NavLink>
              <NavLink
                className="font-poppins text-sm text-gray-800 font-light hover:underline cursor-pointer transition-all duration-300 hover:text-[#2B8C57] hover:translate-x-1"
                to="/blogs"
                prefetch="intent"
              >
                Blog
              </NavLink>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-poppins !m-0 !text-[16px]">Support</h1>
              <NavLink
                className="font-poppins text-sm text-gray-800 font-light hover:underline cursor-pointer transition-all duration-300 hover:text-[#2B8C57] hover:translate-x-1"
                to="/contact"
                prefetch="intent"
              >
                Contact Us
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-sm bg-[#E7E7E7] py-6">
        © 2025 BiologiMD. All Rights Reserved.
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      // You can integrate with Shopify Customer API, Klaviyo, Mailchimp, etc.
      // For now, we'll log it and show success
      console.log('Newsletter signup:', email);

      // Example: Send to your backend or third-party service
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form className="flex items-center gap-6" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="!border-0 !border-b !border-black focus:outline-none !rounded-none !p-0 !py-3 !m-0 w-[60%] transition-all duration-300 focus:!border-[#2B8C57]"
          required
        />
        <button
          type="submit"
          className="bg-[#2B8C57] font-poppins text-white px-6 py-3 uppercase font-normal cursor-pointer transition-all duration-300 hover:bg-[#237A49] hover:scale-105 active:scale-95"
        >
          Sign up
        </button>
      </form>
      {message && (
        <p
          className={`text-sm ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
