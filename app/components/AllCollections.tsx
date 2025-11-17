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
  if (!collections || collections.nodes.length === 0) return null;

  return (
    <section className="container mx-auto my-12">
      <div className="flex flex-col gap-8 justify-center items-center">
        <h2 className="font-poppins !text-2xl !font-bold">Shop By Category</h2>
        <ul className="flex flex-wrap gap-6 justify-center">
          {collections.nodes.map((collection) => (
            <li key={collection.id} className="w-[150px] max-w-[194px]">
              <a
                href={`/collections/all?category=${encodeURIComponent(collection.title)}`}
                className="!no-underline group block"
              >
                <div className=" transition-colors duration-300 group-hover:bg-[#2B8C57]">
                  <img
                    src={collection.image?.url || '/placeholder.png'}
                    alt={collection.image?.altText || collection.title}
                    className="w-full h-[194px] object-cover !rounded-none"
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
      </div>
    </section>
  );
}
