interface ImageTextSectionProps {
  image: {
    url: string;
    altText?: string;
  };
  content: Array<{
    title: string;
    description: string;
  }>;
  buttonText?: string;
  buttonLink?: string;
  reverse?: boolean; // ✅ New optional prop
}

export function ImageTextSection({
  image,
  content,
  buttonText,
  buttonLink,
  reverse = false, // ✅ Default to false
}: ImageTextSectionProps) {
  return (
    <section
      className={`container m-auto flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-center gap-10 px-6 md:px-16 py-12`}
    >
      <div className="flex-shrink-0 w-full md:w-1/2">
        <img
          src={image.url}
          alt={image.altText || 'Section image'}
          className="w-full h-auto !rounded-none"
        />
      </div>

      <div className="w-full md:w-1/2 text-left space-y-6">
        {content.map((item, index) => (
          <div key={index} className="w-[70%]">
            <h2 className="text-2xl text-[#2B8C57] mb-2">{item.title}</h2>
            <p className="text-base">{item.description}</p>
          </div>
        ))}

        {buttonText && buttonLink && (
          <a
            href={buttonLink}
            className="inline-block mt-4 px-6 py-3 bg-[#2B8C57] !text-white hover:bg-gray-800 transition"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
