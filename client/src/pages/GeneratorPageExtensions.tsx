// Extensions pour GeneratorPage - À intégrer dans le rendu principal
// Ces composants doivent être placés dans le panneau droit après PromptPreview

import { VariablesPanel } from '@/components/VariablesPanel';
import { FavoritesPanel } from '@/components/FavoritesPanel';
import { PlaygroundPanel } from '@/components/PlaygroundPanel';
import { ABTestingPanel } from '@/components/ABTestingPanel';
import { type Favorite } from '@/store/promptStore';

interface GeneratorExtensionsProps {
  prompt: string;
  promptB: string;
  score: number;
  scoreB: number;
  values: Record<string, string>;
  techniques: Record<string, boolean>;
  verbosity: 'low' | 'medium' | 'high';
  confidenceEnabled: boolean;
  onLoadFavorite: (favorite: Favorite) => void;
  onGeneratePromptB: () => void;
  onSetFocusMode: (enabled: boolean) => void;
}

export function GeneratorExtensions({
  prompt,
  promptB,
  score,
  scoreB,
  values,
  techniques,
  verbosity,
  confidenceEnabled,
  onLoadFavorite,
  onGeneratePromptB,
  onSetFocusMode,
}: GeneratorExtensionsProps) {
  return (
    <div className="space-y-3 pt-4 border-t border-white/5">
      {/* Focus Mode Button */}
      <button
        onClick={() => onSetFocusMode(true)}
        className="w-full px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 font-semibold text-sm hover:bg-purple-500/30 transition-colors"
        aria-label="Activer le mode focus"
      >
        🎯 Mode Focus
      </button>

      {/* Generate Version B Button */}
      <button
        onClick={onGeneratePromptB}
        className="w-full px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-500/50 text-sky-400 font-semibold text-sm hover:bg-sky-500/30 transition-colors"
        aria-label="Créer une version B pour comparaison"
      >
        🔀 Créer Version B
      </button>

      {/* A/B Testing Panel */}
      {promptB && (
        <ABTestingPanel
          promptA={prompt}
          promptB={promptB}
          scoreA={score}
          scoreB={scoreB}
        />
      )}

      {/* Variables Library */}
      <VariablesPanel />

      {/* Favorites/Projects */}
      <FavoritesPanel
        currentValues={values}
        currentTechniques={techniques}
        currentVerbosity={verbosity}
        currentConfidence={confidenceEnabled}
        onLoadFavorite={onLoadFavorite}
      />

      {/* Playground */}
      <PlaygroundPanel prompt={prompt} />
    </div>
  );
}
