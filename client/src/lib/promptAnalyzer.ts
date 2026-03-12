// ============================================================
// NEURAL COMMAND — Prompt Analyzer & Optimizer
// Analyzes existing prompts and provides optimization suggestions
// ============================================================

export interface AnalysisSuggestion {
  rule: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
  example?: string;
}

export interface PromptAnalysisResult {
  score: number;
  level: 'basique' | 'intermédiaire' | 'avancé' | 'expert';
  suggestions: AnalysisSuggestion[];
  strengths: string[];
  hasRole: boolean;
  hasTache: boolean;
  hasContexte: boolean;
  hasFormat: boolean;
  hasContraintes: boolean;
  hasXmlTags: boolean;
  hasCOV: boolean;
  hasConfidenceIndex: boolean;
  hasVerbosity: boolean;
  wordCount: number;
}

const KEYWORDS = {
  role: ['tu es', 'vous êtes', 'je suis', 'rôle', 'expertise', 'expert', 'spécialiste', 'professionnel'],
  tache: ['créer', 'rédiger', 'analyser', 'concevoir', 'générer', 'produire', 'développer', 'écrire', 'faire', 'objectif', 'tâche', 'mission'],
  contexte: ['contexte', 'entreprise', 'situation', 'environnement', 'données', 'informations', 'background', 'cadre'],
  format: ['format', 'structure', 'longueur', 'mots', 'sections', 'tableau', 'liste', 'markdown', 'json', 'présentation'],
  contraintes: ['contraintes', 'ne pas', 'interdiction', 'limitation', 'style', 'ton', 'règles', 'exigences', 'doit', 'éviter'],
  xmlTags: ['<rôle>', '<tâche>', '<contexte>', '<format>', '<contraintes>', '<verbosité>', '<confiance>'],
  cov: ['vérification', 'vérifier', 'chain of verification', 'cov', 'cohérence', 'validation'],
  confidenceIndex: ['confiance', 'certain', 'probabilité', 'niveau de confiance', 'fiabilité'],
  verbosity: ['verbosité', 'longueur', 'détail', 'concis', 'développé', 'court', 'long']
};

