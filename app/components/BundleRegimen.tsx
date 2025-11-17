import {Image, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';

interface Product {
  id: string;
  handle: string;
  title: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  description?: string;
  tags?: string[];
  stepLabel?: {
    value?: string;
  };
}

interface BundleRegimenProps {
  products: Product[];
}

export function BundleRegimen({products}: BundleRegimenProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Default step labels if not provided in Shopify
  const defaultSteps = [
    'Cleanse',
    'Exfoliate',
    'Tone',
    'Prevent + Correct',
    'Moisturize',
    'Protect',
  ];

  // Group products into rows of 2
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push(products.slice(i, i + 2));
  }

  const renderProduct = (product: Product, index: number) => {
    const stepLabel = product.stepLabel?.value || defaultSteps[index] || 'Step';

    return (
      <div
        key={product.id}
        className="relative flex-shrink-0 w-[50%] mx-auto flex justify-center items-center"
      >
        <div className="flex flex-col text-left items-start gap-3 justify-between">
          {product.featuredImage && (
            <div className="group relative bg-[#F6F6F6] w-full">
              <a href={`/products/${product.handle}`}>
                <Image
                  data={product.featuredImage}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-[300px] object-cover mb-6 transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            </div>
          )}
          {/* Step Label */}
          <p className="text-lg font-normal mb-2">
            Step {index + 1} {stepLabel}
          </p>

          <h3 className="font-poppins text-xl font-bold text-[#2B8C57]">
            {product.title}
          </h3>

          <div className="text-sm text-gray-600">
            {product.description?.slice(0, 100)}...
          </div>

          <p className="text-sm capitalize">{product.tags?.join(' · ')}</p>

          <a
            href={`/products/${product.handle}`}
            className="w-full border border-[#2B8C57] uppercase bg-white px-12 py-2 text-[#2B8C57] hover:text-white hover:bg-[#2B8C57] !text-xs md:!text-sm text-center block"
          >
            Shop Now
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="bundle-regimen py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 gap-3 flex flex-col items-center">
          <h2 className="!text-3xl font-bold mb-2">Step by Step</h2>
          <p className="text-lg text-gray-600">Recommended Regimen</p>
        </div>

        <div className="flex flex-col">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {row.map((product, colIndex) => {
                  const globalIndex = rowIndex * 2 + colIndex;
                  return renderProduct(product, globalIndex);
                })}
              </div>

              {/* Separator between rows (not after last row) */}
              <div className="w-full h-[1px] bg-[#E7E7E7] my-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
