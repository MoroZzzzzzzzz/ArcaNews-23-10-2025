
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  avatar?: string;
  created_at: string;
  role?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  language: string;
  status: 'PUBLISHED' | 'DRAFT';
  category?: Category;
  author: User;
  created_at: string;
  updated_at: string;
  image_url?: string;
  video_url?: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  views_count: number;
  tags?: string[];
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  article_id: number;
  parent_id?: number;
  created_at: string;
  replies?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  articles_count: number;
}

export interface WalletBalance {
  balance: number;
  total_earned: number;
  total_spent: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'EARNING' | 'SPENDING';
  description: string;
  created_at: string;
  earning_type?: 'like' | 'comment' | 'article';
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  languages: string[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
