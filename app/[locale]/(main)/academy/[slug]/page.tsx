import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import {
  getBlogPost,
  getBlogPosts,
  generateBlogMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  BlogPostComponent,
  mdxComponents,
} from '@/features/Blog';
import { StructuredData } from '@/shared/components/SEO/StructuredData';
import { AuthorSchema } from '@/shared/components/SEO/AuthorSchema';
import { routing, type Locale as _Locale } from '@/core/i18n/routing';
import type { Locale as BlogLocale } from '@/features/Blog';

interface AcademyPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Generate static params for all blog posts across all locales
 * Enables static generation at build time for optimal SEO
 *
 * _Requirements: 3.4_
 */
export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  // Generate params for each locale
  for (const locale of routing.locales) {
    const posts = getBlogPosts(locale as BlogLocale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

/**
 * Generate SEO metadata from blog post frontmatter
 *
 * _Requirements: 4.1_
 */
export async function generateMetadata({
  params,
}: AcademyPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale as BlogLocale);

  if (!post) {
    return {
      title: 'Post Not Found | KanaDojo Academy',
      description: 'The requested article could not be found.',
    };
  }

  // Generate base metadata from post
  return generateBlogMetadata(post);
}

/**
 * Rehype Pretty Code configuration for syntax highlighting
 */
const rehypePrettyCodeOptions = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light',
  },
  keepBackground: false,
};

/**
 * Individual Academy Post Page
 * Renders a full blog post with MDX content, structured data,
 * and related posts. Uses static generation for optimal SEO.
 * Now using Tailwind Typography for professional, maintainable styling.
 *
 * _Requirements: 3.1, 3.4, 4.1, 4.2, 4.3_
 */
export default async function AcademyPostPage({
  params,
}: AcademyPostPageProps) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale as BlogLocale);

  if (!post) {
    notFound();
  }

  // Generate structured data schemas
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema(post);

  // Get related posts metadata
  const relatedPostsMeta = post.relatedPosts
    ? getBlogPosts(locale as BlogLocale).filter(p =>
        post.relatedPosts?.includes(p.slug),
      )
    : [];

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />
      <AuthorSchema
        name={post.author || 'KanaDojo Team'}
        url='https://kanadojo.com'
        jobTitle='Japanese Language Education Team'
        affiliation='KanaDojo'
        expertise='Japanese Language Education, Hiragana, Katakana, Kanji, JLPT Preparation'
        description='The KanaDojo team creates free, interactive Japanese learning tools and in-depth educational content to help learners at every level.'
        sameAs={['https://github.com/lingdojo/kanadojo']}
      />

      <BlogPostComponent post={post} relatedPosts={relatedPostsMeta}>
        {/* Tailwind Typography handles all styling automatically */}
        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
              },
            }}
          />
        </div>
      </BlogPostComponent>
    </>
  );
}
