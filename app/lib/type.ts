export type I18nLocale = {
  language: string;
  country: string;
  label: string;
  currency: string;
  pathPrefix: string;
};

export type Localizations = Record<string, I18nLocale>;

export type Env = {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STOREFRONT_ID: string;
  PUBLIC_CHECKOUT_DOMAIN: string;
  SESSION_SECRET: string;
};
