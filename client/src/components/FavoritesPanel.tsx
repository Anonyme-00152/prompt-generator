import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromptStore, type Favorite } from '@/store/promptStore';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

interface FavoritesPanelProps {
  currentValues: Record<string, string>;
  currentTechniques: Record<string, boolean>;
  currentVerbosity: 'low' | 'medium' | 'high';
  currentConfidence: boolean;
  onLoadFavorite?: (favorite: Favorite) => void;
}

export function FavoritesPanel({
  currentValues,
  currentTechniques,
  currentVerbosity,
  currentConfidence,
  onLoadFavorite,
}: FavoritesPanelProps) {
  const { favorites, addFavorite, deleteFavorite } = usePromptStore();
  const [isOpen, setIsOpen] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');

  const handleSaveFavorite = useCallback(() => {
    if (!favoriteName.trim()) {
      toast.error('Donnez un nom à ce favori');
      return;
    }
    addFavorite({
      id: nanoid(),
      name: favoriteName,
      timestamp: Date.now(),
      values: currentValues,
      techniques: currentTechniques,
      verbosity: currentVerbosity,
      confidenceEnabled: currentConfidence,
    });
    setFavoriteName('');
    toast.success(`Favori "${favoriteName}" sauvegardé !`);
  }, [favoriteName, currentValues, currentTechniques, currentVerbosity, currentConfidence, addFavorite]);

  const handleLoadFavorite = (favorite: Favorite) => {
    if (onLoadFavorite) {
      onLoadFavorite(favorite);
      toast.success(`Favori "${favorite.name}" chargé !`);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
        aria-label="Gérer les favoris"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <span className="font-semibold text-white">Mes Projets</span>
          <span className="text-xs text-slate-500 ml-2">({favorites.length})</span>
        </div>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 p-4 space-y-3"
          >
            {/* Save current as favorite */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nom du projet"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm"
                aria-label="Nom du projet à sauvegarder"
              />
              <button
                onClick={handleSaveFavorite}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors"
                aria-label="Sauvegarder le projet actuel"
              >
                💾
              </button>
            </div>

            {/* List of favorites */}
            {favorites.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {favorites.map((favorite) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {favorite.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(favorite.timestamp).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleLoadFavorite(favorite)}
                        className="px-2 py-1 rounded text-xs text-amber-400 hover:bg-amber-500/10 transition-colors"
                        aria-label={`Charger le projet ${favorite.name}`}
                      >
                        📂
                      </button>
                      <button
                        onClick={() => deleteFavorite(favorite.id)}
                        className="px-2 py-1 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                        aria-label={`Supprimer le projet ${favorite.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 text-sm">
                Aucun projet sauvegardé. Créez-en un pour retrouver vos configurations.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
