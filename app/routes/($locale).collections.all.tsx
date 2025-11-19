import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {Suspense, useState, useMemo} from 'react';
import {HeroProductSection} from '~/components/HeroProduct';
import {BestSellers} from '~/components/BestSellers';
import {AllCollections} from '~/components/AllCollections';
import {ProductFilter, type FilterState} from '~/components/ProductFilter';
import productHero from '~/assets/images/producthero.png';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Hydrogen | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  const paginationVariables = getPaginationVariables(request, {pageBy: 24}); // 24/48/96 as you like

  const [{products}, {collections}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        ...(tag && {query: `tag:${tag}`}),
      },
    }),
    storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  // 🧠 Count skin types, categories, skin concerns, and ingredients
  const skinTypeSet = new Set<string>();
  const skinTypeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const skinConcernSet = new Set<string>();
  const skinConcernCounts: Record<string, number> = {};
  const ingredientSet = new Set<string>();
  const ingredientsCounts: Record<string, number> = {};

  products.nodes.forEach((product: any) => {
    // Count categories (from collections/productType)
    const category = product.productType?.trim();
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    // Count skin types from metafield (JSON array)
    if (product.skinType?.value) {
      try {
        const types = JSON.parse(product.skinType.value);
        types.forEach((type: string) => {
          if (type) {
            skinTypeSet.add(type);
            skinTypeCounts[type] = (skinTypeCounts[type] || 0) + 1;
          }
        });
      } catch (e) {
        // Fallback to comma-separated
        const types = product.skinType.value
          .split(',')
          .map((t: string) => t.trim());
        types.forEach((type: string) => {
          if (type) {
            skinTypeSet.add(type);
            skinTypeCounts[type] = (skinTypeCounts[type] || 0) + 1;
          }
        });
      }
    }

    // Count skin concerns from metafield (JSON array)
    if (product.skinConcern?.value) {
      try {
        const concerns = JSON.parse(product.skinConcern.value);
        concerns.forEach((concern: string) => {
          if (concern) {
            skinConcernSet.add(concern);
            skinConcernCounts[concern] = (skinConcernCounts[concern] || 0) + 1;
          }
        });
      } catch (e) {
        // Fallback to comma-separated
        const concerns = product.skinConcern.value
          .split(',')
          .map((c: string) => c.trim());
        concerns.forEach((concern: string) => {
          if (concern) {
            skinConcernSet.add(concern);
            skinConcernCounts[concern] = (skinConcernCounts[concern] || 0) + 1;
          }
        });
      }
    }

    // Count ingredients from metafield (JSON array)
    if (product.ingredient?.value) {
      try {
        const ingredients = JSON.parse(product.ingredient.value);
        ingredients.forEach((ingredient: string) => {
          if (ingredient) {
            ingredientSet.add(ingredient);
            ingredientsCounts[ingredient] =
              (ingredientsCounts[ingredient] || 0) + 1;
          }
        });
      } catch (e) {
        // Fallback to comma-separated
        const ingredients = product.ingredient.value
          .split(',')
          .map((i: string) => i.trim());
        ingredients.forEach((ingredient: string) => {
          if (ingredient) {
            ingredientSet.add(ingredient);
            ingredientsCounts[ingredient] =
              (ingredientsCounts[ingredient] || 0) + 1;
          }
        });
      }
    }
  });

  const skinTypes = Array.from(skinTypeSet);
  const skinConcerns = Array.from(skinConcernSet);
  const ingredients = Array.from(ingredientSet);

  return {
    products,
    allCollections: collections,
    skinTypes,
    skinTypeCounts,
    categoryCounts,
    skinConcerns,
    skinConcernCounts,
    ingredients,
    ingredientsCounts,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const productTypes = context.storefront
    .query(PRODUCT_TYPES_WITH_SAMPLE_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    productTypes,
  };
}

