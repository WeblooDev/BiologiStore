import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {Suspense, useState, useMemo} from 'react';
import {BestSellers} from '~/components/BestSellers';
import {AllCollections} from '~/components/AllCollections';
import {ProductFilter, type FilterState} from '~/components/ProductFilter';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}, {collections}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
    storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  // Count skin types, categories, concerns, and ingredients
  const skinTypeSet = new Set<string>();
  const skinTypeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const skinConcernSet = new Set<string>();
  const skinConcernCounts: Record<string, number> = {};
  const ingredientSet = new Set<string>();
  const ingredientsCounts: Record<string, number> = {};

  collection.products.nodes.forEach((product) => {
    // Count categories (productType)
    const category = product.productType?.trim();
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    // Count skin types, concerns, and ingredients from variant options
    product.variants?.nodes?.forEach((variant) => {
      variant.selectedOptions?.forEach((opt) => {
        const optName = opt.name.toLowerCase().replace(/\s+/g, '');
        const value = opt.value.trim();

        if (optName === 'suitableforskintype') {
          skinTypeSet.add(value);
          skinTypeCounts[value] = (skinTypeCounts[value] || 0) + 1;
        } else if (optName === 'skinconcern') {
          skinConcernSet.add(value);
          skinConcernCounts[value] = (skinConcernCounts[value] || 0) + 1;
        } else if (optName === 'ingredient') {
          ingredientSet.add(value);
          ingredientsCounts[value] = (ingredientsCounts[value] || 0) + 1;
        }
      });
    });
  });

  const skinTypes = Array.from(skinTypeSet);
  const skinConcerns = Array.from(skinConcernSet);
  const ingredients = Array.from(ingredientSet);

  return {
    collection,
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

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
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
    return data.collection.products.nodes
      .filter((product: any) => {
        const {category, skinType, skinConcern, ingredient, price} = filters;

        const normalize = (str: string | undefined) =>
          str?.trim().toLowerCase().replace(/\\s+/g, '');

        const categoryMatch =
          !category || normalize(product.productType) === normalize(category);

        const skinTypeMatch =
          !skinType ||
          product.variants.nodes.some((variant) =>
            variant.selectedOptions.some(
              (opt) =>
                normalize(opt.name) === 'suitableforskintype' &&
                normalize(opt.value) === skinType,
            ),
          );

        const skinConcernMatch =
          !skinConcern ||
          product.variants.nodes.some((variant: any) =>
            variant.selectedOptions.some(
              (opt: any) =>
                normalize(opt.name) === 'skinconcern' &&
                normalize(opt.value) === skinConcern,
            ),
          );

        const ingredientMatch =
          !ingredient ||
          product.variants.nodes.some((variant: any) =>
            variant.selectedOptions.some(
              (opt: any) =>
                normalize(opt.name) === 'ingredient' &&
                normalize(opt.value) === ingredient,
            ),
          );

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
  }, [data.collection.products.nodes, filters]);

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
      <div className="container m-auto collection mt-32 pt-8">
        <AllCollections collections={data.allCollections} />

        <ProductFilter
          filters={filters}
          onFilterChange={setFilters}
          categories={data.allCollections.nodes}
          skinTypes={data.skinTypes}
          skinTypeCounts={data.skinTypeCounts}
          categoryCounts={data.categoryCounts}
          skinConcerns={data.skinConcerns}
          skinConcernCounts={data.skinConcernCounts}
          ingredients={data.ingredients}
          ingredientsCounts={data.ingredientsCounts}
        />

        {/* Product Grid */}
        <div className="container products-grid grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
          {filteredProducts
            .slice(0, visibleCount)
            .map((product: any, index: any) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < BATCH_SIZE ? 'eager' : undefined}
              />
            ))}
        </div>

        {/* Viewed Count */}
        <p className="text-center text-sm text-gray-600 !my-6">
          You've viewed <span className="font-semibold">{visibleCount}</span> of{' '}
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
              className="bg-white border border-[#2B8C57] text-[#2B8C57] px-6 py-3 uppercase text-sm hover:bg-[#2B8C57] hover:text-white transition cursor-pointer"
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
      <Analytics.CollectionView
        data={{
          collection: {
            id: data.collection.id,
            handle: data.collection.handle,
          },
        }}
      />
    </>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    descriptionHtml
    productType
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    metafield(namespace: "custom", key: "new") {
      value
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
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
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
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

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProductCollection on Product {
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
  query RecommendedProductsCollection ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProductCollection
      }
    }
  }
` as const;
