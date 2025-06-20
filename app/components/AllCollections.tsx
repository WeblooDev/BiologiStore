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

export function AllCollections({ collections }: AllCollectionsProps) {
  if (!collections || collections.nodes.length === 0) return null;

  return (
    <section className="container m-auto my-12">
      <div className="flex flex-col gap-6 justify-center items-center">
        <h2 className="!text-4xl mb-4">Shop by Collection</h2>
        <ul className="flex flex-wrap gap-6 justify-center">
          {collections.nodes.map((collection) => (
            <li key={collection.id} className="w-[150px] max-w-[194px]">
              <a href={`/collections/${collection.handle}`}>
                <img
                  src={collection.image?.url || '/placeholder.png'}
                  alt={collection.image?.altText || collection.title}
                  className="w-full h-[194px] object-cover !rounded-none"
                />
                <div className="border border-[#2B8C57] p-4">
                  <p className="text-center p-2 text-[#2B8C57] hover:underline">
                    {collection.title}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
