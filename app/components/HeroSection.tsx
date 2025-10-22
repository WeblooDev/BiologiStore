// app/components/HeroSection.tsx
import React from 'react';

interface HeroSectionProps {
  image: {url: string; altText?: string};
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
  if (!image?.url) return null;

  return (
    <div
      className="mt-[190px] relative w-full h-[600px] bg-cover bg-center flex items-center"
      style={{backgroundImage: `url(${image.url})`}}
      role="img"
      aria-label={image.altText ?? ''}
    >
      <div className="flex flex-col gap-6 items-start p-8 max-w-xl">
        <div className="flex flex-col">
          <h1 className="font-poppins !text-4xl text-[#2B8C57] !m-0">
            {title}
          </h1>
          <p className="text-lg">{text}</p>
        </div>
        <a href={buttonLink}>
          <button className="inline-block bg-[#2B8C57] text-white px-10 py-2 font-light !text-sm">
            {buttonText}
          </button>
        </a>
      </div>
    </div>
  );
}
