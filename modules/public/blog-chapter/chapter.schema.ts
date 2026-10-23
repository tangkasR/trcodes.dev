export type Block =
  | { t: "h" | "p" | "quote" | "code" | "note"; x: string }
  | { t: "ul"; x: string[] };

export type Chapter = {
  slug: string;
  title: string;
  icon: string;
  what: string;
  use: string;
  more: string;
  img: string;
  imgAlt: string;
  content: Block[];
};
