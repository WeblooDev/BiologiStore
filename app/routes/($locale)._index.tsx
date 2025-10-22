import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {HeroSection} from '~/components/HeroSection';
import {BestSellers} from '~/components/BestSellers';
import {DiscoverRegimenSection} from '~/components/DiscoverRegimen';
import {AllCollections} from '~/components/AllCollections';
import {PackProduct} from '~/components/PackProduct';
import heroImage from '~/assets/images/hero.png';
import homepage from '~/assets/images/homepage.webp';
import discoverImage from '~/assets/images/discover.png';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  return {
    allCollections: collections,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const latestBlogs = context.storefront
    .query(BLOGS_QUERY, {variables: {first: 4}})
    .catch((error) => {
      console.error(error);
      return null;
    });

  const packProduct = context.storefront
    .query(PRODUCT_WITH_PACK_TAG_QUERY, {
      variables: {tag: 'tag:Pack'},
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    latestBlogs,
    packProduct,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <HeroSection
        image={{url: heroImage, altText: 'Holiday Hero'}}
        title="Gentle Cleanser "
        text="This Gentle Foaming Cleanser Washes Away Impurities and Leaves the Skin Feeling Smooth and Refreshed"
        buttonText="ADD TO BAG"
        buttonLink="/collections"
      />

      <AllCollections collections={data.allCollections} />

      <Suspense fallback={<div>Loading Best Sellers...</div>}>
        <Await resolve={data.recommendedProducts}>
          {(response) => (
            <BestSellers title="Best Sellers" products={response} />
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading Featured Pack...</div>}>
        <Await resolve={data.packProduct}>
          {(res) => {
            const product = res?.products?.nodes?.[0];
            return <PackProduct product={product} />;
          }}
        </Await>
      </Suspense>

      <DiscoverRegimenSection
        image={{
          url: discoverImage,
          altText: 'Welcome to our store',
        }}
        title="Discover Your Regimen"
        text="Find the skincare products best suited for your skin health goals."
        buttonText="Discover My Regimen"
        buttonLink="/collections"
      />

      <Suspense fallback={<div>Loading Blogs...</div>}>
        <Await resolve={data.latestBlogs}>
          {(blogsData) => (
            <section className="container mx-auto px-4 py-12">
              <div className="flex justify-between gap-4 my-6 items-end px-4 ">
                <h2 className="font-poppins text-3xl font-bold !m-0">
                  The BiologiMD® Blogs
                </h2>
                <a
                  href="/blogs"
                  className="!no-underline inline-block bg-white border border-[#2B8C57] px-8 py-2 uppercase text-sm cursor-pointer transition-all duration-300 text-[#2B8C57] hover:bg-[#2B8C57] hover:!text-white hover:border-[#2B8C57]"
                >
                  View All
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 ">
                {blogsData?.blogs?.nodes.map((blog) => {
                  const article = blog.articles?.nodes?.[0];
                  return (
                    <div
                      key={blog.handle}
                      className="blog-card flex flex-col gap-2 justify-between"
                    >
                      <Link
                        to={`/blogs/${blog.handle}`}
                        prefetch="intent"
                        className="group overflow-hidden "
                      >
                        {article?.image?.url && (
                          <img
                            src={article.image.url}
                            alt={article.image.altText || article.title}
                            className="w-full h-[121px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-none"
                          />
                        )}
                      </Link>

                      <Link to={`/blogs/${blog.handle}`}>
                        <h3 className="font-poppins text-base !font-bold mt-6">
                          {article?.title}
                        </h3>
                      </Link>
                      {article?.excerpt && (
                        <p className="!text-[14px] line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}

                      <a
                        href={`/blogs/${blog.handle}`}
                        className="!underline mt-4 text-[14px]"
                      >
                        Read more
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

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
  fragment RecommendedProduct on Product {
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

const PRODUCT_WITH_PACK_TAG_QUERY = `#graphql
  fragment ProductWithTagFields on Product {
    id
    title
    handle
    tags
    featuredImage {
      id
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }

  query ProductsWithTag($tag: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 1, query: $tag) {
      nodes {
        ...ProductWithTagFields
      }
    }
  }
` as const;

const BLOGS_QUERY = `#graphql
  query Blogs($first: Int) {
    blogs(first: $first) {
      nodes {
        title
        handle
        seo {
          title
          description
        }
        articles(first: 1) {
          nodes {
            title
            handle
            tags
            excerpt
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
` as const;
