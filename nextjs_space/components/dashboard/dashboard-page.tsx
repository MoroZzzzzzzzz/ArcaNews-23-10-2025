
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User, Article, WalletBalance, Transaction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BalanceDisplay } from '@/components/balance-display';
import { ArticleCard } from '@/components/articles/article-card';
import { getTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { 
  User as UserIcon, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  History,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [nickname, setNickname] = useState('');
  const [currentLang] = useState('en');
  const [activeTab, setActiveTab] = useState('all');

  const t = (key: string) => getTranslation(key, currentLang);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (session?.accessToken) {
      fetchDashboardData();
    }
  }, [status, session?.accessToken, router]);

  const fetchDashboardData = async () => {
    if (!session?.accessToken) return;

    apiClient.setToken(session.accessToken);
    
    try {
      const [profileData, articlesData, transactionsData] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getArticles({ page: 1, limit: 10 }),
        apiClient.getTransactions(),
      ]);

      setProfile(profileData);
      setNickname(profileData?.username || '');
      setArticles(articlesData?.items || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const userArticles = articles?.filter(article => 
    article?.author?.id === profile?.id
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600">
            Welcome back, {profile?.first_name || 'User'}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nickname">{t('dashboard.nickname')}</Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                  />
                </div>
                <Button 
                  size="sm"
                  onClick={() => {
                    // Update nickname (placeholder implementation)
                    setProfile(prev => prev ? { ...prev, username: nickname } : null);
                    toast({
                      title: 'Success',
                      description: 'Nickname updated successfully',
                    });
                  }}
                >
                  {t('form.save')}
                </Button>
              </CardContent>
            </Card>

            {/* My Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('dashboard.myArticles')}</span>
                  <Link href="/articles/create">
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {t('dashboard.addArticle')}
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userArticles?.length > 0 ? (
                  <div className="space-y-4">
                    {userArticles.map((article) => (
                      <Link 
                        key={article?.id || `user-article-${Math.random()}`}
                        href={`/articles/${article?.id}`}
                        className="block"
                      >
                        <ArticleCard article={article} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <PlusCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No articles yet. Create your first article!</p>
                    <Link href="/articles/create">
                      <Button className="mt-4">
                        {t('dashboard.addArticle')}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.balance')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BalanceDisplay showTopUpButton={true} />
                
                {/* Secret Seed Phrase */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSecret(!showSecret)}
                    className="w-full"
                  >
                    {showSecret ? (
                      <><EyeOff className="h-4 w-4 mr-2" /> Hide {t('dashboard.secret')}</>
                    ) : (
                      <><Eye className="h-4 w-4 mr-2" /> Show {t('dashboard.secret')}</>
                    )}
                  </Button>
                  
                  {showSecret && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <p className="text-yellow-800 mb-2">
                        <strong>Seed Phrase (Keep Secret!):</strong>
                      </p>
                      <code className="text-xs text-yellow-700 break-all">
                        wallet banana apple secure blockchain crypto fortune destiny
                      </code>
                      <p className="text-xs text-yellow-600 mt-2">
                        This is a placeholder. Real seed phrase will be provided by API.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {t('dashboard.paymentHistory')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filter Buttons */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={activeTab === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('all')}
                    className="flex-1"
                  >
                    All
                  </Button>
                  <Button
                    variant={activeTab === 'earned' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('earned')}
                    className="flex-1"
                  >
                    {t('dashboard.earned')}
                  </Button>
                  <Button
                    variant={activeTab === 'spent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('spent')}
                    className="flex-1"
                  >
                    {t('dashboard.spent')}
                  </Button>
                </div>

                {/* Transaction List */}
                <div className="space-y-2">
                  {activeTab === 'all' && (
                    <>
                      {transactions?.length > 0 ? (
                        transactions.slice(0, 10).map((tx) => (
                          <div 
                            key={tx?.id || `tx-${Math.random()}`}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              {tx?.type === 'EARNING' ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">{tx?.description || 'Transaction'}</span>
                            </div>
                            <span className={`text-sm font-semibold ${
                              tx?.type === 'EARNING' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {tx?.type === 'EARNING' ? '+' : '-'}{tx?.amount || 0} ACD
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No transactions yet
                        </p>
                      )}
                    </>
                  )}

                  {activeTab === 'earned' && (
                    <>
                      {transactions?.filter(tx => tx?.type === 'EARNING')?.length > 0 ? (
                        transactions.filter(tx => tx?.type === 'EARNING').slice(0, 10).map((tx) => (
                          <div 
                            key={tx?.id || `tx-${Math.random()}`}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{tx?.description || 'Transaction'}</span>
                            </div>
                            <span className="text-sm font-semibold text-green-600">
                              +{tx?.amount || 0} ACD
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No earnings yet
                        </p>
                      )}
                    </>
                  )}

                  {activeTab === 'spent' && (
                    <>
                      {transactions?.filter(tx => tx?.type === 'SPENDING')?.length > 0 ? (
                        transactions.filter(tx => tx?.type === 'SPENDING').slice(0, 10).map((tx) => (
                          <div 
                            key={tx?.id || `tx-${Math.random()}`}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              <span className="text-sm">{tx?.description || 'Transaction'}</span>
                            </div>
                            <span className="text-sm font-semibold text-red-600">
                              -{tx?.amount || 0} ACD
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No spending yet
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
