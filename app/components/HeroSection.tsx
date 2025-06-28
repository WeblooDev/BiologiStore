// app/components/HeroSection.tsx

import { Image } from '@shopify/hydrogen';

interface HeroSectionProps {
  image: {
    url: string;
    altText?: string;
  };
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export function HeroSection({
  image,
  title,
  text,
  buttonText,
  buttonLink,
}: HeroSectionProps) {
  return (
    <div
      className="mt-[190px] relative w-full h-[600px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${image.url})` }}
    >
      <div className="flex flex-col gap-6 items-start p-8">
        <h1 className="text-4xl text-[#2B8C57] !m-0">{title}</h1>
        <p className="text-lg mb-6">{text}</p>
        <button
          className="inline-block bg-[#2B8C57] text-white px-6 py-3 ">
          {buttonText}
        </button>
      </div>
    </div>
  );
}
