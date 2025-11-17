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

export function ProductSiblings({products}: {products: SiblingProduct[]}) {
  if (!products?.length) return null;

  return (
    <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col justify-between items-center text-center gap-2"
        >
          {product.featuredImage?.url && (
            <a href={`/products/${product.handle}`} className="bg-[#F6F6F6]">
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                className="object-cover w-full h-[130px]"
              />
            </a>
          )}
          <h3 className="font-poppins text-sm ">{product.title}</h3>
          <a
            href={`/products/${product.handle}`}
            className="border uppercase border-[#2B8C57] !text-[#2B8C57] px-2 py-1 text-[12px] w-full"
          >
            Shop now
          </a>
        </div>
      ))}
    </div>
  );
}
