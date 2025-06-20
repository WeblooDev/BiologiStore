
interface SiblingProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
}

export function ProductSiblings({ products }: { products: SiblingProduct[] }) {
  if (!products?.length) return null;

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col justify-between items-center text-center gap-2">
          {product.featuredImage?.url && (
            <a href={`/products/${product.handle}`}>
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                className="object-cover w-full h-48"
              />
            </a>
          )}
          <h3 className="mt-2 text-sm ">{product.title}</h3>
          <a
            href={`/products/${product.handle}`}
            className="mt-2  border uppercase border-[#2B8C57] !text-[#2B8C57] px-4 py-2 text-sm"
          >
            Shop now
          </a>
        </div>
      ))}
    </div>
  );
}
