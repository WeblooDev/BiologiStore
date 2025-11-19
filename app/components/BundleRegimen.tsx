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

interface RegimenStep {
  stepNumber: number;
  stepTitle: string;
  timeOfDay?: string;
  description: string;
  details: string[];
}

interface BundleRegimenProps {
  products: Product[];
  regimenData?: {
    value?: string;
  } | null;
}

export function BundleRegimen({products, regimenData}: BundleRegimenProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Parse regimen data from metafield
  let regimenSteps: RegimenStep[] = [];
  if (regimenData?.value) {
    try {
      const parsed = JSON.parse(regimenData.value);
      regimenSteps = parsed.steps || [];
    } catch (e) {
      console.error('Failed to parse regimen data:', e);
    }
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

  // If we have regimen data, use it; otherwise fall back to products
  const useRegimenData = regimenSteps.length > 0;

  // Group regimen steps by step number (for AM/PM variants)
  const groupedSteps: RegimenStep[][] = [];
  if (useRegimenData) {
    const stepGroups = new Map<number, RegimenStep[]>();
    regimenSteps.forEach((step) => {
      if (!stepGroups.has(step.stepNumber)) {
        stepGroups.set(step.stepNumber, []);
      }
      stepGroups.get(step.stepNumber)!.push(step);
    });
    stepGroups.forEach((group) => groupedSteps.push(group));
  }

  // Group products into rows of 2 (fallback)
  const rows: Product[][] = [];
  if (!useRegimenData) {
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2));
    }
  }

  const renderRegimenStep = (steps: RegimenStep[], stepIndex: number) => {
    // If there are multiple steps (AM/PM variants), render them side by side
    return steps.map((step, variantIndex) => {
      // Match product by step number (stepNumber - 1 for 0-based index)
      const productIndex = step.stepNumber - 1;
      const product = products[productIndex];

      return (
        <div
          key={`step-${stepIndex}-${variantIndex}`}
          className="w-[320px] mx-auto"
        >
          <div className="flex flex-col text-left items-start gap-3 no-underline">
            {product?.featuredImage && (
              <div className="group relative bg-[#F6F6F6] w-full aspect-[1/1.5] flex items-center justify-center overflow-hidden">
                <a
                  href={`/products/${product.handle}`}
                  className="w-full h-full flex items-center justify-center no-underline"
                >
                  <Image
                    data={product.featuredImage}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </a>
              </div>
            )}

            {/* Step Label with Time of Day */}
            <p className="text-lg font-normal mb-2 no-underline">
              Step {step.stepNumber}
              {step.timeOfDay && `(${step.timeOfDay})`}: {step.stepTitle}
            </p>

            <h3 className="font-poppins text-xl font-bold text-[#2B8C57] no-underline">
              {product?.title}
            </h3>

            <div className="text-sm text-gray-600 no-underline">
              {step.description}
            </div>

            {/* Details with bullet separators */}
            <p className="text-sm text-gray-600 flex items-center gap-2 flex-wrap no-underline">
              {step.details.map((detail, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {detail}
                  {idx < step.details.length - 1 && (
                    <span className="text-gray-400">•</span>
                  )}
                </span>
              ))}
            </p>

            {product && (
              <a
                href={`/products/${product.handle}`}
                className="w-full border border-[#2B8C57] uppercase bg-white px-12 py-2 text-[#2B8C57] hover:text-white hover:bg-[#2B8C57] !text-xs md:!text-sm text-center block no-underline"
              >
                Shop Now
              </a>
            )}
          </div>
        </div>
      );
    });
  };

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
            Step {index + 1}: {stepLabel}
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

        {useRegimenData ? (
          // Render from regimen metafield data
          <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groupedSteps.map((stepGroup, index) => (
                <div key={`step-group-${index}`}>
                  <div>{renderRegimenStep(stepGroup, index)}</div>
                  <div className="w-full h-px bg-[#E7E7E7] my-16" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Fallback to product-based rendering
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
                {rowIndex < rows.length - 1 && (
                  <div className="w-full h-[1px] bg-[#E7E7E7] my-16" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
