import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "blog", "content");
const SUMMARIES_PATH = path.join(process.cwd(), "data", "blog-summaries.json");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  author: string;
  featured: boolean;
  coverImage: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      tags: data.tags ?? [],
      readTime: data.readTime ?? "",
      author: data.author ?? "",
      featured: data.featured ?? false,
      coverImage: data.coverImage ?? "",
      content,
    };
  });

  // Sort by date descending
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    readTime: data.readTime ?? "",
    author: data.author ?? "",
    featured: data.featured ?? false,
    coverImage: data.coverImage ?? "",
    content,
  };
}

let summariesCache: Record<string, string> | null = null;

export function getBlogSummaries(): Record<string, string> {
  if (summariesCache) return summariesCache;
  try {
    summariesCache = JSON.parse(fs.readFileSync(SUMMARIES_PATH, "utf-8"));
    return summariesCache!;
  } catch {
    return {};
  }
}

export function getBlogSummary(slug: string): string {
  return getBlogSummaries()[slug] || "";
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
