// components/PackProduct.tsx
import {Link} from 'react-router-dom';
import {Image, Money} from '@shopify/hydrogen';
import packhero from '~/assets/images/container.png';

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

export function PackProduct({products}: {products: ProductNode[]}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="container mx-auto my-12">
      <div className="flex flex-col justify-center items-center p-8 gap-4">
        <h2 className="font-poppins !text-2xl !font-bold">
          Best-Selling Bundles
        </h2>
        <p className="font-poppins !text-base !font-normal text-center">
          Discover our complete routines designed by skin experts to support
          healthy skin with medical-grade care.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row justify-center gap-4 items-start">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-2 w-[100%] lg:w-[50%] items-center"
          >
            <a href={`/products/${product.handle}`} className="w-[100%]">
              {product.featuredImage && (
                <Image
                  data={product.featuredImage}
                  className="w-full h-[700px] object-cover"
                  alt={product.featuredImage.altText || product.title}
                />
              )}
            </a>
            <h2 className="font-poppins text-2xl font-semibold !mt-4 text-[#2B8C57]">
              {product.title}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {product.tags?.join(' · ')}
            </p>
            <Money data={product.priceRange.minVariantPrice} />
            <button className="cursor-pointer w-[90%] border border-[#2B8C57] py-3 text-[#2B8C57] uppercase text-sm transition-colors duration-300 hover:bg-[#2B8C57] hover:text-white">
              Add to Bag
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
