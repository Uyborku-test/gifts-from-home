// Telegram WebApp utilities

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        expand: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        colorScheme: 'light' | 'dark';
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export const TelegramUtils = {
  isAvailable: (): boolean => {
    return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  },

  init: (): void => {
    if (TelegramUtils.isAvailable()) {
      window.Telegram!.WebApp.ready();
      window.Telegram!.WebApp.expand();
    }
  },

  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light'): void => {
    if (TelegramUtils.isAvailable()) {
      try {
        window.Telegram!.WebApp.HapticFeedback.impactOccurred(type);
      } catch (e) {
        // Haptic feedback not supported
      }
    }
  },

  hapticNotification: (type: 'error' | 'success' | 'warning'): void => {
    if (TelegramUtils.isAvailable()) {
      try {
        window.Telegram!.WebApp.HapticFeedback.notificationOccurred(type);
      } catch (e) {
        // Haptic feedback not supported
      }
    }
  },

  hapticSelection: (): void => {
    if (TelegramUtils.isAvailable()) {
      try {
        window.Telegram!.WebApp.HapticFeedback.selectionChanged();
      } catch (e) {
        // Haptic feedback not supported
      }
    }
  },

  close: (): void => {
    if (TelegramUtils.isAvailable()) {
      window.Telegram!.WebApp.close();
    }
  },

  getUser: () => {
    if (TelegramUtils.isAvailable()) {
      return window.Telegram!.WebApp.initDataUnsafe.user;
    }
    return null;
  },

  getColorScheme: (): 'light' | 'dark' => {
    if (TelegramUtils.isAvailable()) {
      return window.Telegram!.WebApp.colorScheme;
    }
    return 'light';
  },
};

export default TelegramUtils;
