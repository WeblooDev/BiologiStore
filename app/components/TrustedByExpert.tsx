// app/components/HeroSection.tsx

interface TrustedByExpertSectionProps {
  image: {
    url: string;
    altText?: string;
  };
  title: string;
  text: string;
  buttonText?: string;
  buttonLink?: string;
  buttonText1?: string;
  buttonLink1?: string;
}

export function TrustedByExpertSection({
  image,
  title,
  text,
  buttonText,
  buttonText1,
  buttonLink,
  buttonLink1,
}: TrustedByExpertSectionProps) {
  return (
    <div
      className="relative w-full h-[600px] bg-cover bg-center  items-start flex flex-col p-8 gap-6 justify-center mt-16"
      style={{backgroundImage: `url(${image.url})`}}
    >
      <div className="flex flex-col gap-6 items-start ">
        <h1 className="text-4xl !m-0">{title}</h1>
        <p className="text-lg mb-6">{text}</p>
      </div>

      <div className="flex gap-8">
        <a
          href={buttonLink}
          className="inline-block bg-[#2B8C57] text-white px-6 py-2 uppercase text-sm"
        >
          {buttonText}
        </a>

        <a
          href={buttonLink1}
          className="inline-block bg-[#2B8C57] text-white px-6 py-2 uppercase text-sm"
        >
          {buttonText1}
        </a>
      </div>
    </div>
  );
}
