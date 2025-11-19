import type {Localizations} from '~/lib/type';

export const countries: Localizations = {
  default: {
    language: 'EN',
    country: 'US',
    label: 'United States (USD $)',
    currency: 'USD',
    pathPrefix: '',
  },
  '/en-us': {
    language: 'EN',
    country: 'US',
    label: 'United States (USD $)',
    currency: 'USD',
    pathPrefix: '/en-us',
  },
  '/en-ca': {
    language: 'EN',
    country: 'CA',
    label: 'Canada (CAD $)',
    currency: 'CAD',
    pathPrefix: '/en-ca',
  },
  '/en-gb': {
    language: 'EN',
    country: 'GB',
    label: 'United Kingdom (GBP £)',
    currency: 'GBP',
    pathPrefix: '/en-gb',
  },
};
