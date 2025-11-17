import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import bundlesHeroImg from '~/assets/images/bundles-hero-img.webp';
import {Suspense} from 'react';
import {BestSellers} from '~/components/BestSellers';

export const meta: MetaFunction = () => {
  return [{title: 'Shop Bundles | BiologiMd'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Fetch all products that have bundle_products metafield
  const {products} = await storefront.query(BUNDLES_QUERY);
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    bundles: products,
    recommendedProducts,
  };
}

export default function Bundles() {
  const {bundles, recommendedProducts} = useLoaderData<typeof loader>();

  // Get first 4 bundles for hero display
  const heroBundles = bundles.nodes.slice(0, 4);

  return (
    <div className="bundles-page">
      {/* Hero Section */}
      <div
        className="product bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${bundlesHeroImg})`,
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div></div>
            {/* Right: Text Content */}
            <div className="p-8 md:p-12 max-w-[600px] space-y-6">
              <div className="space-y-8 flex flex-col gap-4">
                <p className="text-sm uppercase tracking-wider text-gray-600">
                  Introducing
                </p>
                <h1 className="font-poppins !text-4xl md:!text-5xl font-bold !m-0">
                  BiologiMD Bundles
                </h1>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Expertly curated combinations of medical-grade skincare
                  products designed to work together and target your specific
                  skin concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bundles Grid Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="!text-3xl font-bold mb-4">Shop All Bundles</h2>
          <p className="text-lg text-gray-600">
            Complete skincare regimens designed to work together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {bundles.nodes.map((bundle: any) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>

      <Suspense fallback={<div>Loading Best Sellers...</div>}>
        <Await resolve={recommendedProducts}>
          {(response) => <BestSellers products={response} />}
        </Await>
      </Suspense>
    </div>
  );
}

function BundleCard({bundle}: {bundle: any}) {
  const bundleProducts = bundle.bundleProducts?.references?.nodes || [];
  const productCount = bundleProducts.length;

  return (
    <div className="bundle-card group">
      <a href={`/products/${bundle.handle}`} className="block">
        {/* Bundle Image */}
        {bundle.featuredImage && (
          <div className="relative bg-[#F6F6F6] mb-4 overflow-hidden">
            <Image
              data={bundle.featuredImage}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Bundle Info */}
        <div className="space-y-2">
          <h3 className="font-poppins text-xl font-bold text-[#2B8C57]">
            {bundle.title}
          </h3>

          {/* Tags */}
          {bundle.tags?.length > 0 && (
            <p className="text-xs text-gray-600 capitalize">
              {bundle.tags?.join(' · ')}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <Money
              data={bundle.priceRange.minVariantPrice}
              className="text-lg font-semibold text-[#2B8C57]"
            />
          </div>

          {/* View Bundle Button */}
          <button className="w-full mt-4 border border-[#2B8C57] uppercase bg-white px-6 py-3 text-[#2B8C57] hover:text-white hover:bg-[#2B8C57] transition-colors duration-200 text-sm font-medium">
            Shop Now
          </button>
        </div>
      </a>
    </div>
  );
}

const BUNDLES_QUERY = `#graphql
  query Bundles(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 50, query: "tag:bundle") {
      nodes {
        id
        title
        handle
        tags
        featuredImage {
          id
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
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        bundleProducts: metafield(namespace: "custom", key: "bundle_products") {
          references(first: 10) {
            nodes {
              ... on Product {
                id
                title
              }
            }
          }
        }
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProductBundles on Product {
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
  query RecommendedProductsBundles ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProductBundles
      }
    }
  }
` as const;
