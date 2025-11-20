import {useRef} from 'react';
import {useLocalePath} from '~/lib/useLocale';

interface AllCollectionsProps {
  collections: {
    nodes: {
      id: string;
      title: string;
      handle: string;
      image?: {
        url: string;
        altText?: string | null;
      } | null;
    }[];
  };
}

export function AllCollections({collections}: AllCollectionsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getLocalePath = useLocalePath();

  if (!collections || collections.nodes.length === 0) return null;

  // Define the desired order
  const categoryOrder = [
    'Moisturizers',
    'Cleansers',
    'Serums',
    'Exfoliation',
    'Sunblock',
    'Tonics',
    'EyeCreams',
  ];

  // Sort collections based on the defined order
  const sortedCollections = [...collections.nodes].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.title);
    const indexB = categoryOrder.indexOf(b.title);

    // If both are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A is in the order array, it comes first
    if (indexA !== -1) return -1;
    // If only B is in the order array, it comes first
    if (indexB !== -1) return 1;
    // If neither is in the order array, maintain original order
    return 0;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="container mx-auto my-12 px-4">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h2 className="font-poppins text-2xl! font-bold!">Shop By Category</h2>

        {/* Desktop: Grid Layout */}
        <ul className="hidden lg:flex flex-wrap gap-6 justify-center">
          {sortedCollections.map((collection) => (
            <li key={collection.id} className="w-[170px] max-w-[194px]">
              <a
                href={getLocalePath(
                  `/collections/all?category=${encodeURIComponent(collection.title)}`,
                )}
                className="no-underline! group block"
              >
                <div className="transition-colors duration-300 group-hover:bg-[#2B8C57]">
                  <img
                    src={collection.image?.url || '/placeholder.png'}
                    alt={collection.image?.altText || collection.title}
                    className="aspect-square w-full object-cover !rounded-none"
                  />
                  <div className="py-2 border border-[#2B8C57]">
                    <p className="font-poppins uppercase text-center p-2 text-[#2B8C57] transition-colors duration-300 group-hover:text-white">
                      {collection.title}
                    </p>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile & Tablet: Slider */}
        <div className="lg:hidden w-full relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Scroll left"
          >
            <svg
              className="w-6 h-6 text-[#2B8C57]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-8"
            style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          >
            {sortedCollections.map((collection) => (
              <div
                key={collection.id}
                className="flex-shrink-0 w-[150px] snap-center"
              >
                <a
                  href={getLocalePath(
                    `/collections/all?category=${encodeURIComponent(collection.title)}`,
                  )}
                  className="!no-underline group block"
                >
                  <div className="transition-colors duration-300 group-hover:bg-[#2B8C57]">
                    <img
                      src={collection.image?.url || '/placeholder.png'}
                      alt={collection.image?.altText || collection.title}
                      className="w-full h-[194px] object-cover !rounded-none"
                    />
                    <div className="py-2 border border-[#2B8C57]">
                      <p className="font-poppins uppercase text-center p-2 text-[#2B8C57] transition-colors duration-300 group-hover:text-white text-sm">
                        {collection.title}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Scroll right"
          >
            <svg
              className="w-6 h-6 text-[#2B8C57]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
