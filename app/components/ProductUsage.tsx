interface UsageBlock {
  title: string;
  subtitle?: string;
  description: string;
}

interface UsageImage {
  url: string;
  alt?: string | null;
}

export function ProductUsage({
  json,
  image,
}: {
  json: string;
  image?: UsageImage;
}) {
  let usageData: UsageBlock[] = [];

  try {
    usageData = JSON.parse(json);
  } catch (e) {
    console.error("Invalid usage JSON", e);
    return null;
  }

  if (!usageData.length) return null;

  // Group blocks by title
  const grouped: Record<string, UsageBlock[]> = {};
  usageData.forEach((block) => {
    if (!grouped[block.title]) {
      grouped[block.title] = [];
    }
    grouped[block.title].push(block);
  });

  return (
    <section className="container m-auto !py-16 !px-5">
        <div className="h-[2px] w-full bg-[#E7E7E7] mt-[2rem] mb-[60px]"></div>
      <h2 className="font-gayathri !text-2xl font-semibold mb-6">Usage</h2>

      <div className="flex flex-col lg:flex-row gap-10 justify-between w-full p5">
        {/* Left: Grouped usage blocks */}
        <div className="flex flex-col gap-4 w-full lg:w-[50%] ">
          {Object.entries(grouped).map(([title, blocks], index) => (
            <div key={index}>
              <h3 className=" text-lg underline ">{title}</h3>
              {blocks.map((block, i) => (
                <div key={i} className="mt-2">
                  {block.subtitle && (
                    <h4 className="font-gayathri text-base font-semibold text-[#2B8C57]">{block.subtitle}</h4>
                  )}
                  <p className="text-sm">{block.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: Usage image */}
        {image?.url && (
          <div className="w-full lg:w-[50%] flex items-center justify-center">
            <img
              src={image.url}
              alt={image.alt || 'Usage image'}
              className="object-cover h-auto max-h-[450px]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
