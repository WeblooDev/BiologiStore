import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {HeroSection} from '~/components/HeroSection';
import {BestSellers} from '~/components/BestSellers';
import {DiscoverRegimenSection} from '~/components/DiscoverRegimen';
import {AllCollections} from '~/components/AllCollections';
import {PackProduct} from '~/components/PackProduct';
import heroImage1 from '~/assets/images/hero.webp';
import heroImage2 from '~/assets/images/hero-2.webp';
import heroImage3 from '~/assets/images/hero-3.webp';
import heroImage4 from '~/assets/images/hero-4.webp';
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
  const bestSellers = context.storefront
    .query(BEST_SELLERS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const latestBlogs = context.storefront
    .query(BLOGS_QUERY, {
      variables: {first: 4},
      cache: context.storefront.CacheNone(),
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  const packProduct = context.storefront
    .query(PRODUCT_WITH_PACK_TAG_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    bestSellers,
    latestBlogs,
    packProduct,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <HeroSection
        image={[
          {url: heroImage1, altText: 'Holiday Hero'},
          {url: heroImage2, altText: 'Holiday Hero'},
          {url: heroImage3, altText: 'Holiday Hero'},
          {url: heroImage4, altText: 'Holiday Hero'},
        ]}
        title="Upgrade Your Daily Skincare Routine"
        text="Discover advanced medical grade formulas trusted for long term skin health."
        buttonText="SHOP ALL"
        buttonLink="/collections/all"
      />

      <AllCollections collections={data.allCollections} />

      <Suspense fallback={<div>Loading Best Sellers...</div>}>
        <Await resolve={data.bestSellers}>
          {(response) => (
            <BestSellers title="Best Sellers" products={response} />
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading Featured Pack...</div>}>
        <Await resolve={data.packProduct}>
          {(res) => {
            const all = res?.products?.nodes || [];
            const products = all
              .filter((p: any) => p?.bundle?.value === 'true')
              .slice(0, 2);

            return <PackProduct products={products} />;
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading Blogs...</div>}>
        <Await resolve={data.latestBlogs}>
          {(blogsData) => (
            <section className="container mx-auto px-4 py-12 mb-12">
              <div className="flex md:flex-row flex-col justify-between gap-4 my-6 items-end px-4 ">
                <div className="flex flex-col gap-3">
                  <h2 className="font-poppins text-3xl font-bold !m-0">
                    The BiologiMD® Blogs
                  </h2>
                  <p className="text-sm text-gray-600">
                    Discover expert tips, skincare insights, and the latest from
                    BiologiMD®.
                  </p>
                </div>
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
                  if (!article?.title) return null;
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

      {/* <DiscoverRegimenSection
        image={{
          url: discoverImage,
          altText: 'Welcome to our store',
        }}
        title="Discover Your Regimen"
        text="Find the skincare products best suited for your skin health goals."
        buttonText="Discover My Regimen"
        buttonLink="/collections"
      /> */}
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

const BEST_SELLERS_QUERY = `#graphql
  fragment BestSellerProduct on Product {
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
        id
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
    bundle: metafield(namespace: "custom", key: "bundle") {
      value
    }
   skinConcern: metafield(namespace: "custom", key: "concern") {
      value
    }
    dayUse: metafield(namespace: "product", key: "dayuse") {
      value
    }
    nightUse: metafield(namespace: "product", key: "nightuse") {
      value
    }
    skinType: metafield(namespace: "custom", key: "skintype") {
      value
    }
    fdaApproved: metafield(namespace: "custom", key: "fda_approved") {
      value
    }
  }
  query BestSellers ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 20, query: "tag:best-sellers", sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...BestSellerProduct
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
    descriptionHtml
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
    variants(first: 1) {
      nodes {
        id
        title
      }
    }
    bundle: metafield(namespace: "custom", key: "bundle") {
      value
    }
   skinConcern: metafield(namespace: "custom", key: "concern") {
      value
    }
    dayUse: metafield(namespace: "product", key: "dayuse") {
      value
    }
    nightUse: metafield(namespace: "product", key: "nightuse") {
      value
    }
    skinType: metafield(namespace: "custom", key: "skintype") {
      value
    }
    fdaApproved: metafield(namespace: "custom", key: "fda_approved") {
      value
    }
  }

  query ProductsWithBundle($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductWithTagFields
      }
    }
  }
` as const;

const BLOGS_QUERY = `#graphql
  query BlogsHome($first: Int) {
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
