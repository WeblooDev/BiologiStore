/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
            >
          >;
        }
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'title' | 'url' | 'type' | 'resourceId' | 'tags'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type CollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type CollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        seo: Pick<StorefrontAPI.Seo, 'title' | 'description'>;
      }
    >;
  };
};

export type RecommendedProductForCartFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  imgBackground?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
      >;
    }>;
  }>;
  skintype?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  bundleProducts?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<Pick<StorefrontAPI.Product, 'id' | 'title'>>;
    }>;
  }>;
};

export type RecommendedProductsForCartQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsForCartQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        imgBackground?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
        }>;
        skintype?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        bundleProducts?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<Pick<StorefrontAPI.Product, 'id' | 'title'>>;
          }>;
        }>;
      }
    >;
  };
};

export type CollectionFieldsFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type AllCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type AllCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type RecommendedProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type RecommendedProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type BestSellerProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type BestSellersQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type BestSellersQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type ProductWithTagFieldsFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'tags'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type ProductsWithTagQueryVariables = StorefrontAPI.Exact<{
  tag: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductsWithTagQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type BlogsHomeQueryVariables = StorefrontAPI.Exact<{
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type BlogsHomeQuery = {
  blogs: {
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
        articles: {
          nodes: Array<
            Pick<
              StorefrontAPI.Article,
              'title' | 'handle' | 'tags' | 'excerpt'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }
          >;
        };
      }
    >;
  };
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt' | 'tags'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
          shopPosts?: StorefrontAPI.Maybe<{
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<
                  StorefrontAPI.Product,
                  'id' | 'handle' | 'title' | 'tags' | 'descriptionHtml'
                > & {
                  priceRange: {
                    minVariantPrice: Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >;
                  };
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  variants: {
                    nodes: Array<
                      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'>
                    >;
                  };
                }
              >;
            }>;
          }>;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            | 'excerptHtml'
            | 'handle'
            | 'id'
            | 'contentHtml'
            | 'publishedAt'
            | 'title'
            | 'tags'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
            shopPosts?: StorefrontAPI.Maybe<{
              references?: StorefrontAPI.Maybe<{
                nodes: Array<
                  Pick<
                    StorefrontAPI.Product,
                    'id' | 'handle' | 'title' | 'tags' | 'descriptionHtml'
                  > & {
                    priceRange: {
                      minVariantPrice: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                    };
                    featuredImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                    variants: {
                      nodes: Array<
                        Pick<StorefrontAPI.ProductVariant, 'id' | 'title'>
                      >;
                    };
                  }
                >;
              }>;
            }>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  | 'excerptHtml'
  | 'handle'
  | 'id'
  | 'contentHtml'
  | 'publishedAt'
  | 'title'
  | 'tags'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
  shopPosts?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'tags' | 'descriptionHtml'
        > & {
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          variants: {
            nodes: Array<Pick<StorefrontAPI.ProductVariant, 'id' | 'title'>>;
          };
        }
      >;
    }>;
  }>;
};

export type BlogsIndexQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsIndexQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
        articles: {
          nodes: Array<
            Pick<
              StorefrontAPI.Article,
              'title' | 'handle' | 'tags' | 'excerpt'
            > & {
              image?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'url' | 'altText'>
              >;
            }
          >;
        };
      }
    >;
  };
};

export type BundlesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type BundlesQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        bundleProducts?: StorefrontAPI.Maybe<{
          references?: StorefrontAPI.Maybe<{
            nodes: Array<Pick<StorefrontAPI.Product, 'id' | 'title'>>;
          }>;
        }>;
      }
    >;
  };
};

