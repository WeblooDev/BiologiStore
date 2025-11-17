import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ShopThePost} from '~/components/ShopThePost';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
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
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
      cache: context.storefront.CacheNone(),
    }),
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();

  if (!article) {
    return <div>Article not found</div>;
  }

  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  // Extract products from shopPosts metafield
  const products = article.shopPosts?.references?.nodes || [];

  return (
    <div className="article pt-[190px] w-[50%] m-auto">
      <div className="flex items-center gap-4 mb-6">
        <a className="!underline text-[#4F4F4F]" href="/blogs">
          Blogs
        </a>
        <span>/</span>
        <p className="text-[#4F4F4F]">{title}</p>
      </div>

      {image && (
        <Image
          data={image}
          sizes="90vw"
          loading="eager"
          className="w-full mb-6 !h-[370px] object-cover"
        />
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
        <p className="!text-base">{publishedDate}</p>
      </div>

      <h1 className="!text-4xl !m-0 mb-4">{title}</h1>

      {author?.name && (
        <p className="font-semibold !mt-2 !mb-10">By {author.name}</p>
      )}

      <div
        dangerouslySetInnerHTML={{__html: contentHtml}}
        className="article-content mb-12"
      />

      {products.length > 0 && <ShopThePost products={products} />}
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        tags
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
        shopPosts: metafield(namespace: "custom", key: "shopposts") {
          references(first: 10) {
            nodes {
              ... on Product {
                id
                handle
                title
                tags
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
                variants(first: 1) {
                  nodes {
                    id
                    title
                  }
                }
                descriptionHtml
              }
            }
          }
        }
      }
    }
  }
` as const;
