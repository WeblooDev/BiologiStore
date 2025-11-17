import {useState} from 'react';

interface UsageBlock {
  title: string;
  subtitle?: string;
  description: string;
  allIngredients?: string;
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
  const [showIngredients, setShowIngredients] = useState(false);
  let usageData: UsageBlock[] = [];

  try {
    usageData = JSON.parse(json);
  } catch (e) {
    console.error('Invalid usage JSON', e);
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

  // Extract "All Ingredients" section
  const allIngredientsBlocks = grouped['All Ingredients'];
  const allIngredients = allIngredientsBlocks?.[0]?.description;

  // Remove "All Ingredients" from grouped to display separately
  const {['All Ingredients']: _, ...regularGrouped} = grouped;

  return (
    <section className="container m-auto !py-16 !px-5">
      <div className="h-[1px] w-full bg-[#E7E7E7] mt-[2rem] mb-[60px]"></div>
      <h2 className="font-poppins !text-2xl font-semibold mb-6">Usage</h2>

      <div className="flex flex-col lg:flex-row gap-10 justify-between w-full mt-6">
        {/* Left: Grouped usage blocks */}
        <div className="flex flex-col gap-4 w-full lg:w-[50%] ">
          {Object.entries(regularGrouped).map(([title, blocks], index) => (
            <div key={index}>
              <h3 className="text-base font-medium">{title}</h3>
              {blocks.map((block, i) => (
                <div key={i} className="mt-2">
                  {block.subtitle && (
                    <h4 className="font-poppins text-base font-semibold text-[#2B8C57]">
                      {block.subtitle}
                    </h4>
                  )}
                  <p className="text-sm">{block.description}</p>
                </div>
              ))}
            </div>
          ))}

          {allIngredients && (
            <div className="mt-6">
              {showIngredients && (
                <div
                  className={
                    'flex flex-col gap-2 transition-all duration-300 ' +
                    (showIngredients ? 'h-auto' : 'h-0')
                  }
                >
                  <h4 className="font-poppins text-base font-semibold text-[#2B8C57]">
                    All Ingredients
                  </h4>
                  <p className="text-sm mt-3 text-[#4F4F4F]">
                    {allIngredients}
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowIngredients(!showIngredients)}
                className="text-sm cursor-pointer text-[#2B8C57] border border-[#2B8C57] hover:bg-[#2B8C57] hover:text-white p-2 uppercase transition-all mt-5"
              >
                {showIngredients ? 'Hide ingredients' : 'See all ingredients'}
              </button>
            </div>
          )}
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
