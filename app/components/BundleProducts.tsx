// components/BundleProducts.tsx

import {Link} from 'react-router-dom';

export function BundleProducts({products}: {products: any[]}) {
  if (!products?.length) return null;

  return (
    <section className="my-10 px-4">
      <h2 className="text-2xl font-bold mb-4">What’s Inside the Bundle</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
          >
            <Link to={`/products/${product.handle}`}>
              <img
                src={product.featuredImage?.url}
                alt={product.featuredImage?.altText || product.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                {product.description?.slice(0, 100)}...
              </p>
              <p className="text-sm font-medium text-green-700">
                From {product.priceRange?.minVariantPrice?.amount}{' '}
                {product.priceRange?.minVariantPrice?.currencyCode}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
