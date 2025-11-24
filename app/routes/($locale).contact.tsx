// app/routes/contact.tsx

import type {MetaFunction} from '@shopify/remix-oxygen';
import {CustomerServiceForm} from '~/components/CustomerServiceForm';

export const meta: MetaFunction = () => {
  return [{title: 'BIOLOGIMD | BIOLOGI MD SHOP'}];
};

export default function ContactPage() {
  return (
    <div>
      <CustomerServiceForm />
    </div>
  );
}
