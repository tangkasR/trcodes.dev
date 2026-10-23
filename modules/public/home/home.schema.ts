import type { Chapter } from "@/modules/public/blog-chapter/chapter.schema";

export type Profile = {
  uuid: string;
  fullName: string;
  title: string;
  brand: string;
  contentName: string;
  tagline: string;
  intro: string;
  bio: string;
  photoUrl: string | null;
};

export type Project = {
  slug: string;
  hash: string;
  name: string;
  short: string;
  desc: string;
  can: string[];
  stack: string[];
  demo: { img: string; video: string };
  chHead: string;
  isDefault: boolean;
  chapters: Chapter[];
};
