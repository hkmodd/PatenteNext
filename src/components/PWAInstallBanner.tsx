import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share, Plus } from 'lucide-react';
import { usePWAInstall, InstallState } from '../hooks/usePWAInstall';

/**
 * PWAInstallBanner — a premium-looking install prompt that slides in from the bottom.
 * 
 * - Chromium: "Installa PatenteNext" button → triggers native prompt
 * - iOS Safari: shows manual instructions (Share → Add to Home Screen)
 * - Already installed or dismissed: hidden
 */
export function PWAInstallBanner() {
  const { installState, promptInstall, dismiss } = usePWAInstall();

  const isVisible = installState === 'available' || installState === 'ios';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface/95 backdrop-blur-xl shadow-2xl shadow-black/50">
            {/* Accent glow bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-amber-500 to-accent" />
            
            {/* Dismiss button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 rounded-full text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-4 pt-5">
              {installState === 'available' ? (
                <ChromiumContent onInstall={promptInstall} />
              ) : (
                <IOSContent />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChromiumContent({ onInstall }: { onInstall: () => void }) {
  return (
    <>
      <div className="flex items-start gap-3 pr-6">
        {/* App icon */}
        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center">
          <Download className="w-6 h-6 text-accent" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-sm text-primary leading-tight">
            Installa PatenteNext
          </h3>
          <p className="text-xs text-secondary mt-0.5 leading-snug">
            Accesso rapido, funziona offline. Come un'app vera.
          </p>
        </div>
      </div>

      <button
        onClick={onInstall}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl 
          bg-gradient-to-r from-accent to-accent-hover text-white text-sm font-bold 
          hover:brightness-110 active:scale-[0.98] transition-all duration-150
          shadow-lg shadow-accent/25"
      >
        <Download className="w-4 h-4" />
        INSTALLA ORA
      </button>
    </>
  );
}

function IOSContent() {
  return (
    <>
      <div className="flex items-start gap-3 pr-6">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 flex items-center justify-center">
          <Plus className="w-6 h-6 text-blue-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-sm text-primary leading-tight">
            Aggiungi a Home
          </h3>
          <p className="text-xs text-secondary mt-0.5 leading-snug">
            PatenteNext funziona come un'app nativa. Installala in 2 tap!
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-hover border border-surface-border">
        <span className="text-xs text-secondary leading-snug">
          Premi{' '}
          <span className="inline-flex items-center align-middle mx-0.5">
            <Share className="w-3.5 h-3.5 text-blue-400" />
          </span>
          {' '}in basso, poi{' '}
          <span className="font-bold text-primary">"Aggiungi a Home"</span>
        </span>
      </div>
    </>
  );
}
