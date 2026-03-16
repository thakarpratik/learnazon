import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.publishedAt },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  // Convert markdown-ish content to paragraphs
  const sections = post.content.trim().split("\n\n").map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="font-fredoka text-2xl font-bold text-gray-900 mt-10 mb-4">{trimmed.replace("## ", "")}</h2>;
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return <p key={i} className="font-bold text-gray-800 mt-4 mb-2">{trimmed.replace(/\*\*/g, "")}</p>;
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return <ul key={i} className="list-disc list-inside space-y-1 text-gray-600 ml-2 my-3">{items.map((item, j) => <li key={j}>{item.replace("- ", "")}</li>)}</ul>;
    }
    return <p key={i} className="text-gray-600 leading-relaxed my-3">{trimmed}</p>;
  });

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        {/* Hero */}
        <div className={`bg-gradient-to-br ${post.gradient} py-16`}>
          <div className="section-container max-w-3xl text-center text-white">
            <div className="text-7xl mb-4">{post.emoji}</div>
            <span className="inline-block bg-white/20 text-white font-bold text-sm rounded-full px-4 py-1 mb-4">{post.category}</span>
            <h1 className="font-fredoka text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
            <p className="text-white/80 text-sm">{post.publishedAt} · {post.readTime} min read</p>
          </div>
        </div>

        {/* Content */}
        <div className="section-container max-w-2xl py-12">
          <p className="text-xl text-gray-500 leading-relaxed mb-8 font-medium border-l-4 border-orange-300 pl-4">
            {post.excerpt}
          </p>
          <article className="prose-custom">{sections}</article>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-100 text-center">
            <p className="font-fredoka text-2xl font-bold text-gray-800 mb-2">Try it with KidLearn</p>
            <p className="text-gray-500 mb-6 text-sm">Practice {post.category.toLowerCase()} interactively — free for children aged 5–10.</p>
            <Link href="/signup" className="btn-primary">Start Free →</Link>
          </div>

          {/* Back */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link href="/blog" className="text-orange-500 font-bold hover:underline">← Back to all posts</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
