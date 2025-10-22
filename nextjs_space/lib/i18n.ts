
export const countries: { code: string; name: string; flag: string }[] = [
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
];

export const languages: { [key: string]: string } = {
  en: 'English',
  ru: 'Русский',
  zh: '中文',
  de: 'Deutsch',
  fr: 'Français',
  hi: 'हिन्दी',
  tr: 'Türkçe',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
  sv: 'Svenska',
  ar: 'العربية',
};

export const translations = {
  en: {
    // Navigation
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'nav.addArticle': 'Add Article',
    
    // Home page
    'home.title': 'Arcadia News',
    'home.subtitle': 'Global News from Every Corner of the World',
    'home.selectCountry': 'Select a country to view news',
    
    // Categories
    'categories.recommended': 'Recommended',
    'categories.tech': 'Technology',
    'categories.blockchain': 'Blockchain',
    'categories.news': 'News',
    'categories.politics': 'Politics',
    'categories.economy': 'Economy',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.username': 'Username',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.walletCreated': 'Wallet Created Successfully!',
    'auth.welcome': 'Welcome to Arcadia News!',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.nickname': 'Nickname',
    'dashboard.balance': 'Balance',
    'dashboard.topUpBalance': 'Top Up Balance',
    'dashboard.secret': 'Secret',
    'dashboard.addArticle': 'Add Article',
    'dashboard.myArticles': 'My Articles',
    'dashboard.paymentHistory': 'Payment History',
    'dashboard.earned': 'Earned',
    'dashboard.spent': 'Spent',
    
    // Articles
    'article.likes': 'likes',
    'article.dislikes': 'dislikes',
    'article.comments': 'comments',
    'article.like': 'Like',
    'article.dislike': 'Dislike',
    'article.comment': 'Comment',
    'article.addComment': 'Add Comment',
    'article.cost': 'Cost',
    'article.acd': 'ACD',
    
    // Forms
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.publish': 'Publish',
    'form.title': 'Title',
    'form.content': 'Content',
    'form.category': 'Category',
    'form.country': 'Country',
    'form.images': 'Images',
    'form.video': 'Video',
    
    // Balance
    'balance.insufficient': 'Insufficient balance',
    'balance.topUp': 'Top up your balance to continue',
    'balance.current': 'Current Balance',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
  },
  ru: {
    // Navigation
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.dashboard': 'Личный кабинет',
    'nav.logout': 'Выйти',
    'nav.addArticle': 'Добавить статью',
    
    // Home page
    'home.title': 'Arcadia News',
    'home.subtitle': 'Мировые новости со всех уголков планеты',
    'home.selectCountry': 'Выберите страну для просмотра новостей',
    
    // Categories
    'categories.recommended': 'Рекомендуемое',
    'categories.tech': 'Технологии',
    'categories.blockchain': 'Блокчейн',
    'categories.news': 'Новости',
    'categories.politics': 'Политика',
    'categories.economy': 'Экономика',
    
    // Authentication
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.firstName': 'Имя',
    'auth.lastName': 'Фамилия',
    'auth.username': 'Имя пользователя',
    'auth.loginButton': 'Войти',
    'auth.registerButton': 'Зарегистрироваться',
    'auth.walletCreated': 'Кошелек успешно создан!',
    'auth.welcome': 'Добро пожаловать в Arcadia News!',
    
    // Dashboard
    'dashboard.title': 'Личный кабинет',
    'dashboard.nickname': 'Ник',
    'dashboard.balance': 'Баланс',
    'dashboard.topUpBalance': 'Пополнить баланс',
    'dashboard.secret': 'Секрет',
    'dashboard.addArticle': 'Добавить статью',
    'dashboard.myArticles': 'Мои статьи',
    'dashboard.paymentHistory': 'История платежей',
    'dashboard.earned': 'Заработано',
    'dashboard.spent': 'Потрачено',
    
    // Articles
    'article.likes': 'лайков',
    'article.dislikes': 'дизлайков',
    'article.comments': 'комментариев',
    'article.like': 'Лайк',
    'article.dislike': 'Дизлайк',
    'article.comment': 'Комментарий',
    'article.addComment': 'Добавить комментарий',
    'article.cost': 'Стоимость',
    'article.acd': 'ACD',
    
    // Forms
    'form.submit': 'Отправить',
    'form.cancel': 'Отмена',
    'form.save': 'Сохранить',
    'form.publish': 'Опубликовать',
    'form.title': 'Заголовок',
    'form.content': 'Содержание',
    'form.category': 'Категория',
    'form.country': 'Страна',
    'form.images': 'Изображения',
    'form.video': 'Видео',
    
    // Balance
    'balance.insufficient': 'Недостаточно средств',
    'balance.topUp': 'Пополните баланс для продолжения',
    'balance.current': 'Текущий баланс',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.previous': 'Предыдущая',
  },
  // Add more translations for other languages as needed
};

export const getTranslation = (key: string, lang: string = 'en'): string => {
  const langTranslations = translations[lang as keyof typeof translations] || translations.en;
  return langTranslations[key as keyof typeof langTranslations] || key;
};
