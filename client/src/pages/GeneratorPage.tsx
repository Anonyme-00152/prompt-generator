// ============================================================
// NEURAL COMMAND — Generator Page
// Interactive prompt builder with all 5 sections + techniques
// ============================================================

import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PROMPT_SECTIONS, PROMPT_TECHNIQUES, PROMPT_TEMPLATES } from "@/lib/promptData";
import { generatePromptPDF } from "@/lib/pdfGenerator";
import { VariablesPanel } from "@/components/VariablesPanel";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { PlaygroundPanel } from "@/components/PlaygroundPanel";
import { ABTestingPanel } from "@/components/ABTestingPanel";
import { TerminalAnimation } from "@/components/TerminalAnimation";
import { usePromptStore, type Favorite } from "@/store/promptStore";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/prompt-craft-logo-JrRd8EkJxF5PcfPxXC5LKX.webp";

type SectionValues = Record<string, string>;
type ActiveTechniques = Record<string, boolean>;
type VerbosityLevel = 'low' | 'medium' | 'high';

function buildPrompt(
  values: SectionValues,
  techniques: ActiveTechniques,
  verbosity: VerbosityLevel,
  confidenceEnabled: boolean
): string {
  const parts: string[] = [];

  // Contexte first (anchoring technique from Google)
  if (values.contexte?.trim()) {
    parts.push(`<contexte>\n${values.contexte.trim()}\n\nC'est dans ce contexte que ton expertise intervient.\n</contexte>`);
  }

  // Role
  if (values.role?.trim()) {
    parts.push(`<rôle>\n${values.role.trim()}\n</rôle>`);
  }

  // Tache
  if (values.tache?.trim()) {
    parts.push(`<tâche>\n${values.tache.trim()}\n</tâche>`);
  }

  // Format
  if (values.format?.trim()) {
    parts.push(`<format>\n${values.format.trim()}\n</format>`);
  }

  // Build constraints section
  const constraintParts: string[] = [];
  if (values.contraintes?.trim()) {
    constraintParts.push(values.contraintes.trim());
  }

  // Add COV if enabled
  if (techniques.cov) {
    constraintParts.push(`\nChain of Verification (COV) : Avant de donner ta réponse finale, applique rigoureusement la méthode COV en suivant ces étapes internes :\n\nGénération de prédictions : Identifie les solutions standards.\nQuestions de vérification : Pose-toi des questions critiques sur la pertinence et la viabilité.\nExécution de la vérification : Réponds à ces questions en vérifiant la cohérence avec les données du contexte.\nRévision : Corrige ta réponse initiale pour ne garder que les recommandations validées et ultra-pertinentes.`);
  }

  // Add confidence index if enabled
  if (confidenceEnabled) {
    constraintParts.push(`\nIndice de confiance : Pour chaque affirmation clé, évalue ton niveau de confiance :\n• Pratiquement certain (95% et plus)\n• Très confiant (80 à 95%)\n• Moyennement confiant (60 à 80%)\n• Spéculatif (40 à 60%)\n• Faible confiance (moins de 40%)\nJustifie ton niveau de confiance.`);
  }

  if (constraintParts.length > 0) {
    parts.push(`<contraintes>\n${constraintParts.join('\n')}\n</contraintes>`);
  }

  // Add verbosity
  if (verbosity !== 'medium') {
    parts.push(`<verbosité>\nVerbosité : ${verbosity === 'high' ? 'High' : 'Low'}\n</verbosité>`);
  }

  // Add few-shot if enabled
  if (techniques.fewshot && values.fewshot?.trim()) {
    parts.push(`<exemples>\n${values.fewshot.trim()}\n</exemples>`);
  }

  return parts.join('\n\n');
}

