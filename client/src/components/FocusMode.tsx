import { motion, AnimatePresence } from 'framer-motion';
import { usePromptStore } from '@/store/promptStore';

interface FocusModeProps {
  children: React.ReactNode;
}

export function FocusMode({ children }: FocusModeProps) {
  const { focusMode, setFocusMode } = usePromptStore();

  return (
    <AnimatePresence>
      {focusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-white/5 p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Mode Focus</h2>
            <button
              onClick={() => setFocusMode(false)}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 transition-colors text-sm font-semibold"
              aria-label="Quitter le mode focus"
            >
              ✕ Quitter
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>

          {/* Footer hint */}
          <div className="border-t border-white/5 p-4 text-center text-xs text-slate-500">
            Appuyez sur <kbd className="px-2 py-1 rounded bg-white/10 text-white">Échap</kbd> pour quitter
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
