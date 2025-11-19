import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductBenefits} from '../components/ProductBenefits';
import {ProductSiblings} from '../components/ProductSiblings';
import {DiscoverRegimenSection} from '~/components/DiscoverRegimen';
import discoverImage from '~/assets/images/discover.png';
import {ProductUsage} from '~/components/ProductUsage';
import {ProductExpectation} from '~/components/ProductExpectation';
import {BestSellers} from '~/components/BestSellers';
import {RecentlyViewed} from '~/components/RecentlyViewed';
import {Suspense, useEffect} from 'react';
import bullet from '~/assets/images/bulle.svg';
import {BundleProducts} from '~/components/BundleProducts';
import {BundleRegimen} from '~/components/BundleRegimen';
import {ProductFAQ} from '~/components/ProductFAQ';
import nightUseSvg from '~/assets/images/nightuse.svg';
import dayUseSvg from '~/assets/images/dayuse.svg';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const bestSellers = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((err) => {
      console.error('Error fetching best sellers:', err);
      return null;
    });

  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_FOR_RECENTLY_VIEWED_QUERY)
    .catch((err) => {
      console.error('Error fetching recommended products:', err);
      return null;
    });

  return {
    bestSellers,
    recommendedProducts,
  };
}

export default function Product() {
  const {product, bestSellers, recommendedProducts} =
    useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, tags, descriptionHtml} = product;
  const siblings = product?.siblings?.referenceList?.nodes || [];

  const bundleProducts = product?.bundleProducts?.references?.nodes || [];

  // Parse metafield values
  const parseSkinConcern = () => {
    try {
      const raw = (product as any)?.skinConcern?.value;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const parseDayUse = () => {
    try {
      const raw = (product as any)?.dayUse?.value;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return raw;
    }
  };

  const parseNightUse = () => {
    try {
      const raw = (product as any)?.nightUse?.value;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return raw;
    }
  };

  const parseFdaApproved = () => {
    try {
      const raw = (product as any)?.fdaApproved?.value;
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed === true || parsed === 'true';
    } catch (e) {
      return raw === 'true' || raw === true;
    }
  };

  const parseSkinType = () => {
    try {
      const raw = (product as any)?.skinType?.value;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const skinConcern = parseSkinConcern();
  const skinType = parseSkinType();
  const dayUse = parseDayUse();
  const nightUse = parseNightUse();
  const fdaApproved = parseFdaApproved();

  // Track recently viewed products on the client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storageKey = 'recentlyViewedProducts';
      const existingRaw = window.localStorage.getItem(storageKey);
      const existing: string[] = existingRaw ? JSON.parse(existingRaw) : [];
      const handle = product.handle as string;

      const withoutCurrent = existing.filter((h) => h !== handle);
      const updated = [handle, ...withoutCurrent].slice(0, 10);

      window.localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      // Ignore storage errors
    }
  }, [product.handle]);

  return (
    <>
      <div
        className="product bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: `url(${product?.imgBackground?.reference?.image?.url})`,
        }}
      >
        <div className="product-main bg-white p-6 max-w-[600px] h-fit">
          <div className="flex flex-col gap-1">
            <h1 className="!text-[32px] text-[#2B8C57] !m-0">{title}</h1>

            <div className="flex flex-row gap-2 items-center">
              {tags?.length > 0 && bundleProducts?.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  {tags.map((tag: string, index: number) => (
                    <div key={tag} className="flex items-center gap-1">
                      <span className="!text-sm text-[#4F4F4F] underline">
                        {tag}
                      </span>
                      {index < tags.length - 1 && (
                        <span className="!text-sm text-[#4F4F4F]">+</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {skinType.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  {skinType.map((tag: string, index: number) => (
                    <div key={tag} className="flex items-center gap-1">
                      <span className="!text-sm text-[#4F4F4F] underline">
                        {tag}
                      </span>
                      {index < skinType.length - 1 && (
                        <span className="!text-sm text-[#4F4F4F]">+</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {skinConcern.length > 0 && (
                <img src={bullet} alt="" className="w-[6px] h-[6px] mb-4" />
              )}
              {skinConcern.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  {skinConcern.map((tag: string, index: number) => (
                    <div key={tag} className="flex items-center gap-1">
                      <span className="!text-sm text-[#4F4F4F] underline">
                        {tag}
                      </span>
                      {index < skinConcern.length - 1 && (
                        <span className="!text-sm text-[#4F4F4F]">+</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {(dayUse || nightUse) && (
                <img src={bullet} alt="" className="w-[6px] h-[6px] mb-4" />
              )}
              {dayUse && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <img src={dayUseSvg} alt="" />
                </div>
              )}
              {nightUse && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <img src={nightUseSvg} alt="" />
                </div>
              )}
              {fdaApproved && (
                <img src={bullet} alt="" className="w-[6px] h-[6px] mb-4" />
              )}
              {fdaApproved && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <p className="!text-sm text-[#4F4F4F]">FDA Approved</p>
                </div>
              )}
            </div>
          </div>

          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />

          <div
            className="prose prose-p:!text-sm max-w-none"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />

          <p className="!text-sm mt-2">
            {
              selectedVariant.selectedOptions.find(
                (opt) => opt.name.toLowerCase() === 'size',
              )?.value
            }
          </p>

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          {siblings && (
            <>
              <p className="font-poppins !text-lg !mt-8 font-normal">
                Pair it With
              </p>

              <ProductSiblings products={siblings} />
            </>
          )}
        </div>

        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>

      {/* <BundleProducts products={bundleProducts} /> */}

      {bundleProducts && (
        <BundleRegimen
          products={bundleProducts}
          regimenData={product.bundleRegimen}
        />
      )}

      <ProductBenefits
        json={product.metafield?.value || '[]'}
        images={product.images?.nodes || []}
      />

      <ProductExpectation
        json={product.expectation?.value || '[]'}
        beforeAfter={
          product.beforeAfter?.references?.nodes?.map(
            (ref: any) => ref.image?.url,
          ) || []
        }
        expectImage={
          product.expectImage?.references?.nodes?.map((node: any) => ({
            title: node.title,
            featuredImage: node.featuredImage,
          })) || []
        }
      />

      <ProductUsage
        json={product.usage?.value || '[]'}
        image={product.usagePicture?.reference?.image}
      />

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

      <Suspense fallback={<div>Loading products...</div>}>
        <Await resolve={bestSellers}>
          {(data) =>
            data && <BestSellers title="Shoppers also loved" products={data} />
          }
        </Await>
      </Suspense>

      <ProductFAQ json={product.faqProduct?.value || '[]'} />

      <Suspense fallback={<div>Loading Recently Viewed...</div>}>
        <Await resolve={recommendedProducts}>
          {(data) =>
            data && (
              <RecentlyViewed
                title="Recently Viewed"
                products={data}
                currentProductHandle={product.handle}
              />
            )
          }
        </Await>
      </Suspense>
    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    metafield(namespace: "custom", key: "benefits") {
      value
    }
    expectation: metafield(namespace: "custom", key: "expectation") {
      value
    }
    usage: metafield(namespace: "custom", key: "usage") {
      value
    }
    faqProduct: metafield(namespace: "product", key: "faq") {
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
    allIngredients: metafield(namespace: "custom", key: "all_ingredients") {
      value
    }
      expectImage: metafield(namespace: "custom", key: "expectImage") {
  references(first: 10) {
    nodes {
      ... on Product {
        id
        title
        featuredImage {
          url
          altText
          width
          height
        }
      }
    }
  }
}

    usagePicture: metafield(namespace: "custom", key: "usagePicture") {
      reference {
        ... on MediaImage {
          image {
            url
            altText
            width
            height
          }
        }
      }
    }

    bundleProducts: metafield(namespace: "custom", key: "bundle_products") {
      references(first: 10) {
        nodes {
          ... on Product {
            id
            title
            handle
            description
            tags
            dayUse: metafield(namespace: "product", key: "dayuse") {
              value
            }
            nightUse: metafield(namespace: "product", key: "nightuse") {
              value
            }
            skinConcern: metafield(namespace: "product", key: "concern") {
              value
            }
            fdaApproved: metafield(namespace: "product", key: "fda_approved") {
              value
            }
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
            stepLabel: metafield(namespace: "custom", key: "step_label") {
              value
            }
          }
        }
      }
    }

bundleRegimen: metafield(namespace: "custom", key: "bundle_regimen") {
  value
}


      imgBackground: metafield(namespace: "custom", key: "imgBackground") {
  reference {
    ... on MediaImage {
      image {
        url
        altText
        width
        height
      }
    }
  }
}

    beforeAfter: metafield(namespace: "custom", key: "beforeafter") {
      references(first: 2) {
        nodes {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
    images(first: 5) {
      nodes {
        url
        altText
        width
        height
      }
    }
    siblings: metafield(namespace: "custom", key: "siblings") {
      type
      referenceList: references(first: 10) {
        nodes {
          ... on Product {
            id
            title
            handle
            featuredImage {
              url
              altText
              width
              height
            }
            
          }
        }
      }
    }
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProductBestSelling on Product {
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

  query RecommendedProductsBestSelling($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: BEST_SELLING) {
      nodes {
        ...RecommendedProductBestSelling
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_FOR_RECENTLY_VIEWED_QUERY = `#graphql
  fragment RecentlyViewedProduct on Product {
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
  }

  query RecentlyViewedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 20, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecentlyViewedProduct
      }
    }
  }
` as const;
