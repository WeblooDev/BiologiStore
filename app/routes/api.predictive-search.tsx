import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      products {
        ...PredictiveProduct
      }
    }
  }
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
` as const;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);

  if (!term) {
    return Response.json({
      result: {
        items: {
          products: [],
        },
        total: 0,
      },
    });
  }

  try {
    const {predictiveSearch: items, errors} = await storefront.query(
      PREDICTIVE_SEARCH_QUERY,
      {
        variables: {
          limit,
          limitScope: 'EACH',
          term,
          types: ['PRODUCT'],
        },
      },
    );

    if (errors) {
      console.error('Predictive search errors:', errors);
      return Response.json({
        result: {
          items: {
            products: [],
          },
          total: 0,
        },
        error: errors.map(({message}: any) => message).join(', '),
      });
    }

    const products = items?.products || [];

    return Response.json({
      result: {
        items: {
          products,
        },
        total: products.length,
      },
    });
  } catch (error) {
    console.error('Predictive search error:', error);
    return Response.json({
      result: {
        items: {
          products: [],
        },
        total: 0,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
