import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import privacyPolicyContent from '../data/privacy-policy.md?raw';
import termsPolicyContent from '../data/terms-policy.md?raw';

interface Policy {
  title: string;
  body: string;
  handle: string;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BiologiMD | ${data?.policy.title ?? ''}`}];
};

export async function loader({params}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  // Map URL handles to content and titles
  const policies: Record<string, {content: string; title: string}> = {
    'privacy-policy': {
      content: privacyPolicyContent,
      title: 'Privacy Policy',
    },
    'terms-of-service': {
      content: termsPolicyContent,
      title: 'Terms of Service',
    },
  };

  const policyData = policies[params.handle];

  if (!policyData) {
    throw new Response('Could not find the policy', {status: 404});
  }

  // Convert markdown to HTML-like format with proper styling
  const formattedContent = formatPolicyContent(policyData.content);

  const policy: Policy = {
    title: policyData.title,
    body: formattedContent,
    handle: params.handle,
  };

  return {policy};
}

function formatPolicyContent(markdown: string): string {
  // Split into lines and process
  const lines = markdown.split('\n');
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Empty line - close list if open and add spacing
    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    // Check if line is already HTML (starts with <)
    if (line.startsWith('<')) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      // Apply styling to h2 tags
      if (line.startsWith('<h2>')) {
        html += line.replace(
          '<h2>',
          '<h2 class="text-2xl font-bold mt-8 mb-4 text-[#2B8C57]">',
        );
      } else {
        html += line;
      }
      continue;
    }

    // Check if it's a markdown list item (starts with - or *)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html +=
          '<ul style="list-style-type: disc; padding-left: 2rem; margin-left: 1rem; margin-bottom: 1rem;">';
        inList = true;
      }
      const listContent = line.substring(2); // Remove "- " or "* "
      html += `<li style="color: #374151; line-height: 1.75; margin-bottom: 0.5rem;">${listContent}</li>`;
    }
    // Regular paragraph
    else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p class="text-gray-700 leading-relaxed mb-4">${line}</p>`;
    }
  }

  // Close list if still open at end
  if (inList) {
    html += '</ul>';
  }

  return html;
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl pt-[130px] lg:pt-[220px]">
      <div className="mb-6">
        <Link
          to="/"
          className="text-[#2B8C57] hover:underline flex items-center gap-2 text-sm md:text-base"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
        {policy.title}
      </h1>
      <div
        className="prose prose-sm md:prose-lg max-w-none policy-content lg:max-w-[85%]"
        dangerouslySetInnerHTML={{__html: policy.body}}
      />
    </div>
  );
}
