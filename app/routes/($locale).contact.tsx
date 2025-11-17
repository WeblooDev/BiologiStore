// app/routes/contact.tsx

import type {MetaFunction} from '@shopify/remix-oxygen';
import {CustomerServiceForm} from '~/components/CustomerServiceForm';

export const meta: MetaFunction = () => {
  return [{title: 'Contact Us | Customer Service'}];
};

export default function ContactPage() {
  return (
    <div>
      <CustomerServiceForm />
    </div>
  );
}
