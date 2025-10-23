

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { Article, Category } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/articles/article-card';
import { getTranslation } from '@/lib/i18n';
import { Loader2, Newspaper } from 'lucide-react';
import Link from 'next/link';

interface CountryNewsPageProps {
  country: {
    code: string;
    name: string;
    flag: string;
  };
}

export function CountryNewsPage({ country }: CountryNewsPageProps) {
  const { data: session } = useSession() || {};
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentLang] = useState('en');

  const t = (key: string) => getTranslation(key, currentLang);

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, [selectedCategory]);

  useEffect(() => {
    if (session?.accessToken) {
      apiClient.setToken(session.accessToken);
    }
  }, [session?.accessToken]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiClient.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: 1,
        limit: 20,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const articlesData = await apiClient.getArticles(params);
      setArticles(articlesData.items || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{country.flag}</span>
            <div>
              <h1 
                className="text-4xl font-bold text-black tracking-wide"
                style={{
                  fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                }}
              >
                Arcadia News
              </h1>
              <p className="text-xl text-gray-600 mt-1">{country.name}</p>
            </div>
          </div>

          {/* Category List (Horizontal) */}
          <div className="flex items-center gap-3">
            <Newspaper className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                {t('categories.recommended')}
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category?.id || `cat-${Math.random()}`}
                  variant={selectedCategory === category?.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category?.slug || 'all')}
                  className="whitespace-nowrap"
                >
                  {t(`categories.${category?.slug}`) !== `categories.${category?.slug}` 
                    ? t(`categories.${category?.slug}`) 
                    : category?.name || 'Unknown'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">{t('common.loading')}</span>
          </div>
        ) : articles?.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link 
                key={article?.id || `article-${Math.random()}`} 
                href={`/articles/${article?.id}`}
                className="block"
              >
                <ArticleCard article={article} />
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Articles Found</h3>
              <p className="text-gray-500">
                No articles available for {country.name} in the selected category.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
