import type {Product} from '@shopify/hydrogen/storefront-api-types';
import bundleBackground from '~/assets/images/bundleBackground.webp';

type Props = {
  products: Product[];
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({length: Math.ceil(arr.length / size)}, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

export function BundleProducts({products}: Props) {
  if (!products || products.length === 0) return null;

  const productRows = chunkArray(products, 2);

  return (
    <div
      className="bundle-products py-16 bg-cover bg-center"
      style={{ backgroundImage: `url(${bundleBackground})` }}
    >
        <div className='flex justify-center'>
      <h2 className="!text-3xl font-semibold mb-4">This Bundle Includes</h2>
    </div>
      <div>
        {productRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`container m-auto grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 ${
              rowIndex > 0 ? 'border-t border-gray-400' : ''
            }`}
          >
            {row.map((product) => {
              const price = product.priceRange?.minVariantPrice;
              return (
                <a
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className=" overflow-hidden transition  bg-opacity-80"
                >
                    <div className='flex items-center py-6'>
                  {product.featuredImage && (
                    <div className='bg-[#F6F6F6] p-4'>
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      className="w-full h-56 object-cover"
                    />
                    </div>
                  )}
                  <div className="p-4 w-[70%]">
                    <h3 className="font-gayathri text-lg font-medium text-gray-800">{product.title}</h3>
                    <p className="text-sm line-clamp-2 mt-1">
                      {product.description}
                    </p>
                   
                  </div>
                  </div>
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
