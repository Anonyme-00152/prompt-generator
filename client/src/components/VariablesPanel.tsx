import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromptStore } from '@/store/promptStore';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

export function VariablesPanel() {
  const { variables, addVariable, updateVariable, deleteVariable } = usePromptStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const handleAddVariable = () => {
    if (!newVarName.trim() || !newVarValue.trim()) {
      toast.error('Remplissez le nom et la valeur');
      return;
    }
    addVariable({
      id: nanoid(),
      name: newVarName,
      value: newVarValue,
    });
    setNewVarName('');
    setNewVarValue('');
    toast.success('Variable ajoutée !');
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
        aria-label="Gérer les variables"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📦</span>
          <span className="font-semibold text-white">Bibliothèque de Variables</span>
          <span className="text-xs text-slate-500 ml-2">({variables.length})</span>
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
            {/* Add new variable */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nom (ex: NOM_PRODUIT)"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm"
                  aria-label="Nom de la variable"
                />
                <input
                  type="text"
                  placeholder="Valeur"
                  value={newVarValue}
                  onChange={(e) => setNewVarValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm"
                  aria-label="Valeur de la variable"
                />
                <button
                  onClick={handleAddVariable}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm transition-colors"
                  aria-label="Ajouter une variable"
                >
                  +
                </button>
              </div>
            </div>

            {/* List of variables */}
            {variables.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {variables.map((variable) => (
                  <motion.div
                    key={variable.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-amber-400">
                        {`{{${variable.name}}}`}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {variable.value}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteVariable(variable.id)}
                      className="ml-2 px-2 py-1 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label={`Supprimer la variable ${variable.name}`}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 text-sm">
                Aucune variable. Créez-en une pour injecter des valeurs dynamiques.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
