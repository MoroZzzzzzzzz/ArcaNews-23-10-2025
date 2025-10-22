
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BalanceDisplay } from '@/components/balance-display';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins,
  CreditCard,
  Wallet,
  Bitcoin,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Lock
} from 'lucide-react';
import Link from 'next/link';

const cryptoOptions = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: Bitcoin },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: Wallet },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: Coins },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: CreditCard },
];

export function TopUpPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call for demo
    setTimeout(() => {
      toast({
        title: 'Top-up Initiated',
        description: 'This is a demo. Real crypto integration will be implemented soon.',
      });
      setLoading(false);
      setAmount('');
    }, 2000);
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Top Up Balance
          </h1>
          <p className="text-gray-600">
            Add ACD coins to your wallet to interact with articles
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BalanceDisplay className="justify-start" />
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-green-800 font-semibold">What you can do:</p>
                  <ul className="text-green-600 mt-1 space-y-1">
                    <li>• Like articles (0.1 ACD each)</li>
                    <li>• Post comments (0.5 ACD each)</li>
                    <li>• Publish articles (1 ACD each)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-semibold">You earn when:</p>
                  <ul className="text-blue-600 mt-1 space-y-1">
                    <li>• Your articles get likes</li>
                    <li>• Your articles get comments</li>
                    <li>• Regular engagement bonuses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Up Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div>
                <Label htmlFor="amount">Amount (ACD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <Label>Quick Amounts</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="text-sm"
                    >
                      {quickAmount} ACD
                    </Button>
                  ))}
                </div>
              </div>

              {/* Crypto Selection */}
              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {cryptoOptions.map((crypto) => (
                    <button
                      key={crypto.id}
                      type="button"
                      onClick={() => setSelectedCrypto(crypto.id)}
                      className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-colors ${
                        selectedCrypto === crypto.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <crypto.icon className="h-6 w-6" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{crypto.name}</p>
                        <p className="text-sm text-gray-600">{crypto.symbol}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800">Demo Mode</p>
                    <p className="text-amber-700 text-sm mt-1">
                      This is a demonstration. Real cryptocurrency integration will be implemented 
                      in the production version with secure payment processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleTopUp}
                disabled={loading || !amount}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Secure Top Up
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Secure & Protected</p>
                  <p className="text-gray-600 text-sm mt-1">
                    All transactions are secured with enterprise-grade encryption. 
                    Your funds are protected with multi-signature wallets and cold storage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
