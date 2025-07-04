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
  const paginationVariables = getPaginationVariables(request, {pageBy: 8});

  const [{products}, {collections}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  // 🧠 Count skin types and categories
  const skinTypeSet = new Set<string>();
  const skinTypeCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  products.nodes.forEach((product) => {
    // Count categories (productType)
    const category = product.productType?.trim();
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    // Count skin types from variant options
    product.variants?.nodes?.forEach((variant) => {
      variant.selectedOptions?.forEach((opt) => {
        if (opt.name.toLowerCase() === 'suitable for skin type') {
          const value = opt.value.trim();
          skinTypeSet.add(value);
          skinTypeCounts[value] = (skinTypeCounts[value] || 0) + 1;
        }
      });
    });
  });

  const skinTypes = Array.from(skinTypeSet);

  return {
    products,
    allCollections: collections,
    skinTypes,
    skinTypeCounts,
    categoryCounts,
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
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  return {
    category: params.get('category') || '',
    skinType: params.get('skinType') || '',
    sort: params.get('sort') || 'RELEVANCE',
    price: params.get('price') || '',
  };
};

const [filters, setFilters] = useState<FilterState>(getInitialFilter);


 const filteredProducts = useMemo(() => {
  return data.products.nodes
   .filter((product) => {
  const {category, skinType, price} = filters;

  const normalize = (str: string | undefined) =>
    str?.trim().toLowerCase().replace(/\s+/g, '');

  const categoryMatch =
    !category || normalize(product.productType) === normalize(category);

  const skinTypeMatch =
    !skinType ||
    product.variants.nodes.some((variant) =>
      variant.selectedOptions.some(
        (opt) =>
          normalize(opt.name) === 'suitableforskintype' &&
          normalize(opt.value) === skinType
      )
    );

  const priceAmount = parseFloat(product.priceRange.minVariantPrice.amount);
  const priceMatch = !price
    ? true
    : (() => {
        const [min, max] = price.split('-').map(Number);
        return priceAmount >= min && priceAmount <= max;
      })();

  return skinTypeMatch && categoryMatch && priceMatch;
})

  .sort((a, b) => {
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


  return (
    <>
      <HeroProductSection
        image={{url: productHero, altText: 'Welcome to our store'}}
        title="Shop All"
        links={[
          {label: 'Shop Medical Grade Skin Care', href: '/collections/cleansers'},
          {label: 'Shop Bundles', href: '/collections/moisturizers'},
          {label: 'Shop Best Sellers', href: '/collections/treatments'},
        ]}
      />

      <div className="container m-auto collection">
        <AllCollections collections={data.allCollections} />

      <ProductFilter
        filters={filters}
        onFilterChange={setFilters}
        categories={data.allCollections.nodes}
        skinTypes={data.skinTypes}
        skinTypeCounts={data.skinTypeCounts}
        categoryCounts={data.categoryCounts}
      />



        <div className="container products-grid grid grid-cols-2 md:grid-cols-4 gap-8 ">
          {filteredProducts.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          ))}
        </div>

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
      ...MoneyCollectionItem
    }
    maxVariantPrice {
      ...MoneyCollectionItem
    }
  }
  variants(first: 10) {
    nodes {
      selectedOptions {
        name
        value
      }
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
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
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
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
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

  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;


