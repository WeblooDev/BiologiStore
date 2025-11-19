// components/PackProduct.tsx
import {Link} from 'react-router-dom';
import {Image, Money} from '@shopify/hydrogen';
import packhero from '~/assets/images/container.png';
import {ProductItem} from './ProductItem';

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
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
