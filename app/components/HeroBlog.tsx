// app/components/HeroSection.tsx

interface HeroBlogSectionProps {
  image: {
    url: string;
    altText?: string;
  };
}

export function HeroBlogSection({image}: HeroBlogSectionProps) {
  return (
    <div
      className="relative w-full h-[250px] bg-cover bg-center flex items-center mb-8"
      style={{backgroundImage: `url(${image.url})`}}
    >
      <div className="flex flex-col gap-6 items-start p-8"></div>
    </div>
  );
}
