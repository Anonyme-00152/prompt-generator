import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePromptStore } from '@/store/promptStore';

interface ABTestingPanelProps {
  promptA: string;
  promptB: string;
  scoreA: number;
  scoreB: number;
}

export function ABTestingPanel({ promptA, promptB, scoreA, scoreB }: ABTestingPanelProps) {
  const { abTestMode, setAbTestMode } = usePromptStore();

  if (!abTestMode) {
    return (
      <button
        onClick={() => setAbTestMode(true)}
        className="w-full px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/50 text-sky-400 font-semibold text-sm hover:bg-sky-500/30 transition-colors"
        aria-label="Activer le mode comparaison A/B"
      >
        🔀 Mode Comparaison A/B
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-4"
    >
      {/* Prompt A */}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-card">
        <div className="p-4 border-b border-white/5 bg-amber-500/10">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Version A</span>
            <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded">
              {scoreA}/100
            </span>
          </div>
        </div>
        <div className="p-4 h-48 overflow-y-auto">
          <div className="text-sm text-slate-300 whitespace-pre-wrap font-mono text-xs">
            {promptA}
          </div>
        </div>
      </div>

      {/* Prompt B */}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-card">
        <div className="p-4 border-b border-white/5 bg-sky-500/10">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Version B</span>
            <span className="text-xs bg-sky-500 text-black px-2 py-1 rounded">
              {scoreB}/100
            </span>
          </div>
        </div>
        <div className="p-4 h-48 overflow-y-auto">
          <div className="text-sm text-slate-300 whitespace-pre-wrap font-mono text-xs">
            {promptB}
          </div>
        </div>
      </div>

      {/* Close button */}
      <div className="col-span-2">
        <button
          onClick={() => setAbTestMode(false)}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 font-semibold text-sm hover:bg-white/10 transition-colors"
          aria-label="Fermer le mode comparaison"
        >
          ✕ Fermer la comparaison
        </button>
      </div>
    </motion.div>
  );
}
