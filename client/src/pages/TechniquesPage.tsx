// ============================================================
// NEURAL COMMAND — Techniques Page
// Full guide to all prompt engineering techniques
// ============================================================

import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PROMPT_SECTIONS, PROMPT_TECHNIQUES } from "@/lib/promptData";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/prompt-craft-logo-JrRd8EkJxF5PcfPxXC5LKX.webp";
const NEURAL_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/neural-network-bg-GP8fqbuDQbBfR42BMtrq5x.webp";

const REVERSE_PROMPTING_EXAMPLES = [
  {
    title: "Version 1 — Objectif simple",
    prompt: `Je veux créer une stratégie de lancement complète pour un podcast innovant dédié au bien-être mental des jeunes professionnels dans le monde de l'entreprise en 2025.

Rédige le prompt optimal qui générerait le meilleur résultat possible pour cette tâche, en suivant les meilleures pratiques du prompt engineering. Ensuite, exécute ce prompt et montre-moi la réponse finale.`,
    badge: "Reverse Prompting v1"
  },
  {
    title: "Version 2 — Amélioration d'un prompt existant",
    prompt: `J'ai essayé ce prompt : "Évalue la viabilité du lancement d'un chatbot de service client automatisé, identifie 3 freins à l'adoption et propose un plan pour maximiser le taux de conversion.", mais le résultat n'était pas génial.

Peux-tu analyser mon prompt initial et l'améliorer pour obtenir de meilleurs résultats ?`,
    badge: "Reverse Prompting v2"
  }
];

const GOLDEN_RULES_FULL = [
  {
    number: "01",
    title: "Le Rôle",
    subtitle: "Qui est l'IA ?",
    color: "amber",
    description: "Définir précisément le rôle de l'IA est la première règle d'or. Plus le rôle est spécifique, plus la réponse sera adaptée et experte. Il faut préciser l'expertise, le public cible et le style de communication.",
    structure: [
      { label: "Titre du rôle", desc: "Ex: RSSI, Chef de projet, Analyste financier senior" },
      { label: "Public cible", desc: "Qui va lire la réponse ? Quel est son niveau ?" },
      { label: "Style de communication", desc: "Formel, vulgarisé, technique, institutionnel..." },
    ],
    badExample: "Tu es un assistant.",
    goodExample: `Tu es un Responsable de la Sécurité des Systèmes d'Information (RSSI) et Expert en éthique algorithmique.

Ton public : Le Comité de Direction d'une banque internationale. Ils ont une vision stratégique mais ne sont pas des experts techniques.

Style de communication : Institutionnel, direct et rassurant. Transforme les risques techniques en enjeux de responsabilité civile et financière.`,
  },
  {
    number: "02",
    title: "La Tâche",
    subtitle: "Que doit faire l'IA ?",
    color: "sky",
    description: "La tâche est le cœur du prompt. Elle doit commencer par un verbe d'action fort et lister des exigences clés précises. Un prompt basique donne une tâche vague ; un prompt expert détaille chaque exigence.",
    structure: [
      { label: "Verbe d'action", desc: "Rédiger, Analyser, Créer, Concevoir, Évaluer..." },
      { label: "Objectif spécifique", desc: "Avec des métriques quand c'est possible" },
      { label: "Exigences clés", desc: "Liste des points obligatoires à couvrir" },
    ],
    badExample: `<tâche>
Rédiger une Note de Cadrage Stratégique sur l'adoption de l'IA dans le secteur bancaire
</tâche>`,
    goodExample: `<tâche>
Rédiger une note de cadrage stratégique exhaustive pour l'intégration de l'IA au sein d'une institution bancaire de détail.

Exigences clés :
- Analyse des cas d'usage : Front Office, Middle Office, Back Office
- Gouvernance et Conformité : AI Act européen
- Évaluation des risques et ROI : indicateurs à 3 ans
</tâche>`,
  },
  {
    number: "03",
    title: "Le Contexte",
    subtitle: "L'ancrage de l'information",
    color: "green",
    description: "Le contexte doit être placé EN HAUT du prompt pour l'ancrer (technique recommandée par Google). Ajoute une phrase de transition pour relier le contexte à la tâche. Plus le contexte est riche, plus la réponse sera personnalisée.",
    structure: [
      { label: "Données factuelles", desc: "Chiffres, tailles, budgets, délais..." },
      { label: "Contraintes spécifiques", desc: "Legacy, budget limité, équipe réduite..." },
      { label: "Phrase de transition", desc: "Relie le contexte à la tâche principale" },
    ],
    badExample: "(Aucun contexte fourni — l'IA répond de manière générique)",
    goodExample: `<contexte>
Entreprise : Banque historique (15 000 employés) avec un système informatique "Legacy" complexe.

Social : Forte appréhension des salariés. Objectif : l'humain augmenté, pas le remplacement.

Objectifs : Réduction des coûts de 15% en 3 ans, accélération du Time-to-Market.

C'est dans ce climat de transformation majeure que ton expertise intervient.
</contexte>`,
  },
  {
    number: "04",
    title: "Le Format",
    subtitle: "La structure de la réponse",
    color: "orange",
    description: "L'IA s'attache énormément à ce que tu mets dans le format. Précise le type de document, la longueur, et la structure exacte avec les titres de sections. La réponse respectera fidèlement ces contraintes.",
    structure: [
      { label: "Type de format", desc: "Markdown, JSON, tableau, email, rapport..." },
      { label: "Longueur", desc: "Nombre de mots, de sections, de lignes..." },
      { label: "Structure", desc: "Titres des sections dans l'ordre attendu" },
    ],
    badExample: "(Aucun format spécifié — l'IA choisit elle-même)",
    goodExample: `<format>
Format : Note de cadrage en Markdown avec tableaux et listes.
Longueur : 400 à 600 mots avec résumé exécutif de 10 lignes max.
Structure :
1. Résumé Exécutif
2. Vision Stratégique
3. Matrice des Cas d'Usage (tableau)
4. Conformité et Éthique
5. Analyse Risques
6. KPIs (tableau prévisionnel triennal)
</format>`,
  },
  {
    number: "05",
    title: "Les Contraintes",
    subtitle: "Les règles du jeu",
    color: "teal",
    description: "Les contraintes définissent ce que l'IA DOIT faire et ce qu'elle NE DOIT PAS faire. Elles incluent les exigences de style, les limitations et les frontières à ne pas franchir. Essentielles pour éviter les réponses hors-sujet.",
    structure: [
      { label: "Ce qu'il faut faire", desc: "Priorités, approches obligatoires..." },
      { label: "Exigences de style", desc: "Ton, vocabulaire, niveau de détail..." },
      { label: "Interdictions", desc: "Ce que l'IA ne doit jamais mentionner" },
    ],
    badExample: "(Aucune contrainte — l'IA peut partir dans n'importe quelle direction)",
    goodExample: `<contraintes>
À faire : Note ComEx avec Exec Summary + recommandations.
Style : Ton formel et décisionnel. Remplacer le jargon technique par des analogies business.
Interdictions : Ne jamais mentionner "suppressions de postes" ou "solutions magiques".
</contraintes>`,
  },
];