function calculateScore(values: SectionValues, techniques: ActiveTechniques, confidenceEnabled: boolean): number {
  let score = 0;
  if (values.role?.trim()) score += 25;
  if (values.tache?.trim()) score += 25;
  if (values.contexte?.trim()) score += 20;
  if (values.format?.trim()) score += 15;
  if (values.contraintes?.trim()) score += 10;
  if (techniques.cov) score += 3;
  if (confidenceEnabled) score += 2;
  if (Object.values(techniques).some(Boolean)) score += 0;
  return Math.min(score, 100);
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#F59E0B' : score >= 50 ? '#38BDF8' : score >= 25 ? '#FB923C' : '#EF4444';
  const label = score >= 80 ? 'Expert' : score >= 50 ? 'Avancé' : score >= 25 ? 'Intermédiaire' : 'Basique';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.25 0.03 240)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="32" fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 32}`}
            strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-syne font-black text-lg" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
    </div>
  );
}

function SectionEditor({
  section,
  value,
  onChange,
  isActive,
  onActivate,
  sectionIndex,
}: {
  section: typeof PROMPT_SECTIONS[0];
  value: string;
  onChange: (v: string) => void;
  isActive: boolean;
  onActivate: () => void;
  sectionIndex: number;
}) {
  const colorMap = {
    amber: {
      border: isActive ? 'border-amber-500/60' : 'border-amber-500/20',
      tag: 'text-amber-400',
      num: 'text-amber-500/30',
      dot: 'bg-amber-400',
      ring: 'focus:ring-amber-500/20',
      badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    },
    sky: {
      border: isActive ? 'border-sky-400/60' : 'border-sky-400/20',
      tag: 'text-sky-400',
      num: 'text-sky-400/30',
      dot: 'bg-sky-400',
      ring: 'focus:ring-sky-400/20',
      badge: 'bg-sky-400/10 border-sky-400/20 text-sky-400',
    },
    green: {
      border: isActive ? 'border-emerald-400/60' : 'border-emerald-400/20',
      tag: 'text-emerald-400',
      num: 'text-emerald-400/30',
      dot: 'bg-emerald-400',
      ring: 'focus:ring-emerald-400/20',
      badge: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
    },
    orange: {
      border: isActive ? 'border-orange-400/60' : 'border-orange-400/20',
      tag: 'text-orange-400',
      num: 'text-orange-400/30',
      dot: 'bg-orange-400',
      ring: 'focus:ring-orange-400/20',
      badge: 'bg-orange-400/10 border-orange-400/20 text-orange-400',
    },
    teal: {
      border: isActive ? 'border-teal-400/60' : 'border-teal-400/20',
      tag: 'text-teal-400',
      num: 'text-teal-400/30',
      dot: 'bg-teal-400',
      ring: 'focus:ring-teal-400/20',
      badge: 'bg-teal-400/10 border-teal-400/20 text-teal-400',
    },
  };
  const c = colorMap[section.color];

  const [showExample, setShowExample] = useState(false);

  return (
    <motion.div
      layout
      className={`rounded-xl border ${c.border} transition-all duration-300 overflow-hidden`}
      style={{ background: 'oklch(0.13 0.022 240)' }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-4 p-5 text-left"
        onClick={onActivate}
        aria-expanded={isActive}
        aria-label={`Éditer la section ${section.label}`}
      >
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-lg border ${c.border} flex items-center justify-center`}
            style={{ background: 'oklch(0.10 0.019 240)' }}>
            <span className={`font-syne font-black text-sm ${c.num.replace('/30', '')}`}>
              0{sectionIndex + 1}
            </span>
          </div>
          {value.trim() && (
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${c.dot} border-2 border-background`} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`nc-tag ${c.tag}`}>&lt;{section.tag}&gt;</span>
            {section.required && (
              <span className={`text-xs px-1.5 py-0.5 rounded border ${c.badge} font-mono`}>requis</span>
            )}
          </div>
          <div className="text-sm text-slate-400 truncate">{section.description}</div>
        </div>

        <div className={`shrink-0 text-slate-500 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}>
          ▾
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Tips */}
              <div className="grid grid-cols-2 gap-2">
                {section.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                    <span className={`mt-0.5 shrink-0 ${c.tag}`}>›</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder={section.placeholder}
                  rows={6}
                  className={`w-full rounded-lg border ${c.border} bg-background/50 text-sm text-foreground placeholder:text-slate-600 p-4 font-mono resize-y focus:outline-none focus:ring-2 ${c.ring} transition-all`}
                  style={{ fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-600 font-mono">
                  {value.length} chars
                </div>
              </div>

              {/* Example toggle */}
              <div>
                <button
                  onClick={() => setShowExample(!showExample)}
                  className={`text-xs ${c.tag} hover:opacity-80 transition-opacity flex items-center gap-1.5`}
                >
                  <span>{showExample ? '▾' : '›'}</span>
                  {showExample ? 'Masquer' : 'Voir'} un exemple
                </button>
                <AnimatePresence>
                  {showExample && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className={`rounded-lg border ${c.border} p-4`}
                        style={{ background: 'oklch(0.10 0.019 240)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs ${c.tag} font-mono`}>Exemple :</span>
                          <button
                            onClick={() => onChange(section.example)}
                            className={`text-xs px-2 py-1 rounded border ${c.badge} hover:opacity-80 transition-opacity`}
                          >
                            Utiliser cet exemple
                          </button>
                        </div>
                        <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                          {section.example}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PromptPreview({ prompt, score }: { prompt: string; score: number }) {
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success('Prompt copié dans le presse-papier !', {
      description: 'Colle-le directement dans ChatGPT, Claude ou Gemini.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExportTxt = () => {
    downloadFile(prompt, "prompt.txt", "text/plain");
    toast.success('Prompt exporté en .txt');
  };

  const handleExportMd = () => {
    const mdContent = `# Prompt Généré via PromptCraft\n\n${prompt}`;
    downloadFile(mdContent, "prompt.md", "text/markdown");
    toast.success('Prompt exporté en .md');
  };

  const handleExportPDF = async () => {
    try {
      await generatePromptPDF(prompt, score, 'prompt.pdf');
      toast.success('Prompt exporté en PDF');
    } catch (error) {
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  const handleCopyWithAnimation = async () => {
    setShowAnimation(true);
    await handleCopy();
    setTimeout(() => setShowAnimation(false), 2000);
  };

  // Syntax highlight the prompt
  const highlighted = prompt
    .replace(/(<\/?)([a-zA-ZÀ-ÿ]+)(>)/g, (match, open, tag, close) => {
      const isClose = open === '</';
      return `<span class="nc-tag${isClose ? '-close' : ''}">${open}${tag}${close}</span>`;
    });

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 overflow-hidden"
      style={{ background: 'oklch(0.11 0.02 240)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs text-slate-500 font-mono ml-2">prompt.xml</span>
        </div>
        <div className="flex items-center gap-3">
          <ScoreGauge score={score} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {prompt ? (
          <div
            className="nc-prompt-content whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-3xl opacity-30">
              ⚡
            </div>
            <div>
              <p className="text-slate-500 text-sm">Ton prompt apparaîtra ici</p>
              <p className="text-slate-600 text-xs mt-1">Remplis au moins le Rôle et la Tâche</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      {prompt && (
        <div className="border-t border-white/5 p-4 flex gap-3">
          <div className="flex flex-col w-full gap-2">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: copied ? 'oklch(0.45 0.15 145)' : 'oklch(0.75 0.18 65)', color: 'oklch(0.09 0.018 240)' }}
              aria-label="Copier le prompt"
            >
              {copied ? '✓ Copié !' : '⎘ Copier le prompt'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleExportTxt}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all duration-200 border border-white/10 hover:bg-white/5"
                aria-label="Exporter en TXT"
              >
                📄 .TXT
              </button>
              <button
                onClick={handleExportMd}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all duration-200 border border-white/10 hover:bg-white/5"
                aria-label="Exporter en Markdown"
              >
                📝 .MD
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all duration-200 border border-white/10 hover:bg-white/5"
                aria-label="Exporter en PDF"
              >
                📕 .PDF
              </button>
            </div>
          </div>
        </div>
      )}
      <TerminalAnimation isActive={showAnimation} prompt={prompt} />
    </div>
  );
}

export default function GeneratorPage() {
  const [, navigate] = useLocation();
  const [values, setValues] = useLocalStorage<SectionValues>('pc-values', {});
  const [activeSection, setActiveSection] = useState<string>('role');
  const [activeTechniques, setActiveTechniques] = useLocalStorage<ActiveTechniques>('pc-techniques', {});
  const [verbosity, setVerbosity] = useLocalStorage<VerbosityLevel>('pc-verbosity', 'medium');
  const [confidenceEnabled, setConfidenceEnabled] = useLocalStorage<boolean>('pc-confidence', false);
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'techniques'>('builder');

  const updateValue = useCallback((id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }));
  }, []);

  const toggleTechnique = useCallback((id: string) => {
    setActiveTechniques(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const prompt = useMemo(() =>
    buildPrompt(values, activeTechniques, verbosity, confidenceEnabled),
    [values, activeTechniques, verbosity, confidenceEnabled]
  );

  const score = useMemo(() =>
    calculateScore(values, activeTechniques, confidenceEnabled),
    [values, activeTechniques, confidenceEnabled]
  );

  const loadTemplate = (templateId: string) => {
    const template = PROMPT_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    setValues({
      role: template.role,
      tache: template.tache,
      contexte: template.contexte,
      format: template.format,
      contraintes: template.contraintes,
    });
    if (template.technique === 'cov') {
      setActiveTechniques(prev => ({ ...prev, cov: true }));
    }
    setActiveTab('builder');
    toast.success(`Template "${template.name}" chargé !`);
  };

  const resetAll = () => {
    setValues({});
    setActiveTechniques({});
    setVerbosity('medium');
    setConfidenceEnabled(false);
    window.localStorage.removeItem('pc-values');
    window.localStorage.removeItem('pc-techniques');
    window.localStorage.removeItem('pc-verbosity');
    window.localStorage.removeItem('pc-confidence');
    toast.info('Générateur réinitialisé');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="shrink-0 border-b border-white/5 z-50 bg-nav-bg"
        style={{ backdropFilter: 'blur(20px)' }} aria-label="Navigation principale">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Retour à l'accueil">
              <img src={LOGO_URL} alt="PromptCraft" className="w-7 h-7 object-contain" />
              <span className="font-syne font-bold text-white hidden md:block">
                Prompt<span className="text-amber-400">Craft</span>
              </span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <span className="text-sm text-slate-400">Générateur</span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg border border-white/10 bg-surface-card">
            {[
              { id: 'builder', label: '⚡ Builder' },
              { id: 'templates', label: '📋 Templates' },
              { id: 'techniques', label: '🔬 Techniques' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-black bg-amber'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={resetAll}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
            aria-label="Réinitialiser tous les champs du générateur"
          >
            Réinitialiser
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex overflow-hidden"
            >
              {/* Left panel - Form */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:max-w-[55%]">
                {/* Section editors */}
                {PROMPT_SECTIONS.map((section, i) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    value={values[section.id] || ''}
                    onChange={v => updateValue(section.id, v)}
                    isActive={activeSection === section.id}
                    onActivate={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                    sectionIndex={i}
                  />
                ))}

                {/* Advanced options */}
                <div className="rounded-xl border border-white/10 overflow-hidden"
                  style={{ background: 'oklch(0.13 0.022 240)' }}>
                  <div className="p-5 border-b border-white/5">
                    <h3 className="font-syne font-bold text-white mb-1">Options Avancées</h3>
                    <p className="text-xs text-slate-500">Astuces secrètes et techniques pro</p>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Verbosity */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            <span className="font-mono text-amber-400 text-xs">&lt;verbosité&gt;</span>
                            Verbosité
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Contrôle la longueur des réponses</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map(v => (
                          <button
                            key={v}
                            onClick={() => setVerbosity(v)}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                              verbosity === v
                                ? 'border-amber-500/60 text-amber-400 bg-amber-500/10'
                                : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400'
                            }`}
                            aria-pressed={verbosity === v}
                            aria-label={`Verbosité ${v}`}
                          >
                            {v === 'low' ? 'Low' : v === 'medium' ? 'Medium' : 'High'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confidence index */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10"
                      style={{ background: 'oklch(0.10 0.019 240)' }}>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <span className="font-mono text-sky-400 text-xs">◎</span>
                          Indice de Confiance
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">L'IA évalue sa certitude pour chaque affirmation</div>
                      </div>
                      <button
                        onClick={() => setConfidenceEnabled(!confidenceEnabled)}
                        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                          confidenceEnabled ? 'bg-sky-400' : 'bg-white/10'
                        }`}
                        aria-pressed={confidenceEnabled}
                        aria-label="Activer l'indice de confiance"
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                          confidenceEnabled ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* COV */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-white/10"
                      style={{ background: 'oklch(0.10 0.019 240)' }}>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <span className="font-mono text-amber-400 text-xs">✓✓</span>
                          Chain of Verification (COV)
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Force l'IA à vérifier son raisonnement avant de répondre</div>
                      </div>
                      <button
                        onClick={() => toggleTechnique('cov')}
                        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                          activeTechniques.cov ? 'bg-amber-400' : 'bg-white/10'
                        }`}
                        aria-pressed={activeTechniques.cov}
                        aria-label="Activer la Chain of Verification (COV)"
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                          activeTechniques.cov ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* Few-shot */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            <span className="font-mono text-emerald-400 text-xs">⋯</span>
                            Few-Shot Prompting
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Ajoute des exemples pour guider le format</div>
                        </div>
                        <button
                          onClick={() => toggleTechnique('fewshot')}
                          className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                            activeTechniques.fewshot ? 'bg-emerald-400' : 'bg-white/10'
                          }`}
                          aria-pressed={activeTechniques.fewshot}
                          aria-label="Activer le Few-Shot Prompting"
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                            activeTechniques.fewshot ? 'left-6' : 'left-1'
                          }`} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {activeTechniques.fewshot && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <textarea
                              value={values.fewshot || ''}
                              onChange={e => updateValue('fewshot', e.target.value)}
                              placeholder={`Exemple 1 :\nInput: ...\nOutput: ...\n\nExemple 2 :\nInput: ...\nOutput: ...`}
                              rows={5}
                              className="w-full rounded-lg border border-emerald-400/20 bg-background/50 text-sm text-foreground placeholder:text-slate-600 p-4 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel - Preview */}
              <div className="hidden md:flex flex-col w-[45%] p-4 md:p-6 border-l border-white/5">
                <PromptPreview prompt={prompt} score={score} />
              </div>
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="font-syne font-black text-3xl text-white mb-2">Templates Prêts à l'emploi</h2>
                <p className="text-slate-400 mb-8">Charge un template pré-configuré et personnalise-le.</p>
                <div className="grid md:grid-cols-2 gap-5">
                  {PROMPT_TEMPLATES.map((template, i) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-xl border border-white/10 p-6 cursor-pointer hover:border-amber-500/40 transition-all duration-300 group"
                      style={{ background: 'oklch(0.13 0.022 240)' }}
                      onClick={() => loadTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{template.category}</div>
                          <h3 className="font-syne font-bold text-white text-lg group-hover:text-amber-400 transition-colors">
                            {template.name}
                          </h3>
                        </div>
                        {template.technique && (
                          <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-mono shrink-0">
                            COV ✓
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{template.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['rôle', 'tâche', 'contexte', 'format', 'contraintes'].map(tag => (
                          <span key={tag} className="text-xs font-mono text-slate-600 bg-white/5 px-2 py-0.5 rounded">
                            &lt;{tag}&gt;
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:gap-3 transition-all">
                        Charger ce template <span>→</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'techniques' && (
            <motion.div
              key="techniques"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="font-syne font-black text-3xl text-white mb-2">Toutes les Techniques</h2>
                <p className="text-slate-400 mb-8">Maîtrise chaque technique pour des prompts d'expert.</p>
                <div className="space-y-5">
                  {PROMPT_TECHNIQUES.map((technique, i) => {
                    const colorMap = {
                      amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                      sky: { border: 'border-sky-400/30', text: 'text-sky-400', bg: 'bg-sky-400/10', badge: 'bg-sky-400/10 border-sky-400/20 text-sky-400' },
                      green: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-400/10', badge: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' },
                    };
                    const c = colorMap[technique.color];
                    return (
                      <motion.div
                        key={technique.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-xl border ${c.border} overflow-hidden`}
                        style={{ background: 'oklch(0.13 0.022 240)' }}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`shrink-0 w-14 h-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center font-mono font-bold text-xl ${c.text}`}>
                              {technique.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-syne font-bold text-white text-xl mb-1">{technique.name}</h3>
                              <p className="text-sm text-slate-400 leading-relaxed">{technique.description}</p>
                            </div>
                          </div>
                          <div className="rounded-lg border border-white/5 p-4 mb-4"
                            style={{ background: 'oklch(0.10 0.019 240)' }}>
                            <div className={`text-xs font-semibold ${c.text} uppercase tracking-wider mb-2`}>Comment l'utiliser :</div>
                            <p className="text-sm text-slate-400 leading-relaxed">{technique.howTo}</p>
                          </div>
                          <div className="rounded-lg border border-white/5 p-4"
                            style={{ background: 'oklch(0.10 0.019 240)' }}>
                            <div className={`text-xs font-semibold ${c.text} uppercase tracking-wider mb-2`}>Exemple :</div>
                            <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                              {technique.example}
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile preview bottom bar */}
      <div className="md:hidden border-t border-white/5 p-4" style={{ background: 'oklch(0.09 0.018 240)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ScoreGauge score={score} />
            <div>
              <div className="text-xs text-slate-400 font-medium">Score du prompt</div>
              <div className="text-xs text-slate-600">{prompt ? `${prompt.length} caractères` : 'Commence à remplir'}</div>
            </div>
          </div>
        </div>
        {prompt && (
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(prompt);
              toast.success('Prompt copié !');
            }}
            className="w-full py-3 rounded-lg font-bold text-sm text-black"
            style={{ background: 'oklch(0.75 0.18 65)' }}
          >
            ⎘ Copier le Prompt
          </button>
        )}
      </div>
    </div>
  );
}
