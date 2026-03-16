import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://kidlearn.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,                    priority: 1.0, changeFrequency: "weekly"  },
    { url: `${BASE}/about`,         priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/pricing`,       priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/blog`,          priority: 0.8, changeFrequency: "weekly"  },
    { url: `${BASE}/contact`,       priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`,       priority: 0.4, changeFrequency: "yearly"  },
    { url: `${BASE}/terms`,         priority: 0.4, changeFrequency: "yearly"  },
    { url: `${BASE}/safety`,        priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/learn/math`,    priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/learn/time`,    priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/learn/speaking`,priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/learn/money`,   priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/learn/words`,   priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/learn/life`,    priority: 0.7, changeFrequency: "monthly" },
  ] as const;

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages.map((p) => ({ url: p.url, lastModified: new Date(), changeFrequency: p.changeFrequency as MetadataRoute.Sitemap[0]["changeFrequency"], priority: p.priority })),
    ...blogPages,
  ];
}
