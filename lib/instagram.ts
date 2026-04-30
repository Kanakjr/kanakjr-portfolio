import instagramData from "@/data/instagram.json";

export interface InstagramPost {
  shortcode: string;
  index: number;
  caption: string;
  src: string;
  thumb: string;
  alt: string;
  permalink: string;
  takenAt: string;
}

export interface InstagramReel {
  shortcode: string;
  caption: string;
  title: string;
  video: string;
  thumb: string;
  permalink: string;
  takenAt: string;
}

interface InstagramDataShape {
  fetchedAt: string | null;
  username: string;
  scanned: number;
  posts: InstagramPost[];
  reels: InstagramReel[];
}

// Cast through `unknown` because the empty stub produces literal types
// (e.g. `posts: never[]`) that don't trivially narrow to the runtime shape
// the sync script writes.
const data = instagramData as unknown as InstagramDataShape;

export const instagramUsername: string = data.username;
export const instagramFetchedAt: string | null = data.fetchedAt;
export const instagramPosts: InstagramPost[] = data.posts ?? [];
export const instagramReels: InstagramReel[] = data.reels ?? [];

export const instagramProfileUrl = `https://www.instagram.com/${data.username}/`;
