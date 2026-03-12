import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromptStore } from '@/store/promptStore';
import { toast } from 'sonner';

interface PlaygroundPanelProps {
  prompt: string;
}

export function PlaygroundPanel({ prompt }: PlaygroundPanelProps) {
  const {
    playground,
    setPlaygroundApiKey,
    setPlaygroundProvider,
    setPlaygroundLoading,
    setPlaygroundResponse,
    setPlaygroundError,
  } = usePromptStore();

  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [tempApiKey, setTempApiKey] = useState(playground.apiKey);

  const handleTestPrompt = async () => {
    if (!tempApiKey.trim()) {
      toast.error('Veuillez entrer votre clé API');
      return;
    }

    if (!userMessage.trim()) {
      toast.error('Entrez un message à tester');
      return;
    }

    setPlaygroundApiKey(tempApiKey);
    setPlaygroundLoading(true);
    setPlaygroundError(null);

    try {
      const response = await fetch('/api/test-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: tempApiKey,
          provider: playground.provider,
          systemPrompt: prompt,
          userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'appel API');
      }

      const data = await response.json();
      setPlaygroundResponse(data.response);
      toast.success('Réponse reçue !');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      setPlaygroundError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
        aria-label="Ouvrir le Playground"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">▶️</span>
          <span className="font-semibold text-white">Playground IA</span>
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
            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Clé API (sécurisée localement)
              </label>
              <input
                type="password"
                placeholder="sk-... ou claude-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm"
                aria-label="Clé API"
              />
            </div>

            {/* Provider Selection */}
            <div className="flex gap-2">
              <button
                onClick={() => setPlaygroundProvider('openai')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  playground.provider === 'openai'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                }`}
                aria-pressed={playground.provider === 'openai'}
                aria-label="Utiliser OpenAI"
              >
                OpenAI
              </button>
              <button
                onClick={() => setPlaygroundProvider('anthropic')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  playground.provider === 'anthropic'
                    ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:border-white/20'
                }`}
                aria-pressed={playground.provider === 'anthropic'}
                aria-label="Utiliser Anthropic"
              >
                Anthropic
              </button>
            </div>

            {/* User Message */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Message de test
              </label>
              <textarea
                placeholder="Entrez un message pour tester votre prompt..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm resize-none h-20"
                aria-label="Message de test"
              />
            </div>

            {/* Test Button */}
            <button
              onClick={handleTestPrompt}
              disabled={playground.isLoading}
              className="w-full px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold text-sm transition-colors"
              aria-label="Tester le prompt"
            >
              {playground.isLoading ? '⏳ Test en cours...' : '🚀 Tester'}
            </button>

            {/* Response Display */}
            {playground.response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <div className="text-xs font-semibold text-green-400 mb-2">Réponse :</div>
                <div className="text-sm text-slate-300 whitespace-pre-wrap">
                  {playground.response}
                </div>
              </motion.div>
            )}

            {playground.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <div className="text-xs font-semibold text-red-400 mb-2">Erreur :</div>
                <div className="text-sm text-slate-300">{playground.error}</div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