export function analyzePrompt(prompt: string): PromptAnalysisResult {
  const lowerPrompt = prompt.toLowerCase();
  const wordCount = prompt.split(/\s+/).length;

  // Check for presence of key elements
  const hasRole = KEYWORDS.role.some(k => lowerPrompt.includes(k));
  const hasTache = KEYWORDS.tache.some(k => lowerPrompt.includes(k));
  const hasContexte = KEYWORDS.contexte.some(k => lowerPrompt.includes(k));
  const hasFormat = KEYWORDS.format.some(k => lowerPrompt.includes(k));
  const hasContraintes = KEYWORDS.contraintes.some(k => lowerPrompt.includes(k));
  const hasXmlTags = KEYWORDS.xmlTags.some(tag => prompt.includes(tag));
  const hasCOV = KEYWORDS.cov.some(k => lowerPrompt.includes(k));
  const hasConfidenceIndex = KEYWORDS.confidenceIndex.some(k => lowerPrompt.includes(k));
  const hasVerbosity = KEYWORDS.verbosity.some(k => lowerPrompt.includes(k));

  const suggestions: AnalysisSuggestion[] = [];
  const strengths: string[] = [];

  // Rule 1: Rôle (Role)
  if (!hasRole) {
    suggestions.push({
      rule: '01 — Rôle',
      severity: 'critical',
      message: 'Aucun rôle défini pour l\'IA.',
      suggestion: 'Ajoute un rôle précis au début du prompt. Définis qui est l\'IA, son expertise et son public.',
      example: 'Tu es un Expert en Transformation Digitale avec 10 ans d\'expérience. Ton public : Directeurs généraux de PME. Style : Pragmatique et orienté ROI.'
    });
  } else {
    strengths.push('✓ Rôle bien défini');
  }

  // Rule 2: Tâche (Task)
  if (!hasTache) {
    suggestions.push({
      rule: '02 — Tâche',
      severity: 'critical',
      message: 'Pas de tâche claire ou d\'objectif spécifique.',
      suggestion: 'Définis l\'objectif précis avec un verbe d\'action fort (Créer, Analyser, Rédiger, Concevoir). Inclus les exigences clés.',
      example: 'Rédiger une stratégie de lancement pour un produit SaaS en 90 jours. Exigences : Plan d\'action détaillé, budget estimé, KPIs.'
    });
  } else {
    strengths.push('✓ Tâche claire');
  }

  // Rule 3: Contexte
  if (!hasContexte) {
    suggestions.push({
      rule: '03 — Contexte',
      severity: 'warning',
      message: 'Contexte insuffisant ou manquant.',
      suggestion: 'Ajoute des informations pertinentes : données chiffrées, contraintes, parties prenantes, objectifs business.',
      example: 'Entreprise : PME de 50 personnes. Budget annuel : 500k€. Objectif : Augmenter le chiffre d\'affaires de 30% en 12 mois.'
    });
  } else {
    strengths.push('✓ Contexte présent');
  }

  // Rule 4: Format
  if (!hasFormat) {
    suggestions.push({
      rule: '04 — Format',
      severity: 'warning',
      message: 'Format de réponse non spécifié.',
      suggestion: 'Précise le format exact : Markdown, JSON, tableau, liste, email. Indique aussi la longueur (mots, sections).',
      example: 'Format : Stratégie en Markdown avec tableaux. Longueur : 800-1000 mots. Structure : Résumé → Analyse → Recommandations → KPIs.'
    });
  } else {
    strengths.push('✓ Format spécifié');
  }

  // Rule 5: Contraintes
  if (!hasContraintes) {
    suggestions.push({
      rule: '05 — Contraintes',
      severity: 'warning',
      message: 'Pas de contraintes ou de règles définies.',
      suggestion: 'Ajoute ce que l\'IA DOIT faire et NE DOIT PAS faire. Définis le style, le ton et les limites.',
      example: 'À faire : Prioriser les actions rapides (< 30 jours). NE PAS faire : Suggérer des solutions magiques. Style : Formel, basé sur les données.'
    });
  } else {
    strengths.push('✓ Contraintes définies');
  }

  // Advanced techniques
  if (hasXmlTags) {
    strengths.push('⭐ Balises XML utilisées');
  } else if (hasRole && hasTache && hasContexte) {
    suggestions.push({
      rule: 'Astuce — Balises XML',
      severity: 'info',
      message: 'Pas de balises XML pour structurer le prompt.',
      suggestion: 'Entoure chaque section avec des balises XML : <rôle>...</rôle>, <tâche>...</tâche>, etc. Recommandé par OpenAI et Google.',
      example: '<rôle>Tu es un expert...</rôle>\n<tâche>Rédiger...</tâche>\n<contexte>Entreprise...</contexte>'
    });
  }

  if (hasCOV) {
    strengths.push('⭐ Chain of Verification (COV)');
  } else if (hasTache) {
    suggestions.push({
      rule: 'Technique — Chain of Verification',
      severity: 'info',
      message: 'COV non utilisé pour vérifier le raisonnement.',
      suggestion: 'Ajoute une demande de vérification : "Avant de répondre, applique la méthode COV : 1) Identifie les lacunes, 2) Référence les preuves, 3) Vérifie la cohérence, 4) Présente la version finale."',
      example: 'Chain of Verification (COV) : Avant de donner ta réponse finale, applique rigoureusement cette méthode...'
    });
  }

  if (hasConfidenceIndex) {
    strengths.push('⭐ Indice de Confiance');
  } else if (hasTache) {
    suggestions.push({
      rule: 'Astuce — Indice de Confiance',
      severity: 'info',
      message: 'Pas d\'indice de confiance pour éviter les hallucinations.',
      suggestion: 'Demande à l\'IA d\'évaluer son niveau de certitude : "Pour chaque affirmation, évalue ton niveau de confiance : Pratiquement certain (95%+), Très confiant (80-95%), Moyennement confiant (60-80%), Spéculatif (40-60%), Faible confiance (<40%)."',
      example: 'Pour chaque affirmation, tu vas évaluer ton niveau de confiance et justifier ton évaluation.'
    });
  }

  if (hasVerbosity) {
    strengths.push('⭐ Verbosité contrôlée');
  } else if (hasTache) {
    suggestions.push({
      rule: 'Astuce — Verbosité',
      severity: 'info',
      message: 'Pas de contrôle de verbosité.',
      suggestion: 'Ajoute <verbosité>High</verbosité>, <verbosité>Medium</verbosité> ou <verbosité>Low</verbosité> pour contrôler la longueur des réponses.',
      example: '<verbosité>Medium</verbosité> — Réponses équilibrées entre détail et concision.'
    });
  }

  // Word count check
  if (wordCount < 20) {
    suggestions.push({
      rule: 'Longueur',
      severity: 'warning',
      message: 'Le prompt est très court (< 20 mots).',
      suggestion: 'Développe ton prompt avec plus de détails. Un bon prompt contient généralement 50-300 mots.'
    });
  }

  // Calculate score
  let score = 0;
  if (hasRole) score += 20;
  if (hasTache) score += 20;
  if (hasContexte) score += 15;
  if (hasFormat) score += 15;
  if (hasContraintes) score += 15;
  if (hasXmlTags) score += 5;
  if (hasCOV || hasConfidenceIndex || hasVerbosity) score += 10;

  // Determine level
  let level: 'basique' | 'intermédiaire' | 'avancé' | 'expert' = 'basique';
  if (score >= 75) level = 'expert';
  else if (score >= 60) level = 'avancé';
  else if (score >= 40) level = 'intermédiaire';

  return {
    score,
    level,
    suggestions: suggestions.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    strengths,
    hasRole,
    hasTache,
    hasContexte,
    hasFormat,
    hasContraintes,
    hasXmlTags,
    hasCOV,
    hasConfidenceIndex,
    hasVerbosity,
    wordCount
  };
}

export function getSeverityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'warning': return 'orange';
    case 'info': return 'sky';
  }
}

export function getSeverityIcon(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return '⚠️';
    case 'warning': return '⚡';
    case 'info': return 'ℹ️';
  }
}
