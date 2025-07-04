import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import facebook from '~/assets/images/facebook.svg';
import instagram from '~/assets/images/instagram.svg';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className=" mt-16">
           

            {/* Middle Section */}
            <div className="  py-12 px-6 bg-[#F6F6F6]  justify-between items-start  gap-8 border-b border-gray-300">

              <div className='container m-auto flex flex-col md:flex-row gap-6'>
              {/* Left: Paragraph + Input */}

              <div className="flex flex-col gap-6">
                <p className="text-base !text-lg text-[#2B8C57] font-gayathri">Keep In Touch With BiologiMd®</p>
                <p className='!text-sm'>Join the BiologiMD® newsletter. Sign up to be the first to access new skincare launches, expert tips, and exclusive offers.</p>
                <form className="flex items-center gap-6">
                  <input
                  type="email"
                  placeholder="Enter your email"
                  className="!border-0 !border-b !border-black focus:outline-none !rounded-none !p-0 !py-3 !m-0 w-[60%]"
                />
 
                  <button
                    type="submit"
                    className=" bg-[#2B8C57] font-gayathri text-white px-6 py-3 uppercase">
                  
                    Sign up
                  </button>
                </form>

                <div>
                  <p className='!text-sm'>This site is protected by reCAPTCHA Enterprise and the Google <a href=''>Privacy Policy</a>and <a href="">Terms of Service</a> apply.</p>
                </div>
                <div>
                  <p className='text-[#2B8C57] font-gayathri !m-0 !text-lg'>Follow BiologiMD®</p>
                  <p className='!text-sm !m-0'>Enhance your natural beauty™</p>
                   <div className='flex items-center gap-6 mt-6'>
                    <a href="https://www.facebook.com/thebiologimd">
                    <img src={instagram} alt="" className="w-5 h-5 hover:scale-110 transition-transform"/>
                    </a>
                    <a href="https://www.instagram.com/biologimdclinic/#">
                  <img src={facebook} alt="" className="w-5 h-5 hover:scale-110 transition-transform"/>
                  </a>
                </div>
                </div>
               
              </div>

              {/* Right: Footer Menu */}
              <div className="md:w-1/2 flex justify-around gap-5">

             <div className='flex flex-col gap-3'>
               <h1 className='text-[#2B8C57] font-gayathri !m-0 !text-lg'>About</h1>
               <a className='font-gayathri' href="">Home</a>
               <a className='font-gayathri' href="">The BiologiMD Story</a>
               <a className='font-gayathri' href="/Blog">Blog</a>
             </div> 

               <div>
               <h1 className='text-[#2B8C57] font-gayathri !m-0 !text-lg'>Support</h1>
               <a className='font-gayathri' href="">Contact Us</a>
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
            className="text-sm hover:underline font-gayathri"
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
