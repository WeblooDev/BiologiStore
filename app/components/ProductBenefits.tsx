import {useState} from 'react';
import right from '~/assets/images/right-arrow.svg';
import left from '~/assets/images/left-arrow.svg';
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
    console.error('Invalid Benefits JSON', e);
    return null;
  }

  if (!benefits.length || !images?.length) return null;

  const [imageIndex, setImageIndex] = useState(0);

  const handleNext = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section>
      <div className="container mx-auto flex flex-col lg:flex-row gap-10 p-12">
        {/* Left: Carousel */}
        <div className="relative w-full lg:w-1/2">
          <div className="relative bg-[#F6F6F6] w-full h-[544px] overflow-hidden rounded">
            <div
              className="flex transition-transform duration-500 ease-in-out !w-full"
              style={{
                transform: `translateX(-${imageIndex * 100}%)`,
                width: `${images.length * 100}%`,
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.altText || `Product image ${idx + 1}`}
                  className="w-full flex-shrink-0 object-cover h-[544px]"
                />
              ))}
            </div>

            {/* Arrows */}
            {/* Arrows */}
            {imageIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 cursor-pointer "
              >
                <img src={left} alt="Previous" className="w-6 h-6" />
              </button>
            )}

            {imageIndex < images.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-6 transform -translate-y-1/2 z-10 cursor-pointer 0"
              >
                <img src={right} alt="Next" className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.altText || `Thumbnail ${i + 1}`}
                className={`w-20 h-20 object-cover !rounded-none cursor-pointer border ${
                  i === imageIndex
                    ? 'border-2 border-[#2B8C57]'
                    : 'border-transparent'
                }`}
                onClick={() => setImageIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* Right: Benefits */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-center mb-[80px] ">
          <h1 className="text-xl">Benefits</h1>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <img src={check} alt="Check icon" className="w-5 h-5 mt-1" />
                <p className="text-base text-gray-800">{benefit.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
