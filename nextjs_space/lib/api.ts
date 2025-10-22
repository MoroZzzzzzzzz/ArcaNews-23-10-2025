
import { Article, User, Comment, Category, WalletBalance, Transaction } from './types';

// Use HTTPS if window.location.protocol is https: (production), otherwise HTTP
const API_BASE_URL = typeof window !== 'undefined' && window.location.protocol === 'https:'
  ? 'https://91.219.148.29:8000/api/v1'
  : 'http://91.219.148.29:8000/api/v1';

class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    mockData?: T
  ): Promise<T> {
    // Always use mock data if provided (demo mode)
    if (mockData !== undefined) {
      console.log(`Using mock data for ${endpoint}`);
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 300); // Simulate network delay
      });
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      
      // Create basic fallbacks when no mock data is provided
      const basicFallbacks: Record<string, any> = {
        '/categories/': [
          { id: 1, name: "Technology", slug: "tech", articles_count: 89 },
          { id: 2, name: "Blockchain", slug: "blockchain", articles_count: 25 },
        ],
        '/wallet/balance': { balance: 50.0, total_earned: 50.0, total_spent: 0.0 },
        '/wallet/transactions': [],
        '/users/profile': {
          id: 1,
          username: 'demo_user',
          email: 'demo@arcadia-news.com',
          first_name: 'Demo',
          last_name: 'User',
          is_verified: true,
          created_at: new Date().toISOString(),
        },
      };

      // Check for generic endpoints
      for (const [key, value] of Object.entries(basicFallbacks)) {
        if (endpoint.includes(key)) {
          console.log(`Using basic fallback for ${endpoint}`);
          return value as T;
        }
      }
      
      throw error;
    }
  }

  // Authentication
  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    const mockResponse = {
      user: {
        id: Math.random() * 1000,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_verified: true,
        created_at: new Date().toISOString(),
      },
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      wallet: {
        address: '0x' + Math.random().toString(16).substr(2, 8),
        balance: 100.0,
      },
    };

    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, mockResponse);
  }

  async login(email: string, password: string) {
    const mockResponse = {
      user: {
        id: 1,
        username: 'demo_user',
        email: email,
        first_name: 'Demo',
        last_name: 'User',
        is_verified: true,
        created_at: new Date().toISOString(),
      },
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
    };

    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, mockResponse);
  }

  async getProfile(): Promise<User> {
    const mockUser: User = {
      id: 1,
      username: 'demo_user',
      email: 'demo@arcadia-news.com',
      first_name: 'Demo',
      last_name: 'User',
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    return this.request('/users/profile', {}, mockUser);
  }

  // Articles
  async getArticles(params?: {
    page?: number;
    limit?: number;
    language?: string;
    category?: string;
  }): Promise<{ items: Article[]; total: number; page: number; pages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.language) searchParams.set('language', params.language);
    if (params?.category) searchParams.set('category', params.category);

    const mockArticles: Article[] = [
      {
        id: 1,
        title: "Blockchain Technology Revolutionizes Finance",
        content: "The decentralized nature of blockchain technology is transforming the financial industry...",
        summary: "Exploring how blockchain is changing the way we think about money and transactions.",
        language: "en",
        status: "PUBLISHED",
        category: { id: 1, name: "Blockchain", slug: "blockchain", articles_count: 25 },
        author: { id: 1, username: "crypto_expert", email: "expert@example.com", first_name: "Crypto", last_name: "Expert", is_verified: true, created_at: new Date().toISOString() },
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 42,
        dislikes_count: 3,
        comments_count: 15,
        views_count: 1250,
      },
      {
        id: 2,
        title: "AI Breakthrough: New Language Model",
        content: "Researchers announce a major breakthrough in artificial intelligence with the development of a new language model...",
        summary: "Latest AI research shows promising results in natural language processing.",
        language: "en",
        status: "PUBLISHED",
        category: { id: 2, name: "Technology", slug: "tech", articles_count: 89 },
        author: { id: 2, username: "tech_writer", email: "tech@example.com", first_name: "Tech", last_name: "Writer", is_verified: true, created_at: new Date().toISOString() },
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 68,
        dislikes_count: 5,
        comments_count: 23,
        views_count: 2100,
      },
      {
        id: 3,
        title: "Global Economic Outlook 2025",
        content: "Economic analysts predict significant changes in global markets for the upcoming year...",
        summary: "Expert analysis on global economic trends and predictions for 2025.",
        language: "en",
        status: "PUBLISHED",
        category: { id: 3, name: "Economy", slug: "economy", articles_count: 34 },
        author: { id: 3, username: "economist", email: "economy@example.com", first_name: "Economic", last_name: "Analyst", is_verified: true, created_at: new Date().toISOString() },
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 31,
        dislikes_count: 7,
        comments_count: 18,
        views_count: 850,
      },
    ];

    const mockResponse = {
      items: mockArticles,
      total: 3,
      page: 1,
      pages: 1,
      has_next: false,
      has_prev: false,
    };

    const endpoint = `/articles/${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return this.request(endpoint, {}, mockResponse);
  }

  async getArticle(id: number): Promise<Article> {
    const mockArticle: Article = {
      id: id,
      title: "Sample Article: The Future of Technology",
      content: `This is a comprehensive article about the future of technology. 

Technology continues to evolve at an unprecedented pace, transforming every aspect of our lives. From artificial intelligence to blockchain, from quantum computing to biotechnology, we are witnessing innovations that seemed like science fiction just a few decades ago.

The integration of AI into daily workflows has already begun to reshape industries. Companies are leveraging machine learning algorithms to optimize operations, enhance customer experiences, and drive innovation. Meanwhile, blockchain technology promises to revolutionize how we think about trust, transparency, and decentralization.

As we look toward the future, several key trends are emerging:

1. Artificial Intelligence and Machine Learning
AI systems are becoming more sophisticated and accessible, enabling businesses of all sizes to implement intelligent solutions. From predictive analytics to automated customer service, AI is becoming an essential tool for competitive advantage.

2. Blockchain and Decentralized Systems
Beyond cryptocurrency, blockchain technology is finding applications in supply chain management, digital identity verification, and smart contracts. The promise of a decentralized web continues to gain momentum.

3. Quantum Computing
While still in its early stages, quantum computing has the potential to solve complex problems that are currently intractable for classical computers. This could revolutionize fields like cryptography, drug discovery, and financial modeling.

4. Sustainable Technology
Environmental concerns are driving innovation in clean energy, efficient computing, and sustainable manufacturing practices. Green technology is not just an option but a necessity for our future.

The convergence of these technologies will create new possibilities we can barely imagine today. As we navigate this technological revolution, it's crucial to consider not just what we can do, but what we should do to ensure technology serves humanity's best interests.`,
      summary: "An in-depth exploration of emerging technology trends and their potential impact on society.",
      language: "en",
      status: "PUBLISHED",
      category: { id: 2, name: "Technology", slug: "tech", articles_count: 89 },
      author: { id: 1, username: "demo_user", email: "demo@example.com", first_name: "Demo", last_name: "User", is_verified: true, created_at: new Date().toISOString() },
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 156,
      dislikes_count: 12,
      comments_count: 45,
      views_count: 3200,
    };

    return this.request(`/articles/${id}`, {}, mockArticle);
  }

  async createArticle(articleData: {
    title: string;
    content: string;
    language: string;
    status?: string;
    category_id?: number;
  }) {
    const mockResponse = {
      id: Math.floor(Math.random() * 1000) + 100,
      ...articleData,
      author: { id: 1, username: 'demo_user', email: 'demo@example.com', first_name: 'Demo', last_name: 'User', is_verified: true, created_at: new Date().toISOString() },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      dislikes_count: 0,
      comments_count: 0,
      views_count: 0,
    };

    return this.request('/articles/', {
      method: 'POST',
      body: JSON.stringify(articleData),
    }, mockResponse);
  }

  async likeArticle(id: number) {
    const mockResponse = {
      success: true,
      message: 'Article liked successfully',
      likes_count: Math.floor(Math.random() * 100) + 1,
    };

    return this.request(`/articles/${id}/like`, {
      method: 'POST',
    }, mockResponse);
  }

  // Comments
  async getComments(articleId: number): Promise<Comment[]> {
    const mockComments: Comment[] = [
      {
        id: 1,
        content: "Great article! Really insightful analysis on blockchain technology.",
        author: { id: 2, username: "blockchain_fan", email: "fan@example.com", first_name: "Blockchain", last_name: "Fan", is_verified: true, created_at: new Date().toISOString() },
        article_id: articleId,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        content: "I'm curious about the long-term implications of these technologies. Do you think they'll really change everything?",
        author: { id: 3, username: "tech_curious", email: "curious@example.com", first_name: "Tech", last_name: "Curious", is_verified: false, created_at: new Date().toISOString() },
        article_id: articleId,
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 3,
        content: "Thanks for sharing this perspective. The part about sustainable technology really resonated with me.",
        author: { id: 4, username: "green_tech", email: "green@example.com", first_name: "Green", last_name: "Tech", is_verified: true, created_at: new Date().toISOString() },
        article_id: articleId,
        created_at: new Date(Date.now() - 10800000).toISOString(),
      },
    ];

    return this.request(`/comments/article/${articleId}`, {}, mockComments);
  }

  async createComment(articleId: number, content: string, parentId?: number) {
    const mockResponse = {
      id: Math.floor(Math.random() * 1000) + 100,
      content: content,
      author: { id: 1, username: 'demo_user', email: 'demo@example.com', first_name: 'Demo', last_name: 'User', is_verified: true, created_at: new Date().toISOString() },
      article_id: articleId,
      parent_id: parentId || null,
      created_at: new Date().toISOString(),
    };

    return this.request(`/comments/article/${articleId}`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        parent_id: parentId || null,
      }),
    }, mockResponse);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const mockCategories: Category[] = [
      { id: 1, name: "Technology", slug: "tech", articles_count: 89 },
      { id: 2, name: "Blockchain", slug: "blockchain", articles_count: 25 },
      { id: 3, name: "News", slug: "news", articles_count: 156 },
      { id: 4, name: "Politics", slug: "politics", articles_count: 67 },
      { id: 5, name: "Economy", slug: "economy", articles_count: 34 },
    ];

    return this.request('/categories/', {}, mockCategories);
  }

  // Wallet
  async getWalletBalance(): Promise<WalletBalance> {
    const mockBalance: WalletBalance = {
      balance: 87.5,
      total_earned: 125.8,
      total_spent: 38.3,
    };

    return this.request('/wallet/balance', {}, mockBalance);
  }

  async getTransactions(): Promise<Transaction[]> {
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        amount: 0.5,
        type: 'EARNING',
        description: 'Comment on your article',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        earning_type: 'comment',
      },
      {
        id: 2,
        amount: 0.1,
        type: 'EARNING',
        description: 'Like on your article',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        earning_type: 'like',
      },
      {
        id: 3,
        amount: 0.5,
        type: 'SPENDING',
        description: 'Comment posted',
        created_at: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: 4,
        amount: 1.0,
        type: 'SPENDING',
        description: 'Article published',
        created_at: new Date(Date.now() - 345600000).toISOString(),
      },
      {
        id: 5,
        amount: 100.0,
        type: 'EARNING',
        description: 'Welcome bonus',
        created_at: new Date(Date.now() - 604800000).toISOString(),
      },
    ];

    return this.request('/wallet/transactions', {}, mockTransactions);
  }

  // Search
  async searchArticles(query: string, params?: {
    language?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams({ q: query });
    if (params?.language) searchParams.set('language', params.language);
    if (params?.category) searchParams.set('category', params.category);
    
    const mockSearchResults = {
      items: [
        {
          id: 1,
          title: "Blockchain Technology Search Result",
          content: "Search result content...",
          summary: "Matched your search query",
          language: "en",
          status: "PUBLISHED",
          category: { id: 1, name: "Blockchain", slug: "blockchain", articles_count: 25 },
          author: { id: 1, username: "search_author", email: "search@example.com", first_name: "Search", last_name: "Author", is_verified: true, created_at: new Date().toISOString() },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          likes_count: 10,
          dislikes_count: 1,
          comments_count: 5,
          views_count: 200,
        },
      ],
      total: 1,
    };
    
    return this.request(`/search/articles?${searchParams.toString()}`, {}, mockSearchResults);
  }
}

export const apiClient = new ApiClient();
