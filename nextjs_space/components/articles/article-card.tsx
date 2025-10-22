
'use client';

import { Article } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, MessageCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="card-hover cursor-pointer">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Article Image */}
          {article?.image_url && (
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article?.title || 'Article image'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {article?.title || 'Untitled Article'}
              </h3>
              {article?.category && (
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  {article.category.name}
                </Badge>
              )}
            </div>

            {article?.summary && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {article.summary}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {article?.likes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4" />
                  {article?.dislikes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {article?.comments_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article?.views_count || 0}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>by {article?.author?.username || 'Unknown'}</span>
                <span>•</span>
                <span>
                  {article?.created_at 
                    ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true })
                    : 'Unknown time'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
