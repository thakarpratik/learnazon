import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Learning Tips for Parents",
  description: "Expert tips and guides for parents on teaching kids math, time-telling, spelling, public speaking and more. Age 5–10 learning resources.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pt-24 pb-20">
        <div className="section-container max-w-4xl">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange-100 text-orange-700 font-bold text-sm rounded-full px-4 py-2 mb-4 border border-orange-200">
              📚 Learning Resources
            </span>
            <h1 className="font-fredoka text-5xl font-bold text-gray-900 mb-4">Flinchi Blog</h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              Tips, guides, and ideas to help parents support learning at home.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="card border border-orange-100 overflow-hidden group hover:shadow-hover transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                  <span className="text-7xl">{post.emoji}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.readTime} min read</span>
                  </div>
                  <h2 className="font-fredoka text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-orange-500 font-bold text-sm hover:underline">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
