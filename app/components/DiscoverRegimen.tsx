// app/components/HeroSection.tsx

import { Image } from '@shopify/hydrogen';

interface DiscoverRegimenSectionProps {
  image: {
    url: string;
    altText?: string;
  };
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export function DiscoverRegimenSection({
  image,
  title,
  text,
  buttonText,
  buttonLink,
}: DiscoverRegimenSectionProps) {
  return (

    <section className='p-6'>
    <div
      className="container m-auto relative w-full p-12 bg-cover bg-center flex items-center justify-center "
      style={{ backgroundImage: `url(${image.url})` }}
    >
      <div className="flex flex-col gap-6 items-center p-8 ">
        <h1 className="text-4xl  !m-0">{title}</h1>
        <p className="text-lg !mb-12">{text}</p>
        <button
          className="inline-block bg-[#2B8C57] text-white px-6 py-3 uppercase ">
          {buttonText}
        </button>
      </div>
    </div>
    </section>
  );
}
