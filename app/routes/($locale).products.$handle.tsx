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
import { ProductBenefits } from '../components/ProductBenefits';
import { ProductSiblings } from '../components/ProductSiblings'; 
import { DiscoverRegimenSection } from '~/components/DiscoverRegimen';
import discoverImage from '~/assets/images/discover.png';
import { ProductUsage } from '~/components/ProductUsage';
import { ProductExpectation } from '~/components/ProductExpectation';
import { BestSellers } from '~/components/BestSellers';
import { Suspense } from 'react';
import bullet from '~/assets/images/bulle.svg';
import {BundleProducts} from '~/components/BundleProducts';

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

function loadDeferredData({ context }: LoaderFunctionArgs) {
  const bestSellers = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((err) => {
      console.error("Error fetching best sellers:", err);
      return null;
    });

  return {
    bestSellers,
  };
}




export default function Product() {
const { product, bestSellers } = useLoaderData<typeof loader>();
  
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, tags, descriptionHtml } = product;
  const siblings = product?.siblings?.referenceList?.nodes || [];

  return (
    <>
 <div
  className="product bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${product?.imgBackground?.reference?.image?.url})`,
  }}
>

  <div className="product-main bg-white p-6 max-w-[600px]">
    <h1 className="!text-[32px] text-[#2B8C57] !m-0">{title}</h1>

    {tags?.length > 0 && (
      <div className="mb-4 flex flex-wrap gap-2">
       {tags.map((tag: string, index: number) => (
      <div key={tag} className="flex items-center gap-1">
        <span className="!text-sm text-[#4F4F4F] underline">{tag}</span>
        {index < tags.length - 1 && (
          <img src={bullet} alt="" className="w-[6px] h-[6px]" />
        )}
      </div>
    ))}

      </div>
    )}

    <ProductPrice
      price={selectedVariant?.price}
      compareAtPrice={selectedVariant?.compareAtPrice}
      
    />

<div
  className="prose prose-p:!text-sm max-w-none"
  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
/>

    <p className="!text-sm mt-2">
      {selectedVariant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === 'size'
      )?.value}
    </p>

    <ProductForm
      productOptions={productOptions}
      selectedVariant={selectedVariant}
    />

  <div>
      <p className="font-gayathri !text-xl !mt-8 font-normal">Pair it With</p>
      <p>Our products are designed to work better together</p>
  </div>

    <ProductSiblings products={siblings} />
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




      <ProductBenefits
        json={product.metafield?.value || '[]'}
        images={product.images?.nodes || []}
      />

    <ProductExpectation
      json={product.expectation?.value || '[]'}
      beforeAfter={
        product.beforeAfter?.references?.nodes?.map((ref: any) => ref.image?.url) || []
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

      <Suspense fallback={<div>Loading Best Sellers...</div>}>
      <Await resolve={bestSellers}>
        {(data) => data && <BestSellers title='Recently Viewed' products={data} />}
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
      }
    }
  }
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
    products(first: 4, sortKey: BEST_SELLING) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
