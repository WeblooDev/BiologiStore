import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from 'react-router';
import {useState} from 'react';
import {getPaginationVariables} from '@shopify/hydrogen';
import { HeroBlogSection } from '~/components/HeroBlog';
import bloghero from '~/assets/images/bloghero.webp';


export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Blogs`}];
};

type BlogNode = {
  title: string;
  handle: string;
  seo?: {
    title?: string;
    description?: string;
  };
  articles: {
    nodes: {
      title: string;
      handle: string;
      tags: string[];
      excerpt?: string;
      image?: {
        url: string;
        altText?: string;
      };
    }[];
  };
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
  ]);

  return {blogs};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();
  const allBlogNodes = blogs.nodes as BlogNode[];

  // Extract all tags from all articles
  const allTags = Array.from(
    new Set(
      allBlogNodes
        .flatMap((blog) => blog.articles?.nodes?.[0]?.tags ?? [])
        .filter((tag) => tag)
    )
  );

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredBlogs = selectedTag
    ? allBlogNodes.filter((blog) =>
        blog.articles?.nodes?.[0]?.tags?.includes(selectedTag)
      )
    : allBlogNodes;

  return (
    <div className="blogs container mx-auto p-8">
      <HeroBlogSection
        image={{
          url: bloghero,
          altText: 'Welcome to our store',
        }}
        />
      <h1 className="text-4xl font-bold mb-8">Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-20">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="w-full text-left py-4 border-b cursor-pointer"
                  style={{borderBottomColor: '#E7E7E7'}}
                >
                  All Categories
                </button>
              </li>
              {allTags.map((tag) => (
                <li key={tag}>
                  <button
                    onClick={() => setSelectedTag(tag)}
                    className="block w-full text-left py-4 border-b cursor-pointer"
                    style={{borderBottomColor: '#E7E7E7'}}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => {
            const article = blog.articles?.nodes?.[0];

            return (
              <div className="blog-card flex flex-col gap-4 justify-between" key={blog.handle}>
                <Link to={`/blogs/${blog.handle}`} prefetch="intent">
                  {article?.image?.url && (
                    <img
                      src={article.image.url}
                      alt={article.image.altText || article.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h2 className="!text-base font-semibold mb-1">{blog.title}</h2>
                </Link>
                {article?.excerpt && (
                  <p className="text-sm mb-2 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                {blog.seo?.description && (
                  <p className="text-gray-600 text-sm mb-2">{blog.seo.description}</p>
                )}
                <Link
                  to={`/blogs/${blog.handle}`}
                  className="font-medium !underline"
                >
                  Read More 
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
        articles(first: 1) {
          nodes {
            title
            handle
            tags
            excerpt
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
` as const;
