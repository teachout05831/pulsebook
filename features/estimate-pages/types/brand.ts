import type { BrandTone } from "./core";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BrandKit {
  id: string;
  companyId: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headingFont: string | null;
  heroImageUrl: string | null;
  companyPhotos: string[];
  videoIntroUrl: string | null;
  companyDescription: string | null;
  tagline: string | null;
  defaultTerms: string | null;
  defaultFaq: FaqItem[];
  tone: BrandTone;
  googleReviewsUrl: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  certifications: string[];
  insuranceInfo: string | null;
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKitInput {
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  headingFont?: string | null;
  heroImageUrl?: string | null;
  companyPhotos?: string[];
  videoIntroUrl?: string | null;
  companyDescription?: string | null;
  tagline?: string | null;
  defaultTerms?: string | null;
  defaultFaq?: FaqItem[];
  tone?: BrandTone;
  googleReviewsUrl?: string | null;
  googleRating?: number | null;
  googleReviewCount?: number | null;
  certifications?: string[];
  insuranceInfo?: string | null;
  socialLinks?: SocialLinks;
}
