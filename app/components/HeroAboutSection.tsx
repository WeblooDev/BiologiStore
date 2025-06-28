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

export function HeroAboutSection({
  image,
  title,
  text,
}: HeroAboutSectionProps) {
  return (
    <div
      className="mt-[190px] relative w-full h-[600px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${image.url})` }}
    >
      <div className="flex flex-col gap-6 items-start p-8">
        <h1 className="text-4xl !m-0">{title}</h1>
        <p className="text-lg mb-6">{text}</p>
       
      </div>
    </div>
  );
}
