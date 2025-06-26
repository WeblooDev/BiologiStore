import { useState } from 'react';
import check from '~/assets/images/check.svg';


interface Benefit {
  description: string;
}

interface ProductImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export function ProductBenefits({
  json,
  images,
}: {
  json: string;
  images: ProductImage[];
}) {
  let benefits: Benefit[] = [];

  try {
    benefits = JSON.parse(json);
  } catch (e) {
    console.error("Invalid Benefits JSON", e);
    return null;
  }

  if (!benefits.length) return null;

  const [main, ...rest] = images || [];
  const [hoverImage, setHoverImage] = useState<ProductImage | null>(null);

  const displayedImage = hoverImage || main;

  return (
    <section className="">

      <div className="container mx-auto grid grid-cols-2 gap-10 p-12">
        {/* Left: Product images */}
        <div>
          {displayedImage && (
            <img
              src={displayedImage.url}
              alt={displayedImage.altText || 'Product image'}
              className="w-full h-[544px] object-cover rounded transition duration-300"
            />
          )}
          <div className="flex gap-2 mt-2">
            {rest.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.altText || `Gallery ${i + 1}`}
                className="w-20 h-20 object-cover "
                onMouseEnter={() => setHoverImage(img)}
                onMouseLeave={() => setHoverImage(null)}
              />
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-6 justify-center mb-[80px]'>
          <h1 className='text-xl'>Benefits</h1>
          <ul className="grid grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <img
                  src={check}
                  alt="Benefit icon"
                  className="w-5 h-5 mt-1"
                />
                <p className="text-base text-gray-800">{benefit.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
