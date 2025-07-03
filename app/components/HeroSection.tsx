// app/components/HeroSection.tsx

import { useEffect, useState } from 'react';

interface HeroSectionProps {
  images: {
    url: string;
    altText?: string;
  }[];
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
}

export function HeroSection({
  images,
  title,
  text,
  buttonText,
  buttonLink,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const backgroundImage = images[currentImageIndex]?.url;

  return (
    <div
      className="mt-[190px] relative w-full h-[600px] bg-cover bg-center flex items-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col gap-4 items-start p-8  max-w-xl">
        <h1 className="font-gayathri text-7xl text-[#2B8C57] !m-0">{title}</h1>
        <p className="text-lg mb-6">{text}</p>
        <a href={buttonLink}>
          <button className="inline-block bg-[#2B8C57] text-white px-6 py-3 font-light">
            {buttonText}
          </button>
        </a>
      </div>
    </div>
  );
}
