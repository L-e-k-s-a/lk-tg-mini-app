// features/max/hooks/useMaxAuth.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Типы для MAX
interface TgUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TgInitData {
  user?: TgUser;
  auth_date?: number;
  hash?: string;
}

interface TgThemeParams {
  bg_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
}

interface TgMainButton {
  show: () => void;
  hide: () => void;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  enable: () => void;
  disable: () => void;
}

interface TgBackButton {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

interface TgWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  MainButton: TgMainButton;
  BackButton: TgBackButton;
  initData: string;
  initDataUnsafe: TgInitData;
  themeParams: TgThemeParams;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
}

// Расширяем глобальный объект Window
declare global {
  interface Window {
    WebApp?: TgWebApp;
  }
}

export const useTgAuth = () => {
  const [tgInitialized, setTgInitialized] = useState(false);
  const [tgUser, setTgUser] = useState<TgUser | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      loadTgScript();
    }
  }, []);

  const loadTgScript = () => {
    // Проверяем, есть ли уже WebApp
    if (window.WebApp) {
      handleTgInit(window.WebApp);
      return;
    }

    // Подключаем скрипт
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js?59';
    script.async = true;

    script.onload = () => {
      console.log('Tg Bridge loaded');
      // Даем время на инициализацию
      setTimeout(() => {
        if (window.WebApp) {
          handleTgInit(window.WebApp);
        }
      }, 100);
    };

    script.onerror = () => {
      console.error('Failed to load Tg Bridge');
    };

    document.head.appendChild(script);
  };

  const handleTgInit = (webApp: TgWebApp) => {
    setTgInitialized(true);

    // Получаем данные пользователя
    const user = webApp.initDataUnsafe?.user;
    if (user) {
      setTgUser(user);
    }

    // Применяем тему
    if (webApp.themeParams) {
      applyTgTheme(webApp.themeParams);
    }

    // Сообщаем о готовности
    webApp.ready();

    console.log('Tg initialized:', user);
  };

  const applyTgTheme = (theme: TgThemeParams) => {
    if (theme.bg_color) {
      document.documentElement.style.setProperty(
        '--max-bg-color',
        theme.bg_color,
      );
    }
    if (theme.text_color) {
      document.documentElement.style.setProperty(
        '--max-text-color',
        theme.text_color,
      );
    }
  };

  return {
    tgInitialized: tgInitialized,
    tgUser: tgUser,
    isTgEnvironment: Platform.OS === 'web' && !!window.WebApp,
  };
};
