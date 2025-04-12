// src/types/content.ts
export interface Content {
    id: string;
    title: string;
    content: string; // Rich text content in HTML format
    excerpt: string;
    featuredImage?: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    tags: string[];
    category: string;
    views?: number;
  }
  
  export interface ContentFormData {
    title: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    status: 'draft' | 'published' | 'archived';
    tags: string[];
    category: string;
    seo?: SeoData;
  }
  
  export interface ContentListItem {
    id: string;
    title: string;
    excerpt: string;
    featuredImage?: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: string;
    updatedAt: string;
    authorName: string;
    category: string;
    views?: number;
  }
  
  export type ContentFilter = {
    search?: string;
    status?: 'draft' | 'published' | 'archived' | 'all';
    category?: string;
    tag?: string;
    dateRange?: {
      from: string;
      to: string;
    };
  };
  
  export interface SeoData {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    canonicalUrl: string;
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphImage: string;
    twitterCardType: 'summary' | 'summary_large_image';
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    noIndex: boolean;
    noFollow: boolean;
  }