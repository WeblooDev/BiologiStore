import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  // List of supported locales
  const supportedLocales = ['en-us', 'es-us'];

  if (params.locale) {
    const requestedLocale = params.locale.toLowerCase();

    // Check if the requested locale is in our supported list
    if (!supportedLocales.includes(requestedLocale)) {
      // If the locale is not supported, send to the 404 page
      throw new Response(null, {status: 404});
    }

    // If the locale doesn't match the storefront's default but is supported, allow it
    // This enables multi-language support even if Shopify Markets isn't fully configured
  }

  return null;
}
