import { useState, useEffect, useCallback } from 'react';

/**
 * BeforeInstallPromptEvent — not in standard TS types.
 * Only fires in Chromium-based browsers (Chrome, Edge, Samsung Internet, Opera).
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isStandalone(): boolean {
  // Check if already running as installed PWA
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true // iOS Safari
  );
}

function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    return Date.now() - ts < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

export type InstallState = 'hidden' | 'available' | 'ios' | 'installed';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<InstallState>('hidden');

  useEffect(() => {
    // Already installed → never show
    if (isStandalone()) {
      setInstallState('installed');
      return;
    }

    // User dismissed recently → stay hidden
    if (wasDismissedRecently()) {
      return;
    }

    // Check iOS Safari (no beforeinstallprompt support)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      // Show iOS-specific instructions after a short delay
      const timer = setTimeout(() => setInstallState('ios'), 3000);
      return () => clearTimeout(timer);
    }

    // Chromium browsers — listen for the event
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent the mini-infobar
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay so the user has time to see the app first
      setTimeout(() => setInstallState('available'), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect if installed after prompt
    const installedHandler = () => {
      setInstallState('installed');
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setInstallState('installed');
      } else {
        // User declined — dismiss for a week
        dismiss();
      }
    } catch {
      // prompt() can throw if already called — safe to ignore
    }
    
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch { /* quota exceeded — ignore */ }
    setInstallState('hidden');
    setDeferredPrompt(null);
  }, []);

  return { installState, promptInstall, dismiss };
}