export type RecommendedProductBundlesFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type RecommendedProductsBundlesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsBundlesQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type MoneyProductItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type ProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'descriptionHtml' | 'productType' | 'tags'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  metafield?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'handle'
            | 'title'
            | 'descriptionHtml'
            | 'productType'
            | 'tags'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            metafield?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Metafield, 'value'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type RecommendedProductCollectionFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type RecommendedProductsCollectionQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsCollectionQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type CollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type StoreCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type StoreCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type MoneyCollectionItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type CollectionItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'descriptionHtml' | 'productType' | 'tags'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  metafield?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  skinConcern?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  ingredient?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  skinType?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
  collections: {
    nodes: Array<Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'>>;
  };
};

export type CatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CatalogQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'descriptionHtml' | 'productType' | 'tags'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        metafield?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        skinConcern?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        ingredient?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Metafield, 'value'>
        >;
        skinType?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
        collections: {
          nodes: Array<
            Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'>
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type ProductTypesWithSampleProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductTypesWithSampleProductsQuery = {
  productTypes: {edges: Array<Pick<StorefrontAPI.StringEdge, 'node'>>};
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'title' | 'productType' | 'handle'> & {
        images: {nodes: Array<Pick<StorefrontAPI.Image, 'url' | 'altText'>>};
      }
    >;
  };
};

export type RecommendedProductAllFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type RecommendedProductsAllQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsAllQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'descriptionHtml' | 'tags'
      > & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {nodes: Array<Pick<StorefrontAPI.ProductVariant, 'title'>>};
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    {__typename: 'Image'} & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'handle'
  | 'descriptionHtml'
  | 'description'
  | 'tags'
  | 'encodedVariantExistence'
  | 'encodedVariantAvailability'
> & {
  metafield?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  expectation?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  usage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  faqProduct?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  skinConcern?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  dayUse?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  nightUse?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  skinType?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  fdaApproved?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  allIngredients?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  expectImage?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<StorefrontAPI.Product, 'id' | 'title'> & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
      >;
    }>;
  }>;
  usagePicture?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
      >;
    }>;
  }>;
  bundleProducts?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'title' | 'handle' | 'description' | 'tags'
        > & {
          dayUse?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
          nightUse?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          skinConcern?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          fdaApproved?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
          featuredImage?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          stepLabel?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metafield, 'value'>
          >;
        }
      >;
    }>;
  }>;
  bundleRegimen?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  imgBackground?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
      >;
    }>;
  }>;
  beforeAfter?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<{
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      }>;
    }>;
  }>;
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };
  siblings?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'type'> & {
      referenceList?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }
        >;
      }>;
    }
  >;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
          firstSelectableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'id' | 'sku' | 'title'
            > & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                {__typename: 'Image'} & Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<{
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              }>;
            }
          >;
        }
      >;
    }
  >;
  selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  adjacentVariants: Array<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'descriptionHtml'
      | 'description'
      | 'tags'
      | 'encodedVariantExistence'
      | 'encodedVariantAvailability'
    > & {
      metafield?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      expectation?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      usage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      faqProduct?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      skinConcern?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      dayUse?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      nightUse?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      skinType?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      fdaApproved?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      allIngredients?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      expectImage?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.Product, 'id' | 'title'> & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
        }>;
      }>;
      usagePicture?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }>;
      }>;
      bundleProducts?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<
              StorefrontAPI.Product,
              'id' | 'title' | 'handle' | 'description' | 'tags'
            > & {
              dayUse?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              nightUse?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              skinConcern?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              fdaApproved?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              priceRange: {
                minVariantPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
              };
              stepLabel?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Metafield, 'value'>
              >;
            }
          >;
        }>;
      }>;
      bundleRegimen?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      imgBackground?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<{
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }>;
      }>;
      beforeAfter?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
        }>;
      }>;
      images: {
        nodes: Array<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      };
      siblings?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'type'> & {
          referenceList?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }>;
        }
      >;
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'id' | 'sku' | 'title'
                > & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    {__typename: 'Image'} & Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }
              >;
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<{
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  }>;
                }
              >;
            }
          >;
        }
      >;
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      adjacentVariants: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type RecommendedProductBestSellingFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'tags'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type RecommendedProductsBestSellingQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecommendedProductsBestSellingQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'tags'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type RecentlyViewedProductFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle'
> & {
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type RecentlyViewedProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecentlyViewedProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'handle' | 'id' | 'publishedAt' | 'title' | 'trackingParameters' | 'vendor'
> & {
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
      }
    >;
  };

