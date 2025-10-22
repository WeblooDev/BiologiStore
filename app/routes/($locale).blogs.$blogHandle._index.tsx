import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {Image, Money, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {HeroBlogSection} from '~/components/HeroBlog';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.blog.title ?? ''} blog`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="blog">
      <div className="flex items-center gap-4 p-6">
        <a className="!underline text-[#4F4F4F]" href="/blogs">
          Blogs
        </a>
        <span>/</span>
        <p className="text-[#4F4F4F]">{blog.title}</p>
      </div>
      <div className="blog-grid">
        <PaginatedResourceSection connection={articles}>
          {({node: article, index}) => (
            <ArticleItem
              article={article}
              key={article.id}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));

  return (
    <div className="blog-article w-[50%] m-auto" key={article.id}>
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        {article.image && (
          <div className="blog-article-image">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="!h-[370px] object-cover mb-6"
            />
          </div>
        )}
        <div className="flex items-center gap-4 mb-6">
          {article.tags?.length > 0 && (
            <div>
              {article.tags.slice(0, 3).map((tag) => (
                <p className="!underline !text-base" key={tag}>
                  {tag}
                </p>
              ))}
            </div>
          )}
          <span>|</span>
          <p className="!text-base">{publishedAt}</p>
        </div>
      </Link>

      <h1 className="!text-4xl !m-0">{article.title}</h1>
      <p className="font-semibold !mt-2 !mb-10">By BiologiMd® Skin Health</p>

      <div
        className="mt-4 "
        dangerouslySetInnerHTML={{__html: article.contentHtml}}
      />

      {/* Linked Products via shopPosts metafield */}
      {article.shopPosts?.referenceList?.nodes?.length > 0 && (
        <div className="mt-16">
          <div className="flex justify-center ">
            <h2 className="text-2xl font-semibold mb-4">Shop The Post</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.shopPosts.referenceList.nodes.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 justify-between items-center"
              >
                <Link to={`/products/${product.handle}`}>
                  {product.featuredImage && (
                    <Image
                      data={product.featuredImage}
                      alt={product.title}
                      className="mb-3 h-[270px] object-cover w-full"
                    />
                  )}
                  <h3 className="text-[#2B8C57] font-semibold mb-2 text-center">
                    {product.title}
                  </h3>
                </Link>

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}

                <p className="text-gray-900 font-medium mb-3">
                  ${product.priceRange.minVariantPrice.amount}{' '}
                </p>

                <form method="post" action="/cart/add">
                  <input
                    type="hidden"
                    name="id"
                    value={product.variants.nodes[0]?.id}
                  />
                  <button
                    type="submit"
                    className=" text-[#2B8C57] px-4 py-2 border !border-[#2B8C57]"
                  >
                    Add to Bag
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// GraphQL Query
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
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

  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
    tags
    shopPosts: metafield(namespace: "custom", key: "shopPosts") {
      referenceList: references(first: 3) {
        nodes {
          ... on Product {
            id
            title
            handle
            tags
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              nodes {
                id
              }
            }
          }
        }
      }
    }
  }
` as const;
