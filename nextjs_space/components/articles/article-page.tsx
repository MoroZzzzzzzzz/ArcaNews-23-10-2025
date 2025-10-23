

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { Article, Comment } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BalanceDisplay } from '@/components/balance-display';
import { getTranslation } from '@/lib/i18n';
import { 
  ThumbsUp, 
  MessageCircle, 
  Send, 
  Loader2,
  User,
  Calendar,
  Eye,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ArticlePageProps {
  articleId: number;
}

export function ArticlePage({ articleId }: ArticlePageProps) {
  const { data: session } = useSession() || {};
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [currentLang] = useState('en');
  const { toast } = useToast();

  const t = (key: string) => getTranslation(key, currentLang);

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [articleId]);

  useEffect(() => {
    if (session?.accessToken) {
      apiClient.setToken(session.accessToken);
    }
  }, [session?.accessToken]);

  const fetchArticle = async () => {
    try {
      const articleData = await apiClient.getArticle(articleId);
      setArticle(articleData);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast({
        title: 'Error',
        description: 'Failed to load article',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsData = await apiClient.getComments(articleId);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    if (!session) {
      toast({
        title: 'Login Required',
        description: 'Please login to like articles',
        variant: 'destructive',
      });
      return;
    }

    setLikeLoading(true);
    try {
      await apiClient.likeArticle(articleId);
      toast({
        title: 'Success',
        description: 'Article liked! 0.1 ACD deducted',
      });
      // Refresh article to get updated like count
      fetchArticle();
    } catch (error) {
      toast({
        title: 'Failed to like',
        description: 'Insufficient balance or network error',
        variant: 'destructive',
      });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async () => {
    if (!session) {
      toast({
        title: 'Login Required',
        description: 'Please login to comment',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please enter a comment',
        variant: 'destructive',
      });
      return;
    }

    setCommentLoading(true);
    try {
      await apiClient.createComment(articleId, newComment.trim());
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment posted! 0.5 ACD deducted',
      });
      // Refresh comments
      fetchComments();
    } catch (error) {
      toast({
        title: 'Failed to comment',
        description: 'Insufficient balance or network error',
        variant: 'destructive',
      });
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading article...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {article?.category && (
              <Badge variant="secondary">{article.category.name}</Badge>
            )}
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDistanceToNow(new Date(article?.created_at || new Date()), { addSuffix: true })}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article?.views_count || 0} views
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article?.title}
          </h1>

          <div className="flex items-center gap-3 text-gray-600">
            <User className="h-4 w-4" />
            <span>By {article?.author?.username || 'Unknown'}</span>
          </div>
        </div>

        {/* Article Image */}
        {article?.image_url && (
          <div className="mb-8">
            <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
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
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <div 
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: article?.content?.replace(/\n/g, '<br>') || 'No content available' 
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Article Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    disabled={likeLoading || !session}
                    className="flex items-center gap-2"
                  >
                    {likeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    {article?.likes_count || 0}
                  </Button>
                  <span className="text-xs text-gray-500">0.1 ACD</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    {comments?.length || 0}
                  </span>
                </div>
              </div>

              {session && <BalanceDisplay />}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({comments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Comment */}
            {session ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Write your comment... (0.5 ACD)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Cost: 0.5 ACD per comment
                  </span>
                  <Button
                    onClick={handleComment}
                    disabled={commentLoading || !newComment.trim()}
                  >
                    {commentLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-3">Please login to post comments</p>
                <Link href="/auth/login">
                  <Button>Login</Button>
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments?.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div 
                    key={comment?.id || `comment-${Math.random()}`} 
                    className="border-l-4 border-blue-100 pl-4 py-3 bg-gray-50 rounded-r-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">
                        {comment?.author?.username || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {comment?.created_at 
                          ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
                          : 'Unknown time'}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {comment?.content || 'No content'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
