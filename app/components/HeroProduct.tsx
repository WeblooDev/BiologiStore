interface HeroProductSectionProps {
  image: {
    url: string;
    altText?: string;
  };
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export function HeroProductSection({
  image,
  title,
  links,
}: HeroProductSectionProps) {
  return (
    <div
      className="relative w-full h-[500px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${image.url})` }}
    >
      <div className="flex flex-col gap-6 items-start p-12">
        <h1 className="text-4xl !m-0">{title}</h1>
        <div className="flex gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="!underline "
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