function RuleSection({ rule, index }: { rule: typeof GOLDEN_RULES_FULL[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colorMap = {
    amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10', num: 'text-amber-500/15' },
    sky: { border: 'border-sky-400/30', text: 'text-sky-400', bg: 'bg-sky-400/10', num: 'text-sky-400/15' },
    green: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-400/10', num: 'text-emerald-400/15' },
    orange: { border: 'border-orange-400/30', text: 'text-orange-400', bg: 'bg-orange-400/10', num: 'text-orange-400/15' },
    teal: { border: 'border-teal-400/30', text: 'text-teal-400', bg: 'bg-teal-400/10', num: 'text-teal-400/15' },
  };
  const c = colorMap[rule.color as keyof typeof colorMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-2xl border ${c.border} overflow-hidden`}
      style={{ background: 'oklch(0.13 0.022 240)' }}
    >
      <button
        className="w-full flex items-center gap-6 p-6 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`shrink-0 font-syne font-black text-6xl ${c.num} leading-none select-none`}>
          {rule.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`nc-tag ${c.text} mb-1`}>&lt;{PROMPT_SECTIONS[index]?.tag}&gt;</div>
          <h3 className="font-syne font-bold text-2xl text-white">{rule.title}</h3>
          <p className="text-sm text-slate-400 mt-1">{rule.subtitle}</p>
        </div>
        <div className={`shrink-0 w-8 h-8 rounded-full ${c.bg} border ${c.border} flex items-center justify-center ${c.text} transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 space-y-6">
              <p className="text-slate-300 leading-relaxed">{rule.description}</p>

              {/* Structure */}
              <div>
                <h4 className={`text-xs font-bold ${c.text} uppercase tracking-wider mb-3`}>Structure recommandée</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  {rule.structure.map((item, i) => (
                    <div key={i} className={`rounded-lg border ${c.border} p-3`}
                      style={{ background: 'oklch(0.10 0.019 240)' }}>
                      <div className={`text-xs font-semibold ${c.text} mb-1`}>{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before / After */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-red-500/20 overflow-hidden"
                  style={{ background: 'oklch(0.12 0.025 15)' }}>
                  <div className="px-4 py-2 border-b border-red-500/20 flex items-center gap-2">
                    <span className="text-xs text-red-400 font-mono">❌ À ne pas faire</span>
                  </div>
                  <pre className="p-4 text-xs text-red-300/70 whitespace-pre-wrap leading-relaxed font-mono">
                    {rule.badExample}
                  </pre>
                </div>
                <div className="rounded-xl border border-amber-500/30 overflow-hidden"
                  style={{ background: 'oklch(0.12 0.025 240)' }}>
                  <div className="px-4 py-2 border-b border-amber-500/20 flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-mono">✅ Version experte</span>
                  </div>
                  <pre className="p-4 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                    {rule.goodExample}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TechniquesPage() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'rules' | 'secrets' | 'advanced'>('all');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
        style={{ background: 'oklch(0.09 0.018 240 / 0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={LOGO_URL} alt="PromptCraft" className="w-7 h-7 object-contain" />
              <span className="font-syne font-bold text-white">
                Prompt<span className="text-amber-400">Craft</span>
              </span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <span className="text-sm text-slate-400">Techniques</span>
          </div>
          <button
            onClick={() => navigate('/generator')}
            className="nc-bevel-sm px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:scale-105"
            style={{ background: 'oklch(0.75 0.18 65)' }}
          >
            Générateur →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={NEURAL_BG} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, oklch(0.09 0.018 240 / 0.5), oklch(0.09 0.018 240))' }} />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-block px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 uppercase tracking-wider mb-6">
              Guide Complet
            </div>
            <h1 className="font-syne font-black text-5xl md:text-6xl text-white mb-6 leading-tight">
              Toutes les techniques<br />
              <span className="text-amber-400">du Prompt Engineering</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Condensé des guides officiels d'OpenAI, Google et Anthropic. Les 5 règles d'or,
              les 3 astuces secrètes et les techniques avancées qui transforment tes prompts
              en outils de précision chirurgicale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-16 z-40 border-b border-white/5"
        style={{ background: 'oklch(0.09 0.018 240 / 0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="container">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {[
              { id: 'all', label: 'Tout voir' },
              { id: 'rules', label: '5 Règles d\'or' },
              { id: 'secrets', label: '3 Astuces secrètes' },
              { id: 'advanced', label: 'Techniques avancées' },
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={activeFilter === filter.id ? { background: 'oklch(0.75 0.18 65)' } : {}}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16 space-y-24">

        {/* 5 Golden Rules */}
        {(activeFilter === 'all' || activeFilter === 'rules') && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-amber-500/50" />
                <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Fondamentaux</span>
              </div>
              <h2 className="font-syne font-black text-4xl text-white mb-4">Les 5 Règles d'Or</h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                Ces 5 éléments forment la structure du prompt parfait. Chaque règle s'appuie sur
                les recommandations officielles d'OpenAI, Google et Anthropic. Applique-les dans
                cet ordre pour des résultats extraordinaires.
              </p>
            </motion.div>

            <div className="space-y-4">
              {GOLDEN_RULES_FULL.map((rule, i) => (
                <RuleSection key={rule.number} rule={rule} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 3 Secret Tips */}
        {(activeFilter === 'all' || activeFilter === 'secrets') && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-sky-400/50" />
                <span className="text-xs text-sky-400 uppercase tracking-widest font-semibold">Astuces Secrètes</span>
              </div>
              <h2 className="font-syne font-black text-4xl text-white mb-4">3 Astuces que personne ne te dit</h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                Au-delà des 5 règles d'or, ces 3 astuces sont les moins connues mais parmi les plus
                puissantes. Elles permettent d'éviter les hallucinations, de contrôler la longueur
                des réponses et de structurer parfaitement tes prompts.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {PROMPT_TECHNIQUES.slice(0, 3).map((technique, i) => {
                const colorMap = {
                  amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
                  sky: { border: 'border-sky-400/30', text: 'text-sky-400', bg: 'bg-sky-400/10' },
                  green: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                };
                const c = colorMap[technique.color];
                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border ${c.border} p-6`}
                    style={{ background: 'oklch(0.13 0.022 240)' }}
                  >
                    <div className={`w-14 h-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center font-mono font-bold text-2xl ${c.text} mb-5`}>
                      {technique.icon}
                    </div>
                    <div className={`text-xs font-bold ${c.text} uppercase tracking-wider mb-2`}>
                      Astuce #{i + 1}
                    </div>
                    <h3 className="font-syne font-bold text-xl text-white mb-3">{technique.name}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5">{technique.description}</p>
                    <div className="rounded-lg border border-white/5 p-4"
                      style={{ background: 'oklch(0.10 0.019 240)' }}>
                      <div className={`text-xs font-semibold ${c.text} mb-2`}>Comment l'utiliser :</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{technique.howTo}</p>
                    </div>
                    <div className="mt-4 rounded-lg border border-white/5 p-4"
                      style={{ background: 'oklch(0.10 0.019 240)' }}>
                      <div className={`text-xs font-semibold ${c.text} mb-2`}>Exemple :</div>
                      <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                        {technique.example}
                      </pre>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Advanced techniques */}
        {(activeFilter === 'all' || activeFilter === 'advanced') && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-emerald-400/50" />
                <span className="text-xs text-emerald-400 uppercase tracking-widest font-semibold">Niveau Expert</span>
              </div>
              <h2 className="font-syne font-black text-4xl text-white mb-4">Techniques de Prompting Avancées</h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                Ces techniques vont beaucoup plus loin que les règles d'or. En les associant
                à la structure de base, tu obtiens des résultats vraiment extraordinaires.
              </p>
            </motion.div>

            <div className="space-y-6">
              {PROMPT_TECHNIQUES.slice(3).map((technique, i) => {
                const colorMap = {
                  amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
                  sky: { border: 'border-sky-400/30', text: 'text-sky-400', bg: 'bg-sky-400/10' },
                  green: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                };
                const c = colorMap[technique.color];
                return (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border ${c.border} overflow-hidden`}
                    style={{ background: 'oklch(0.13 0.022 240)' }}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-6 mb-6">
                        <div className={`shrink-0 w-16 h-16 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center font-mono font-bold text-2xl ${c.text}`}>
                          {technique.icon}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${c.text} uppercase tracking-wider mb-1`}>
                            Technique #{i + 4}
                          </div>
                          <h3 className="font-syne font-bold text-2xl text-white mb-2">{technique.name}</h3>
                          <p className="text-slate-400 leading-relaxed">{technique.description}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="rounded-xl border border-white/5 p-5"
                          style={{ background: 'oklch(0.10 0.019 240)' }}>
                          <div className={`text-xs font-bold ${c.text} uppercase tracking-wider mb-3`}>
                            Comment l'utiliser
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed">{technique.howTo}</p>
                        </div>
                        <div className="rounded-xl border border-white/5 p-5"
                          style={{ background: 'oklch(0.10 0.019 240)' }}>
                          <div className={`text-xs font-bold ${c.text} uppercase tracking-wider mb-3`}>
                            Exemple
                          </div>
                          <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                            {technique.example}
                          </pre>
                        </div>
                      </div>

                      {/* Special examples for Reverse Prompting */}
                      {technique.id === 'reverse' && (
                        <div className="mt-5 grid md:grid-cols-2 gap-4">
                          {REVERSE_PROMPTING_EXAMPLES.map((ex, j) => (
                            <div key={j} className={`rounded-xl border ${c.border} overflow-hidden`}>
                              <div className={`px-4 py-2 border-b ${c.border} flex items-center justify-between`}>
                                <span className="text-xs text-slate-400">{ex.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${c.bg} border ${c.border} ${c.text} font-mono`}>
                                  {ex.badge}
                                </span>
                              </div>
                              <pre className="p-4 text-xs text-slate-400 whitespace-pre-wrap leading-relaxed font-mono">
                                {ex.prompt}
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Complete example */}
        {(activeFilter === 'all') && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-px bg-amber-500/50" />
                <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">Exemple Complet</span>
              </div>
              <h2 className="font-syne font-black text-4xl text-white mb-4">Le Prompt Parfait en Action</h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                Voici un exemple complet qui combine les 5 règles d'or, les balises XML,
                le COV et l'indice de confiance — le niveau expert absolu.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-amber-500/30 overflow-hidden"
              style={{ background: 'oklch(0.12 0.022 240)' }}
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-500/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs text-amber-400 font-mono ml-2">prompt-expert-complet.xml — Score: 100/100</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono">5 règles d'or</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-sky-400/10 border border-sky-400/20 text-sky-400 font-mono">COV activé</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-mono">Confiance</span>
                </div>
              </div>
              <div className="p-6">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
{`<contexte>
Entreprise : Banque historique (15 000 employés) avec un système informatique "Legacy" complexe et des données cloisonnées.

Social : Forte appréhension des salariés. L'objectif est l'humain augmenté ("Augmented Employee") et non le remplacement.

Objectifs : Réduction des coûts de 15% en 3 ans, accélération du "Time-to-Market" et lutte contre les néo-banques via l'hyper-personnalisation.

C'est dans ce climat de transformation majeure, où l'innovation technologique doit impérativement s'aligner sur la sécurité des actifs et l'acceptabilité sociale, que ton expertise intervient.
</contexte>

<rôle>
Tu es un Responsable de la Sécurité des Systèmes d'Information (RSSI) et Expert en éthique algorithmique.

Ton public : Le Comité de Direction d'une banque internationale. Ils ont une vision stratégique mais ne sont pas des experts techniques en codage ou en cryptographie.

Style de communication : Institutionnel, direct et rassurant. Tu dois transformer des risques techniques complexes en enjeux de responsabilité civile et financière.
</rôle>

<tâche>
Rédiger une note de cadrage stratégique exhaustive pour l'intégration de l'IA au sein d'une institution bancaire de détail.

Exigences clés :
- Analyse des cas d'usage : Identifier les opportunités prioritaires en Front Office (relation client), Middle Office (fraude) et Back Office (automatisation).
- Gouvernance et Conformité : Intégrer les dimensions éthiques et réglementaires (notamment la conformité avec l'AI Act européen).
- Évaluation des risques et ROI : Analyser les risques opérationnels/cybersécurité et définir les indicateurs de succès financiers et opérationnels à 3 ans.
</tâche>

<format>
Format : Note de cadrage stratégique en Markdown (utilisant tableaux, listes à puces et mise en forme professionnelle).
Longueur : Environ 400 à 600 mots (incluant un résumé exécutif de 10 lignes maximum).
Structure :
1. Résumé Exécutif (Opportunité, Risque, Recommandation)
2. Vision Stratégique (Concept de l'Humain Augmenté)
3. Matrice des Cas d'Usage (Tableau : Pôle, Cas d'usage, ROI, Complexité Legacy)
4. Conformité et Éthique (3 piliers critiques de l'AI Act)
5. Analyse Risques & Résilience (impacts financiers et réputationnels)
6. Indicateurs de Succès (KPIs) (Tableau prévisionnel triennal)
</format>

<contraintes>
À faire : Rédiger une Note ComEx (Exec Summary + recommandation). Prioriser le dé-silotage des données et l'intégration Mainframe réaliste. Classer les cas d'usage selon l'AI Act et le niveau d'explicabilité.

Exigences de style : Ton formel et décisionnel (approche par les risques). Remplacer le jargon technique par des analogies business. Utiliser un vocabulaire de valorisation (upskilling, valeur ajoutée) plutôt que technique.

Limitations et frontières : Interdiction stricte de mentionner des "suppressions de postes" ou des "solutions magiques" ignorant la dette technique.

Chain of Verification (COV) : Avant de donner ta réponse finale, applique rigoureusement la méthode COV :
- Génération de prédictions : Identifie les solutions standards de rétention.
- Questions de vérification : Pose-toi des questions critiques sur la pertinence et la viabilité.
- Exécution de la vérification : Vérifie la cohérence avec les données du contexte.
- Révision : Corrige ta réponse pour ne garder que les recommandations validées.

Indice de confiance : Pour chaque affirmation clé, évalue ton niveau de confiance (Pratiquement certain / Très confiant / Moyennement confiant / Spéculatif / Faible confiance) et justifie-le.
</contraintes>

<verbosité>
Verbosité : High
</verbosité>`}
                </pre>
              </div>
            </motion.div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-syne font-black text-4xl text-white mb-4">
              Prêt à appliquer ces techniques ?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Utilise le générateur interactif pour construire tes prompts avec toutes ces techniques en quelques clics.
            </p>
            <button
              onClick={() => navigate('/generator')}
              className="nc-bevel inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'oklch(0.75 0.18 65)' }}
            >
              <span>⚡</span>
              Ouvrir le Générateur
            </button>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10" style={{ background: 'oklch(0.09 0.018 240)' }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="PromptCraft" className="w-6 h-6 object-contain" />
            <span className="font-syne font-bold text-white">
              Prompt<span className="text-amber-400">Craft</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Basé sur les guides officiels d'OpenAI, Google & Anthropic — Prompt Engineering 2026
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Accueil
            </button>
            <button onClick={() => navigate('/generator')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Générateur
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
