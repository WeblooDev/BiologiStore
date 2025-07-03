// components/PackProduct.tsx
import {Link} from 'react-router-dom';
import {Image, Money} from '@shopify/hydrogen';
import packhero from '~/assets/images/packhero.webp';


type ProductNode = {
  id: string;
  title: string;
  handle: string;
  tags?: string[];
  featuredImage?: {
    id: string;
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

export function PackProduct({product}: {product: ProductNode}) {
  if (!product) return null;

  return (
    <section className="container m-auto my-12">
        <div className='flex flex-col justify-center items-center p-8'>
      <h2 className="font-gayathri !text-4xl !font-normal mb-6">Best-Selling Bundles</h2>
    <p>Discover our complete routines designed by skin experts to support healthy skin with medical-grade care.</p>
    </div>
      <div className="flex flex-col lg:flex-row justify-center gap-4 items-start">

<div className='w-[100%] lg:w-[50%]'>
        <img src={packhero} alt=""               className="w-full h-[850px] object-cover"/>
</div>
        <div className='flex flex-col gap-2 w-[100%] lg:w-[50%] items-center'>
        <a href={`/products/${product.handle}`} className='w-[100%]'>
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              className="w-full h-[850px] object-cover"
              alt={product.featuredImage.altText || product.title}
            />
          )}
        </a>
        <h2 className="font-gayathri text-2xl font-semibold mt-4 text-[#2B8C57]">{product.title}</h2>
        <Money data={product.priceRange.minVariantPrice} />
        <button className='w-full border border-[#2B8C57] py-4 text-[#2B8C57] uppercase'>Add to Bag</button>
      </div>
      </div>
    </section>
  );
}
