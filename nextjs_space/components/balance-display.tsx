
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api';
import { WalletBalance } from '@/lib/types';
import { Coins, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface BalanceDisplayProps {
  showTopUpButton?: boolean;
  className?: string;
}

export function BalanceDisplay({ showTopUpButton = false, className = '' }: BalanceDisplayProps) {
  const { data: session } = useSession() || {};
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!session?.accessToken) return;
    
    setLoading(true);
    try {
      apiClient.setToken(session.accessToken);
      const balanceData = await apiClient.getWalletBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchBalance();
    }
  }, [session?.accessToken]);

  if (!session) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <Image
            src="/acd_coin.png"
            alt="ACD Coin"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">Balance</span>
          <span className="font-semibold text-lg">
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>...</span>
              </div>
            ) : (
              `${balance?.balance?.toFixed(1) ?? '0.0'} ACD`
            )}
          </span>
        </div>
      </div>
      
      {showTopUpButton && (
        <Link href="/balance/topup">
          <Button variant="outline" size="sm">
            <Coins className="h-4 w-4 mr-2" />
            Top Up
          </Button>
        </Link>
      )}
    </div>
  );
}
