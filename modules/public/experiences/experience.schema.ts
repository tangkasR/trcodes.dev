export type Experience = {
  slug: string;
  start: string;
  org: string;
  role: string;
  period: string;
  summary: string;
  duties: string[];
  results: string[];
  stack: string[];
};

export type Contact = {
  platform: string;
  icon: string;
  name: string;
  href: string;
  text: string;
};

export type Education = {
  school: string;
  major: string;
  years: string;
};

export type Certification = {
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string | null;
};
