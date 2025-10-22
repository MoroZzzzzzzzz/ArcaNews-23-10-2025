
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { useState } from 'react';
import { getTranslation } from '@/lib/i18n';
import { User, LogOut, PlusCircle } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession() || {};
  const [currentLang, setCurrentLang] = useState('en');

  const t = (key: string) => getTranslation(key, currentLang);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-black tracking-wide">
              Arcadia News
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
            />

            {status === 'loading' ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : session ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <Link href="/articles/create">
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t('nav.addArticle')}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
