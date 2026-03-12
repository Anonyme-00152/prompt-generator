/* ============================================================
   NEURAL COMMAND — Improve Prompt Page
   Analyzes existing prompts and provides optimization suggestions
   ============================================================ */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Zap, Copy, RotateCcw, Lightbulb } from 'lucide-react';
import { analyzePrompt, getSeverityColor, getSeverityIcon, type PromptAnalysisResult } from '@/lib/promptAnalyzer';
import { toast } from 'sonner';
import { Link } from 'wouter';

export default function ImprovePromptPage() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-analyze on input change
  useEffect(() => {
    if (inputPrompt.trim().length > 0) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const result = analyzePrompt(inputPrompt);
        setAnalysis(result);
        setIsAnalyzing(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
    }
  }, [inputPrompt]);

  const handleReset = () => {
    setInputPrompt('');
    setAnalysis(null);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(inputPrompt);
    toast.success('Prompt copié !');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basique': return 'destructive';
      case 'intermédiaire': return 'orange';
      case 'avancé': return 'sky';
      case 'expert': return 'amber';
      default: return 'secondary';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'basique': return 'Basique';
      case 'intermédiaire': return 'Intermédiaire';
      case 'avancé': return 'Avancé';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
              <span className="text-amber-500">⚡</span> PromptCraft
            </a>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/generator">
              <a className="text-sm hover:text-amber-500 transition">Générateur</a>
            </Link>
            <Link href="/techniques">
              <a className="text-sm hover:text-amber-500 transition">Techniques</a>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/5">
            <span className="text-xs font-mono text-amber-500 uppercase tracking-wider">🔍 Analyse Intelligente</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Améliore ton <span className="text-amber-500">Prompt</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Colle ton prompt existant et reçois des suggestions d'optimisation basées sur les 5 règles d'or du prompt engineering.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="nc-surface p-6 h-full flex flex-col">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-amber-500">📝</span> Ton Prompt
              </h2>
              <Textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Colle ton prompt ici... Exemple : 'Tu es un expert en marketing. Crée une stratégie de contenu...'"
                className="flex-1 min-h-64 resize-none font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleCopyPrompt}
                  disabled={!inputPrompt}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copier
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={!inputPrompt}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Réinitialiser
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Analysis Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {analysis ? (
              <div className="space-y-6">
                {/* Score Card */}
                <Card className="nc-surface-elevated p-6 border-amber-500/20">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-sm font-mono text-amber-500 uppercase tracking-wider mb-2">Score d'Optimisation</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-amber-500">{analysis.score}</span>
                        <span className="text-2xl text-muted-foreground">/100</span>
                      </div>
                    </div>
                    <Badge variant={getLevelColor(analysis.level) as any} className="text-lg px-4 py-2">
                      {getLevelLabel(analysis.level)}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.score}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-500 to-sky-500"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mots</p>
                      <p className="text-lg font-bold">{analysis.wordCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Éléments</p>
                      <p className="text-lg font-bold">
                        {[analysis.hasRole, analysis.hasTache, analysis.hasContexte, analysis.hasFormat, analysis.hasContraintes].filter(Boolean).length}/5
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <Card className="nc-surface p-6 border-green-500/20">
                    <h3 className="text-sm font-mono text-green-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Points Forts
                    </h3>
                    <div className="space-y-2">
                      {analysis.strengths.map((strength, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm text-foreground/80"
                        >
                          {strength}
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-mono text-amber-500 uppercase tracking-wider flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Suggestions d'Optimisation
                    </h3>
                    {analysis.suggestions.map((suggestion, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className={`nc-surface p-4 border-l-4 border-${getSeverityColor(suggestion.severity)}`}>
                          <div className="flex gap-3">
                            <div className="text-2xl flex-shrink-0 mt-1">
                              {getSeverityIcon(suggestion.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-bold text-sm">{suggestion.rule}</h4>
                                <Badge
                                  variant={getSeverityColor(suggestion.severity) as any}
                                  className="text-xs flex-shrink-0"
                                >
                                  {suggestion.severity === 'critical' ? 'Critique' : suggestion.severity === 'warning' ? 'Important' : 'Conseil'}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground/80 mb-3">{suggestion.message}</p>
                              <div className="bg-background/50 rounded p-3 mb-3 border border-border/50">
                                <p className="text-sm font-mono text-sky-400">{suggestion.suggestion}</p>
                              </div>
                              {suggestion.example && (
                                <div className="bg-background/50 rounded p-3 border border-border/50">
                                  <p className="text-xs text-muted-foreground mb-1">Exemple :</p>
                                  <p className="text-xs font-mono text-amber-500/80">{suggestion.example}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* No suggestions */}
                {analysis.suggestions.length === 0 && (
                  <Card className="nc-surface p-6 border-green-500/20 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Prompt Excellent ! 🎉</h3>
                    <p className="text-sm text-muted-foreground">
                      Ton prompt suit toutes les meilleures pratiques. Tu es prêt à l'utiliser !
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="nc-surface p-12 text-center h-full flex flex-col items-center justify-center">
                <Zap className="w-16 h-16 text-amber-500/30 mb-4" />
                <h3 className="text-lg font-bold mb-2">Commence l'analyse</h3>
                <p className="text-muted-foreground">
                  Colle un prompt à gauche pour voir les suggestions d'optimisation en temps réel.
                </p>
              </Card>
            )}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-12 border-t border-border/50"
        >
          <h2 className="text-2xl font-bold mb-4">Prêt à créer un prompt parfait ?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Utilise le générateur interactif pour construire un prompt de A à Z en suivant les 5 règles d'or.
          </p>
          <Link href="/generator">
            <a>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-background">
                ⚡ Aller au Générateur
              </Button>
            </a>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
