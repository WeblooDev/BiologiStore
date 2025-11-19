// app/components/HeroSection.tsx

interface HeroAboutSectionProps {
  image: {
    url: string;
    altText?: string;
  };
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
}

export function HeroAboutSection({image, title, text}: HeroAboutSectionProps) {
  return (
    <div
      className="mt-[100px] lg:mt-[190px] mb-16 relative w-full h-[600px] bg-cover bg-center flex items-center text-white md:text-black "
      style={{backgroundImage: `url(${image.url})`}}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="flex flex-col gap-6 items-start p-8 z-10">
        <h1 className="text-4xl !m-0">{title}</h1>
        <p className="text-lg mb-6">{text}</p>
      </div>
    </div>
  );
}