export type SearchPageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type PageInfoFragmentFragment = Pick<
  StorefrontAPI.PageInfo,
  'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
>;

export type RegularSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  term: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type RegularSearchQuery = {
  articles: {
    nodes: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  pages: {
    nodes: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'handle'
        | 'id'
        | 'publishedAt'
        | 'title'
        | 'trackingParameters'
        | 'vendor'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    blog: Pick<StorefrontAPI.Blog, 'handle'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  term: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          blog: Pick<StorefrontAPI.Blog, 'handle'>;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment Menu on Menu {\n    id\n    items {\n      id\n      title\n      url\n      type\n      resourceId\n      tags\n      items {\n        id\n        title\n        url\n        type\n        resourceId\n        tags\n        items {\n          id\n          title\n          url\n          type\n          resourceId\n          tags\n        }\n      }\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment Menu on Menu {\n    id\n    items {\n      id\n      title\n      url\n      type\n      resourceId\n      tags\n      items {\n        id\n        title\n        url\n        type\n        resourceId\n        tags\n        items {\n          id\n          title\n          url\n          type\n          resourceId\n          tags\n        }\n      }\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query Collections(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    collections(first: 200, sortKey: TITLE) {\n      nodes {\n        id\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: CollectionsQuery;
    variables: CollectionsQueryVariables;
  };
  '#graphql\n  fragment RecommendedProductForCart on Product {\n    id\n    title\n    handle\n    tags\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    imgBackground: metafield(namespace: "custom", key: "imgBackground") {\n      reference {\n        ... on MediaImage {\n          image {\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n    skintype: metafield(namespace: "custom", key: "skintype") {\n      value\n    }\n    bundleProducts: metafield(namespace: "custom", key: "bundle_products") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            id\n            title\n          }\n        }\n      }\n    }\n  }\n  query RecommendedProductsForCart($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProductForCart\n      }\n    }\n  }\n': {
    return: RecommendedProductsForCartQuery;
    variables: RecommendedProductsForCartQueryVariables;
  };
  '#graphql\n  fragment CollectionFields on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n  query AllCollections($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    collections(first: 20, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...CollectionFields\n      }\n    }\n  }\n': {
    return: AllCollectionsQuery;
    variables: AllCollectionsQueryVariables;
  };
  '#graphql\n  fragment RecommendedProduct on Product {\n    id\n    title\n    handle\n    descriptionHtml\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n      variants(first: 1) {\n    nodes {\n      title\n    }\n  }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    tags\n  }\n  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProduct\n      }\n    }\n  }\n': {
    return: RecommendedProductsQuery;
    variables: RecommendedProductsQueryVariables;
  };
  '#graphql\n  fragment BestSellerProduct on Product {\n    id\n    title\n    handle\n    descriptionHtml\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        title\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    tags\n  }\n  query BestSellers ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, query: "tag:best-sellers", sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...BestSellerProduct\n      }\n    }\n  }\n': {
    return: BestSellersQuery;
    variables: BestSellersQueryVariables;
  };
  '#graphql\n  fragment ProductWithTagFields on Product {\n    id\n    title\n    handle\n    tags\n    featuredImage {\n      id\n      url\n      altText\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  query ProductsWithTag($tag: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 2, query: $tag) {\n      nodes {\n        ...ProductWithTagFields\n      }\n    }\n  }\n': {
    return: ProductsWithTagQuery;
    variables: ProductsWithTagQueryVariables;
  };
  '#graphql\n  query BlogsHome($first: Int) {\n    blogs(first: $first) {\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n        articles(first: 1) {\n          nodes {\n            title\n            handle\n            tags\n            excerpt\n            image {\n              url\n              altText\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: BlogsHomeQuery;
    variables: BlogsHomeQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      handle\n      articleByHandle(handle: $articleHandle) {\n        handle\n        title\n        contentHtml\n        publishedAt\n        tags\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n        shopPosts: metafield(namespace: "custom", key: "shopposts") {\n          references(first: 10) {\n            nodes {\n              ... on Product {\n                id\n                handle\n                title\n                tags\n                priceRange {\n                  minVariantPrice {\n                    amount\n                    currencyCode\n                  }\n                }\n                featuredImage {\n                  id\n                  url\n                  altText\n                  width\n                  height\n                }\n                variants(first: 1) {\n                  nodes {\n                    id\n                    title\n                  }\n                }\n                descriptionHtml\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      handle\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    excerptHtml\n    handle\n    id\n    contentHtml\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n    tags\n    shopPosts: metafield(namespace: "custom", key: "shop_posts") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            id\n            handle\n            title\n            tags\n            priceRange {\n              minVariantPrice {\n                amount\n                currencyCode\n              }\n            }\n            featuredImage {\n              id\n              url\n              altText\n              width\n              height\n            }\n            variants(first: 1) {\n              nodes {\n                id\n                title\n              }\n            }\n            descriptionHtml\n          }\n        }\n      }\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query BlogsIndex(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first\n      last: $last\n      before: $startCursor\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n        articles(first: 1) {\n          nodes {\n            title\n            handle\n            tags\n            excerpt\n            image {\n              url\n              altText\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: BlogsIndexQuery;
    variables: BlogsIndexQueryVariables;
  };
  '#graphql\n  query Bundles(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    products(first: 50, query: "tag:bundle") {\n      nodes {\n        id\n        title\n        handle\n        tags\n        featuredImage {\n          id\n          url\n          altText\n          width\n          height\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        compareAtPriceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        bundleProducts: metafield(namespace: "custom", key: "bundle_products") {\n          references(first: 10) {\n            nodes {\n              ... on Product {\n                id\n                title\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: BundlesQuery;
    variables: BundlesQueryVariables;
  };
  '#graphql\n  fragment RecommendedProductBundles on Product {\n    id\n    title\n    handle\n    descriptionHtml\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n      variants(first: 1) {\n    nodes {\n      title\n    }\n  }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    tags\n  }\n  query RecommendedProductsBundles ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProductBundles\n      }\n    }\n  }\n': {
    return: RecommendedProductsBundlesQuery;
    variables: RecommendedProductsBundlesQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    descriptionHtml\n    productType\n    tags\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    metafield(namespace: "custom", key: "new") {\n      value\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n    variants(first: 10) {\n      nodes {\n        id\n        title\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  fragment CollectionFields on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  query AllCollections($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    collections(first: 20, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...CollectionFields\n      }\n    }\n  }\n': {
    return: AllCollectionsQuery;
    variables: AllCollectionsQueryVariables;
  };
  '#graphql\n  fragment RecommendedProductCollection on Product {\n    id\n    title\n    handle\n    descriptionHtml\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    variants(first: 1) {\n      nodes {\n        title\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    tags\n  }\n  query RecommendedProductsCollection ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProductCollection\n      }\n    }\n  }\n': {
    return: RecommendedProductsCollectionQuery;
    variables: RecommendedProductsCollectionQueryVariables;
  };
  '#graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n  query StoreCollections(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreCollectionsQuery;
    variables: StoreCollectionsQueryVariables;
  };
  '#graphql\n  query Catalog(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n   products(\n     first: $first\n     last: $last\n     before: $startCursor\n     after: $endCursor\n     sortKey: UPDATED_AT\n     reverse: true\n   ) {\n      nodes {\n        ...CollectionItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n  #graphql\n  fragment MoneyCollectionItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n\n  fragment CollectionItem on Product {\n    id\n    handle\n    title\n    descriptionHtml  # ✅ Add this line\n    productType\n    tags\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    metafield(namespace: "custom", key: "new") {\n      value\n    }\n    skinConcern: metafield(namespace: "custom", key: "concern") {\n      value\n    }\n    ingredient: metafield(namespace: "custom", key: "ingredients") {\n      value\n    }\n    skinType: metafield(namespace: "custom", key: "skintype") {\n      value\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n    variants(first: 10) {\n      nodes {\n        id\n        title\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n    collections(first: 10) {\n      nodes {\n        id\n        title\n        handle\n      }\n    }\n  }\n\n': {
    return: CatalogQuery;
    variables: CatalogQueryVariables;
  };
  '#graphql\n  query ProductTypesWithSampleProducts($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    productTypes(first: 20) {\n      edges {\n        node\n      }\n    }\n    products(first: 100, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        title\n        productType\n        handle\n        images(first: 2) {\n          nodes {\n            url\n            altText\n          }\n        }\n      }\n    }\n  }\n': {
    return: ProductTypesWithSampleProductsQuery;
    variables: ProductTypesWithSampleProductsQueryVariables;
  };
  '#graphql\n  fragment RecommendedProductAll on Product {\n    id\n    title\n    handle\n    descriptionHtml\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n      variants(first: 1) {\n    nodes {\n      title\n    }\n  }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    tags\n  }\n  query RecommendedProductsAll ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    products(first: 6, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecommendedProductAll\n      }\n    }\n  }\n': {
    return: RecommendedProductsAllQuery;
    variables: RecommendedProductsAllQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    tags\n    metafield(namespace: "custom", key: "benefits") {\n      value\n    }\n    expectation: metafield(namespace: "custom", key: "expectation") {\n      value\n    }\n    usage: metafield(namespace: "custom", key: "usage") {\n      value\n    }\n    faqProduct: metafield(namespace: "product", key: "faq") {\n      value\n    }\n    skinConcern: metafield(namespace: "custom", key: "concern") {\n      value\n    }\n    dayUse: metafield(namespace: "product", key: "dayuse") {\n      value\n    }\n    nightUse: metafield(namespace: "product", key: "nightuse") {\n      value\n    }\n    skinType: metafield(namespace: "custom", key: "skintype") {\n      value\n    }\n    fdaApproved: metafield(namespace: "custom", key: "fda_approved") {\n      value\n    }\n    allIngredients: metafield(namespace: "custom", key: "all_ingredients") {\n      value\n    }\n      expectImage: metafield(namespace: "custom", key: "expectImage") {\n  references(first: 10) {\n    nodes {\n      ... on Product {\n        id\n        title\n        featuredImage {\n          url\n          altText\n          width\n          height\n        }\n      }\n    }\n  }\n}\n\n    usagePicture: metafield(namespace: "custom", key: "usagePicture") {\n      reference {\n        ... on MediaImage {\n          image {\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n\n    bundleProducts: metafield(namespace: "custom", key: "bundle_products") {\n      references(first: 10) {\n        nodes {\n          ... on Product {\n            id\n            title\n            handle\n            description\n            tags\n            dayUse: metafield(namespace: "product", key: "dayuse") {\n              value\n            }\n            nightUse: metafield(namespace: "product", key: "nightuse") {\n              value\n            }\n            skinConcern: metafield(namespace: "product", key: "concern") {\n              value\n            }\n            fdaApproved: metafield(namespace: "product", key: "fda_approved") {\n              value\n            }\n            featuredImage {\n              url\n              altText\n              width\n              height\n            }\n            priceRange {\n              minVariantPrice {\n                amount\n                currencyCode\n              }\n            }\n            stepLabel: metafield(namespace: "custom", key: "step_label") {\n              value\n            }\n          }\n        }\n      }\n    }\n\nbundleRegimen: metafield(namespace: "custom", key: "bundle_regimen") {\n  value\n}\n\n\n      imgBackground: metafield(namespace: "custom", key: "imgBackground") {\n  reference {\n    ... on MediaImage {\n      image {\n        url\n        altText\n        width\n        height\n      }\n    }\n  }\n}\n\n    beforeAfter: metafield(namespace: "custom", key: "beforeafter") {\n      references(first: 2) {\n        nodes {\n          ... on MediaImage {\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n    images(first: 5) {\n      nodes {\n        url\n        altText\n        width\n        height\n      }\n    }\n    siblings: metafield(namespace: "custom", key: "siblings") {\n      type\n      referenceList: references(first: 10) {\n        nodes {\n          ... on Product {\n            id\n            title\n            handle\n            featuredImage {\n              url\n              altText\n              width\n              height\n            }\n            \n          }\n        }\n      }\n    }\n    encodedVariantExistence\n    encodedVariantAvailability\n    options {\n      name\n      optionValues {\n        name\n        firstSelectableVariant {\n          ...ProductVariant\n        }\n        swatch {\n          color\n          image {\n            previewImage {\n              url\n            }\n          }\n        }\n      }\n    }\n    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    adjacentVariants(selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  fragment RecommendedProductBestSelling on Product {\n    id\n    title\n    handle\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n    tags\n  }\n\n  query RecommendedProductsBestSelling($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 4, sortKey: BEST_SELLING) {\n      nodes {\n        ...RecommendedProductBestSelling\n      }\n    }\n  }\n': {
    return: RecommendedProductsBestSellingQuery;
    variables: RecommendedProductsBestSellingQueryVariables;
  };
  '#graphql\n  fragment RecentlyViewedProduct on Product {\n    id\n    title\n    handle\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  query RecentlyViewedProducts($country: CountryCode, $language: LanguageCode)\n  @inContext(country: $country, language: $language) {\n    products(first: 20, sortKey: UPDATED_AT, reverse: true) {\n      nodes {\n        ...RecentlyViewedProduct\n      }\n    }\n  }\n': {
    return: RecentlyViewedProductsQuery;
    variables: RecentlyViewedProductsQueryVariables;
  };
  '#graphql\n  query RegularSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $term: String!\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    articles: search(\n      query: $term,\n      types: [ARTICLE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Article {\n          ...SearchArticle\n        }\n      }\n    }\n    pages: search(\n      query: $term,\n      types: [PAGE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Page {\n          ...SearchPage\n        }\n      }\n    }\n    products: search(\n      after: $endCursor,\n      before: $startCursor,\n      first: $first,\n      last: $last,\n      query: $term,\n      sortKey: RELEVANCE,\n      types: [PRODUCT],\n      unavailableProducts: HIDE,\n    ) {\n      nodes {\n        ...on Product {\n          ...SearchProduct\n        }\n      }\n      pageInfo {\n        ...PageInfoFragment\n      }\n    }\n  }\n  #graphql\n  fragment SearchProduct on Product {\n    __typename\n    handle\n    id\n    publishedAt\n    title\n    trackingParameters\n    vendor\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n      compareAtPrice {\n        amount\n        currencyCode\n      }\n      selectedOptions {\n        name\n        value\n      }\n      product {\n        handle\n        title\n      }\n    }\n  }\n\n  #graphql\n  fragment SearchPage on Page {\n     __typename\n     handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment SearchArticle on Article {\n    __typename\n    handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment PageInfoFragment on PageInfo {\n    hasNextPage\n    hasPreviousPage\n    startCursor\n    endCursor\n  }\n\n': {
    return: RegularSearchQuery;
    variables: RegularSearchQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $term: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $term,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n  #graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    blog {\n      handle\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  #graphql\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
