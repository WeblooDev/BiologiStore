// app/components/HeroSection.tsx

import {Image} from '@shopify/hydrogen';

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
    <section className="p-6">
      <div
        className="container m-auto relative  p-16 bg-cover bg-center flex items-center justify-center "
        style={{backgroundImage: `url(${image.url})`}}
      >
        <div className="flex flex-col gap-3 items-center p-3 ">
          <h1 className="font-poppins !text-2xl !m-0">{title}</h1>
          <p className="text-lg !mb-8 text-center">{text}</p>
          <button className="inline-block bg-[#2B8C57] text-white px-8 py-2 uppercase text-sm cursor-pointer border border-transparent transition-all duration-300 hover:bg-white hover:text-[#2B8C57] hover:border-[#2B8C57]">
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
