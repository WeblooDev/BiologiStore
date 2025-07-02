// components/BundleProduct.tsx

import {Link} from 'react-router-dom';
import {Image, Money} from '@shopify/hydrogen';

type BundleProductType = {
  id: string;
  title: string;
  handle: string;
  tags?: string[];
  featuredImage?: {
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

export function BundleProduct({products}: {products: BundleProductType[]}) {
  if (!products?.length) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Featured Skincare Bundles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
          >
            <Link to={`/products/${product.handle}`}>
              {product.featuredImage?.url && (
                <Image
                  data={product.featuredImage}
                  aspectRatio="1/1"
                  className="object-cover w-full h-64"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                <Money
                  data={product.priceRange.minVariantPrice}
                  className="text-base font-bold"
                />
              </div>
            </Link>
            <div className="p-4 mt-auto">
              <Link
                to={`/products/${product.handle}`}
                className="bg-black text-white text-center py-2 px-4 w-full block rounded hover:bg-gray-800 transition"
              >
                Add to Cart
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
