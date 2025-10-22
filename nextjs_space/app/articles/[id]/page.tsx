
import { ArticlePage } from '@/components/articles/article-page';

export const dynamic = 'force-dynamic';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default function Article({ params }: ArticlePageProps) {
  const articleId = parseInt(params.id);
  
  if (isNaN(articleId)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Article</h1>
          <p className="text-gray-600">The article ID is not valid.</p>
        </div>
      </div>
    );
  }

  return <ArticlePage articleId={articleId} />;
}
