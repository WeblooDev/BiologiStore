import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from 'react-router';
import {HeroAboutSection} from '~/components/HeroAboutSection';
import {ImageTextSection} from '~/components/ImageTextSection'; // ✅ Import the component
import heroaboutImage from '~/assets/images/heroabout.png';
import about1 from '~/assets/images/about1.webp';
import about2 from '~/assets/images/about-camelia.webp';
import about3 from '~/assets/images/about3.webp';
import about4 from '~/assets/images/biologi-experts.webp';
import trustedbyexpert from '~/assets/images/chosen-by-you.webp';

import {TrustedByExpertSection} from '~/components/TrustedByExpert';

export const meta: MetaFunction = () => {
  return [{title: 'About Us | Hydrogen'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  return {};
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <HeroAboutSection
        image={{
          url: heroaboutImage,
          altText: 'Welcome to our store',
        }}
        title="About BiologiMD® Skin Health"
        text="The Leading Physician-Dispensed Skincare Brand Founded by Camelia Bennani"
      />

      {/* ✅ Call the ImageTextSection here */}
      <ImageTextSection
        image={{
          url: about1,
          altText: 'Founders working',
        }}
        content={[
          {
            title: 'About BiologiMD®',
            description:
              'At BiologiMD, we are dedicated to helping you achieve your best skin yet. Our medical-grade skincare products are clinically formulated to deliver visible results from the very first use. Designed with precision and supported by extensive research, these advanced solutions bring the power of professional care directly to your doorstep. We understand that not everyone can visit the BiologiMD clinic, which is why we make expert skincare accessible to you.',
          },
          {
            title: 'Camelia Bennani’s Commitment',
            description:
              'We believe that high-quality skincare should be accessible to everyone. That’s why we’ve made it our mission to bring professional-grade treatments into the comfort of your home. Whether you’re just beginning your skincare journey or maintaining a vibrant, healthy complexion, BiologiMD is here to support you every step of the way.',
          },
        ]}
        buttonText="Shop Now"
        buttonLink="/our-story"
      />

      <ImageTextSection
        image={{
          url: about2,
          altText: 'Founders working',
        }}
        content={[
          {
            title: 'Meet the Founder: Camelia Bennani',
            description:
              'Camelia Bennani’s journey reflects resilience, ambition, and passion. Born in Morocco, she migrated to the U.S. at 13, determined to build a brighter future. Inspired by the connection between science and beauty, she pursued a career in healthcare, earning a graduate degree from Vanderbilt University, a top institution in medical research.',
          },
          {
            title: '',
            description:
              'With over 12 years of experience as a general practitioner specializing in medical aesthetics, Camelia combines expertise with compassion to empower individuals through skincare. Her love for helping others inspired the creation of BiologiMD, a medical-grade skincare line delivering clinical results. Dedicated to making science-backed solutions accessible, Camelia’s mission is helping people achieve radiant, confident skin.',
          },
        ]}
        reverse={true}
      />

      <ImageTextSection
        image={{
          url: about3,
          altText: 'Founders working',
        }}
        content={[
          {
            title: 'BiologiMD® Skin Centre: Advanced Skin Health Treatments',
            description:
              'BiologiMD® is more than a skincare brand. It is a clinical destination. Our Skin Centre in Newport Beach, Orange County offers advanced medical-grade treatments developed by our team and performed by professionals trained in BiologiMD® protocols.',
          },
          {
            title: '',
            description:
              'Owned and operated by BiologiMD®, the clinic provides consistent care, trusted methods, and results backed by science.',
          },
        ]}
        reverse={false}
        buttonText="Visit Our Clinic"
        buttonLink="/our-story"
      />

      <ImageTextSection
        image={{
          url: about4,
          altText: 'Founders working',
        }}
        content={[
          {
            title: 'BiologiMD® Experts by Your Side',
            description:
              'Our team is here to guide you. Get straightforward advice, product recommendations, and support to help you get the best results from your routine.',
          },
          {
            title: '',
            description:
              'Each specialist is trained in BiologiMD® protocols and product science to provide accurate, personalized guidance based on your skin needs.',
          },
        ]}
        reverse={true}
        buttonText="Contact Us"
        buttonLink="/our-story"
      />

      <TrustedByExpertSection
        image={{
          url: trustedbyexpert,
          altText: 'Trusted by Experts. Chosen by You.',
        }}
        title="Trusted by Experts. Chosen by You."
        text="Experience our professional-grade skincare designed to treat, transform, and maintain your healthiest skin."
        buttonText="Shop Now"
        buttonText1="Learn More"
      />
    </div>
  );
}
