import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
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
    <Suspense>
      <Await resolve={Promise.all([footerPromise, collectionsPromise])}>
        {([footer, collections]) => (
          <footer className="">
            {/* Middle Section */}
            <div className="  py-12 px-6 bg-[#F6F6F6]  justify-between items-start  gap-8 border-b border-gray-300">
              <div className="container m-auto flex flex-col md:flex-row gap-6">
                {/* Left: Paragraph + Input */}

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="!text-lg text-[#2B8C57] font-poppins">
                      Keep In Touch With BiologiMd®
                    </p>
                    <p className="!text-sm max-w-[75%]">
                      Join the BiologiMD® newsletter. Sign up to be the first
                      to access new skincare launches, expert tips, and
                      exclusive offers.
                    </p>
                  </div>
                  <form className="flex items-center gap-6">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="!border-0 !border-b !border-black focus:outline-none !rounded-none !p-0 !py-3 !m-0 w-[60%]"
                    />

                    <button
                      type="submit"
                      className=" bg-[#2B8C57] font-poppins text-white px-6 py-3 uppercase font-normal"
                    >
                      Sign up
                    </button>
                  </form>

                  <div>
                    <p className="!text-sm max-w-[75%]">
                      This site is protected by reCAPTCHA Enterprise and the
                      Google{' '}
                      <span>
                        <a href="/" className="!underline">
                          Privacy Policy
                        </a>{' '}
                      </span>
                      and{' '}
                      <a href="/" className="!underline">
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
                      <a href="https://www.tiktok.com/@biologimdclinic">
                        <img
                          src={tiktok}
                          alt=""
                          className="w-5 h-5 hover:scale-110 transition-transform"
                        />
                      </a>
                      <a href="https://www.instagram.com/biologimdclinic/#">
                        <img
                          src={facebook}
                          alt=""
                          className="w-5 h-5 hover:scale-110 transition-transform"
                        />
                      </a>
                      <a href="https://www.facebook.com/thebiologimd">
                        <img
                          src={instagram}
                          alt=""
                          className="w-5 h-5 hover:scale-110 transition-transform"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Footer Menu */}
                <div className="md:w-1/2 flex justify-around gap-5">
                  <div className="flex flex-col gap-3">
                    <h1 className=" font-poppins !m-0 !text-[16px]">
                      Shop All
                    </h1>
                    {collections?.collections?.nodes?.map(
                      (collection) =>
                        collection.title !== 'home' && (
                          <a
                            key={collection.id}
                            className="font-poppins text-sm text-gray-800 font-light"
                            href={`/collections/${collection.handle}`}
                          >
                            {collection.title}
                          </a>
                        ),
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <h1 className="font-poppins !m-0 !text-[16px]">
                      Learn More
                    </h1>
                    {/* <a
                      className="font-poppins text-sm text-gray-800 font-light"
                      href="/about"
                    >
                      The BiologiMD Story
                    </a> */}
                    {/* <a
                      className="font-poppins text-sm text-gray-800 font-light"
                      href="/getting-ready"
                    >
                      Getting Skin Ready
                    </a>
                    <a
                      className="font-poppins text-sm text-gray-800 font-light"
                      href="/build-your-routine"
                    >
                      Build Your Routine
                    </a> */}
                    {/* <a
                      className="font-poppins text-sm text-gray-800 font-light"
                      href="/subscriptions"
                    >
                      Subscriptions
                    </a> */}
                    <a
                      className="font-poppins text-sm text-gray-800 font-light"
                      href="/blogs"
                    >
                      Blog
                    </a>
                  </div>

                  <div>
                    <h1 className="font-poppins !m-0 !text-[16px]">Support</h1>
                    <a
                      className="font-poppins text-sm text-gray-800 font-light"
                      href="/contact"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="text-center text-sm bg-[#E7E7E7] py-6">
              © 2025 BiologiMD. All Rights Reserved.
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
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
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
            className="text-sm hover:underline "
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
            className="text-sm hover:underline font-poppins"
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
    color: isPending ? 'grey' : 'inherit',
  };
}
