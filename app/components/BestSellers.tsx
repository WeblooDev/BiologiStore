import {Image, Money} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

type ProductNode = RecommendedProductsQuery['products']['nodes'][0];

type BestSellersProps = {
  products: RecommendedProductsQuery | null;
  title?: string;
};

export function BestSellers({products, title = 'Best Sellers'}: BestSellersProps) {
  if (!products) return null;

  const bestSellers: ProductNode[] = products.products.nodes.slice(0, 3);

  return (
    <section className="container m-auto best-sellers">
      <div className="flex justify-center">
        <h2 className="!text-4xl mb-4">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bestSellers.map((product) => (
          <div key={product.id} className="best-seller-item flex flex-col items-center gap-4 justify-between">
            {product.featuredImage && (
              <Image
                data={product.featuredImage}
                sizes="(min-width: 768px) 33vw, 100vw"
                className=" h-[500px] object-cover mb-6"
              />
            )}
            <h3 className="text-lg text-[#2B8C57]">{product.title}</h3>

            {product.tags?.length > 0 && (
              <p className="text-sm text-center">{product.tags.join(', ')}</p>
            )}

            <div className="mt-2 font-medium text-gray-900">
              <Money data={product.priceRange.minVariantPrice} />
            </div>

            <button
              className="border border-[#2B8C57] uppercase bg-white  px-12 py-3 text-[#2B8C57] cursor-pointer hover:text-white hover:bg-[#2B8C57]"
              onClick={() => {
                console.log(`Add to cart: ${product.id}`);
              }}
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