export default function Collection() {
  const data = useLoaderData<typeof loader>();

  const getInitialFilter = (): FilterState => {
    const params = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : '',
    );
    return {
      category: params.get('category') || '',
      skinType: params.get('skinType') || '',

      skinConcern: params.get('skinConcern') || '',
      ingredient: params.get('ingredient') || '',
      sort: params.get('sort') || 'RELEVANCE',
      price: params.get('price') || '',
    };
  };

  const [filters, setFilters] = useState<FilterState>(getInitialFilter);

  const filteredProducts = useMemo(() => {
    return data.products.nodes
      .filter((product: any) => {
        const {category, skinType, skinConcern, ingredient, price} = filters;

        // Normalize function: convert to lowercase and remove underscores, spaces, and special chars
        const normalizeValue = (val: string) =>
          val
            .toLowerCase()
            .replace(/[_\s&]/g, '')
            .trim();

        // Category filter now filters by collections
        const categoryMatch =
          !category ||
          (product.collections?.nodes?.some(
            (col: any) =>
              normalizeValue(col.title) === normalizeValue(category),
          ) ??
            false);

        const skinTypeMatch =
          !skinType ||
          (() => {
            if (!product.skinType?.value) return false;
            try {
              const types = JSON.parse(product.skinType.value);
              return types.some(
                (t: string) => normalizeValue(t) === normalizeValue(skinType),
              );
            } catch (e) {
              return normalizeValue(product.skinType.value).includes(
                normalizeValue(skinType),
              );
            }
          })();

        const skinConcernMatch =
          !skinConcern ||
          (() => {
            if (!product.skinConcern?.value) return false;
            try {
              const concerns = JSON.parse(product.skinConcern.value);
              return concerns.some(
                (c: string) =>
                  normalizeValue(c) === normalizeValue(skinConcern),
              );
            } catch (e) {
              return normalizeValue(product.skinConcern.value).includes(
                normalizeValue(skinConcern),
              );
            }
          })();

        const ingredientMatch =
          !ingredient ||
          (() => {
            if (!product.ingredient?.value) return false;
            try {
              const ingredients = JSON.parse(product.ingredient.value);
              return ingredients.some(
                (i: string) => normalizeValue(i) === normalizeValue(ingredient),
              );
            } catch (e) {
              return normalizeValue(product.ingredient.value).includes(
                normalizeValue(ingredient),
              );
            }
          })();

        const priceAmount = parseFloat(
          product.priceRange.minVariantPrice.amount,
        );
        const priceMatch = !price
          ? true
          : (() => {
              const [min, max] = price.split('-').map(Number);
              return priceAmount >= min && priceAmount <= max;
            })();

        return (
          skinTypeMatch &&
          categoryMatch &&
          skinConcernMatch &&
          ingredientMatch &&
          priceMatch
        );
      })

      .sort((a: any, b: any) => {
        if (filters.sort === 'PRICE_ASC') {
          return (
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
          );
        }
        if (filters.sort === 'PRICE_DESC') {
          return (
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
          );
        }
        if (filters.sort === 'UPDATED_AT') {
          const aIsNew = a.metafield?.value === 'true' ? 1 : 0;
          const bIsNew = b.metafield?.value === 'true' ? 1 : 0;
          return bIsNew - aIsNew;
        }
        return 0;
      });
  }, [data.products.nodes, filters]);

  const BATCH_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + BATCH_SIZE, filteredProducts.length),
    );
  };

  const progress = Math.min(
    (visibleCount / filteredProducts.length) * 100,
    100,
  );

  return (
    <>
      {/* <HeroProductSection
        image={{url: productHero, altText: 'Welcome to our store'}}
        title="Shop All"
        links={[
          {
            label: 'Shop Medical Grade Skin Care',
            href: '/collections/cleansers',
          },
          {label: 'Shop Bundles', href: '/collections/moisturizers'},
          {label: 'Shop Best Sellers', href: '/collections/treatments'},
        ]}
      /> */}

      <div className="container m-auto collection mt-32 pt-8">
        <AllCollections collections={data.allCollections} />

        <ProductFilter
          filters={filters}
          onFilterChange={setFilters}
          categories={data.allCollections.nodes}
          skinTypes={data.skinTypes}
          skinConcerns={data.skinConcerns}
          ingredients={data.ingredients}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="container mx-auto py-20 text-center">
            <p className="text-2xl text-gray-600 mb-4">No products found</p>
            <p className="text-gray-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <div className="container products-grid grid max-sm:!grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4">
            {filteredProducts
              .filter((product: any) => product?.bundle?.value !== 'true')
              .slice(0, visibleCount)
              .map((product: any, index: any) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < BATCH_SIZE ? 'eager' : undefined}
                />
              ))}
          </div>
        )}

        {/* Viewed Count */}
        <p className="text-center text-sm text-gray-600 !my-6">
          You’ve viewed <span className="font-semibold">{visibleCount}</span> of{' '}
          <span className="font-semibold">{filteredProducts.length}</span>{' '}
          products
        </p>

        {/* Progress Bar */}
        <div className="w-[30%] m-auto h-[2px] bg-gray-200 rounded overflow-hidden mt-2 mb-6">
          <div
            className="h-full bg-[#2B8C57] transition-all duration-300 ease-in-out"
            style={{width: `${progress}%`}}
          />
        </div>

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="bg-white border border-[#2B8C57] text-[#2B8C57] px-6 py-3 uppercase text-sm hover:bg-[#2B8C57] hover:text-white stransition cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}

        <Suspense fallback={<div>Loading Best Sellers...</div>}>
          <Await resolve={data.recommendedProducts}>
            {(response) => <BestSellers products={response} />}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment CollectionItem on Product {
    id
    handle
    title
    descriptionHtml  # ✅ Add this line
    productType
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    bundle: metafield(namespace: "custom", key: "bundle") {
      value
    }
    metafield(namespace: "custom", key: "new") {
      value
    }
    skinConcern: metafield(namespace: "custom", key: "concern") {
      value
    }
    ingredient: metafield(namespace: "custom", key: "ingredients") {
      value
    }
    skinType: metafield(namespace: "custom", key: "skintype") {
      value
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    variants(first: 10) {
      nodes {
        id
        title
        selectedOptions {
          name
          value
        }
      }
    }
    collections(first: 10) {
      nodes {
        id
        title
        handle
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
  ) @inContext(country: $country, language: $language) {
   products(
     first: $first
     last: $last
     before: $startCursor
     after: $endCursor
     sortKey: UPDATED_AT
     reverse: true
     query: $query
   ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

const ALL_COLLECTIONS_QUERY = `#graphql
  fragment CollectionFields on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }

  query AllCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 20, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...CollectionFields
      }
    }
  }
` as const;

const PRODUCT_TYPES_WITH_SAMPLE_PRODUCTS_QUERY = `#graphql
  query ProductTypesWithSampleProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    productTypes(first: 20) {
      edges {
        node
      }
    }
    products(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        title
        productType
        handle
        images(first: 2) {
          nodes {
            url
            altText
          }
        }
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProductAll on Product {
    id
    title
    handle
    descriptionHtml
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
      variants(first: 1) {
    nodes {
      title
    }
  }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    tags
  }
  query RecommendedProductsAll ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProductAll
      }
    }
  }
` as const;
