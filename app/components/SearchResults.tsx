import {Link} from 'react-router';
import {Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {ProductItem} from './ProductItem';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              prefetch="intent"
              to={articleUrl}
              key={article.id}
              className="group flex flex-col bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                {/* Placeholder for article image if available */}
                <div className="w-full h-full bg-gradient-to-br from-[#2B8C57]/10 to-[#2B8C57]/5 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-[#2B8C57]/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-900 group-hover:text-[#2B8C57] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-[#2B8C57] mt-2">Read article →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              prefetch="intent"
              to={pageUrl}
              key={page.id}
              className="group flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-[#2B8C57] hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#2B8C57]/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#2B8C57]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 group-hover:text-[#2B8C57] transition-colors truncate">
                  {page.title}
                </h3>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-[#2B8C57] transition-colors"
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          // Transform search product data to match ProductItem expected format
          const transformedProducts = nodes.map((product) => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            tags: product.tags || [],
            featuredImage: product.selectedOrFirstAvailableVariant?.image
              ? {
                  id: product.selectedOrFirstAvailableVariant.image.url,
                  url: product.selectedOrFirstAvailableVariant.image.url,
                  altText:
                    product.selectedOrFirstAvailableVariant.image.altText ||
                    product.title,
                  width: product.selectedOrFirstAvailableVariant.image.width,
                  height: product.selectedOrFirstAvailableVariant.image.height,
                }
              : null,
            priceRange: {
              minVariantPrice: product.selectedOrFirstAvailableVariant
                ?.price || {
                amount: '0',
                currencyCode: 'USD',
              },
            },
            variants: {
              nodes: [
                {
                  id: product.selectedOrFirstAvailableVariant?.id || '',
                  title:
                    product.selectedOrFirstAvailableVariant?.product?.title ||
                    product.title,
                },
              ],
            },
          }));

          return (
            <div>
              <div className="mb-4">
                <PreviousLink className="text-[#2B8C57] hover:underline">
                  {isLoading ? 'Loading...' : <span>← Load previous</span>}
                </PreviousLink>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {transformedProducts.map((product: any) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <NextLink className="inline-block px-6 py-3 bg-[#2B8C57] text-white rounded-lg hover:bg-[#237a48] transition-colors">
                  {isLoading ? 'Loading...' : <span>Load more</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No results found
      </h3>
      <p className="text-gray-600">
        Try a different search term or browse our collections.
      </p>
    </div>
  );
}
