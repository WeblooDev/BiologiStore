import {useLocation} from 'react-router';

/**
 * Hook to get the current locale from the URL
 * Returns the locale prefix (e.g., 'es-us') or empty string for default locale
 */
export function useLocale() {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const localeParam = pathParts[1];

  // Check if the first path segment is a valid locale (e.g., es-us, fr-ca)
  if (localeParam && /^[a-z]{2}-[a-z]{2}$/i.test(localeParam)) {
    return localeParam.toLowerCase();
  }

  return ''; // Default locale (English)
}

/**
 * Hook to get locale-aware path
 * Prepends the current locale to any path
 */
export function useLocalePath() {
  const locale = useLocale();

  return (path: string) => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // If we have a locale and it's not the default, prepend it
    if (locale && locale !== 'en-us') {
      return `/${locale}${normalizedPath}`;
    }

    return normalizedPath;
  };
}

/**
 * Get the locale prefix for use in links
 */
export function getLocalePrefix(pathname: string): string {
  const pathParts = pathname.split('/');
  const localeParam = pathParts[1];

  if (localeParam && /^[a-z]{2}-[a-z]{2}$/i.test(localeParam)) {
    return `/${localeParam}`;
  }

  return '';
}
