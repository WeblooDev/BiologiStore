import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
  RecommendedProductsForCartQuery,
} from 'storefrontapi.generated';

import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';

interface CollectionsQueryResult {
  collections: {
    nodes: Array<{
      id: string;
      title: string;
      handle: string;
    }>;
  };
}

interface PageLayoutProps {
  cart: CartApiQueryFragment | null;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
  collections: Promise<CollectionsQueryResult | null>;
  recommendedProducts: Promise<RecommendedProductsForCartQuery | null>;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  collections,
  publicStoreDomain,
  recommendedProducts,
}: PageLayoutProps) {
  return (
    <>
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
        collections={collections}
      />
    </>
  );
}
