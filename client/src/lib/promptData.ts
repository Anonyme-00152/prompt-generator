// ============================================================
// NEURAL COMMAND — Prompt Engineering Data
// All prompt techniques, examples, and templates
// ============================================================

export interface PromptSection {
  id: string;
  tag: string;
  label: string;
  description: string;
  placeholder: string;
  example: string;
  tips: string[];
  required: boolean;
  color: 'amber' | 'sky' | 'green' | 'orange' | 'teal';
}

export interface PromptTechnique {
  id: string;
  name: string;
  shortName: string;
  description: string;
  howTo: string;
  example: string;
  icon: string;
  color: 'amber' | 'sky' | 'green';
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  role: string;
  tache: string;
  contexte: string;
  format: string;
  contraintes: string;
  technique?: string;
}

export const PROMPT_SECTIONS: PromptSection[] = [
  {
    id: 'role',
    tag: 'rôle',
    label: 'Rôle',
    description: 'Définit qui est l\'IA — son expertise, son public et son style de communication.',
    placeholder: 'Ex: Tu es un Expert en cybersécurité et RSSI...',
    example: `Tu es un Responsable de la Sécurité des Systèmes d'Information (RSSI) et Expert en éthique algorithmique.

Ton public : Le Comité de Direction d'une banque internationale. Ils ont une vision stratégique mais ne sont pas des experts techniques en codage ou en cryptographie.

Style de communication : Institutionnel, direct et rassurant. Tu dois transformer des risques techniques complexes en enjeux de responsabilité civile et financière.`,
    tips: [
      'Précise le titre exact du rôle (ex: RSSI, Chef de projet, Analyste financier)',
      'Décris le public cible et son niveau de connaissance',
      'Spécifie le style de communication attendu (formel, vulgarisé, technique)',
      'Plus le rôle est précis, plus la réponse sera adaptée'
    ],
    required: true,
    color: 'amber'
  },
  {
    id: 'tache',
    tag: 'tâche',
    label: 'Tâche',
    description: 'L\'objectif précis avec les exigences clés. C\'est le cœur de votre prompt.',
    placeholder: 'Ex: Rédiger une note de cadrage stratégique exhaustive...',
    example: `Rédiger une note de cadrage stratégique exhaustive pour l'intégration de l'IA au sein d'une institution bancaire de détail.

Exigences clés :

Analyse des cas d'usage : Identifier les opportunités prioritaires en Front Office (relation client), Middle Office (fraude) et Back Office (automatisation).

Gouvernance et Conformité : Intégrer les dimensions éthiques et réglementaires (notamment la conformité avec l'AI Act européen).

Évaluation des risques et ROI : Analyser les risques opérationnels/cybersécurité et définir les indicateurs de succès financiers et opérationnels à 3 ans.`,
    tips: [
      'Commence par un verbe d\'action fort (Rédiger, Analyser, Créer, Concevoir)',
      'Liste les exigences clés avec des tirets',
      'Évite les tâches vagues — sois ultra-spécifique',
      'Inclus des métriques quand c\'est possible (ex: 400-600 mots, 3 ans, 15%)'
    ],
    required: true,
    color: 'sky'
  },
  {
    id: 'contexte',
    tag: 'contexte',
    label: 'Contexte',
    description: 'Toutes les informations pertinentes, données et détails que l\'IA doit connaître.',
    placeholder: 'Ex: Entreprise de 15 000 employés avec un système Legacy...',
    example: `Entreprise : Banque historique (15 000 employés) avec un système informatique "Legacy" complexe et des données cloisonnées.

Social : Forte appréhension des salariés. L'objectif est l'humain augmenté ("Augmented Employee") et non le remplacement.

Objectifs : Réduction des coûts de 15% en 3 ans, accélération du "Time-to-Market" et lutte contre les néo-banques via l'hyper-personnalisation.

C'est dans ce climat de transformation majeure, où l'innovation technologique doit impérativement s'aligner sur la sécurité des actifs et l'acceptabilité sociale, que ton expertise intervient.`,
    tips: [
      'Place le contexte EN HAUT du prompt pour l\'ancrer (recommandé par Google)',
      'Ajoute une phrase de transition pour relier le contexte à la tâche',
      'Inclus les données chiffrées, les contraintes et le périmètre',
      'Mentionne les parties prenantes et leurs attentes'
    ],
    required: false,
    color: 'green'
  },
  {
    id: 'format',
    tag: 'format',
    label: 'Format',
    description: 'Le type de réponse souhaité : structure, longueur, mise en forme.',
    placeholder: 'Ex: Note de cadrage en Markdown, 400-600 mots...',
    example: `Format : Note de cadrage stratégique en Markdown (utilisant tableaux, listes à puces et mise en forme professionnelle).

Longueur : Environ 400 à 600 mots (incluant un résumé exécutif de 10 lignes maximum).

Structure :
1. Résumé Exécutif (Opportunité, Risque, Recommandation)
2. Vision Stratégique (Concept de l'Humain Augmenté)
3. Matrice des Cas d'Usage (Tableau : Pôle, Cas d'usage, ROI, Complexité Legacy)
4. Conformité et Éthique (3 piliers critiques de l'AI Act)
5. Analyse Risques & Résilience (impacts financiers et réputationnels)
6. Indicateurs de Succès (KPIs) (Tableau prévisionnel triennal)`,
    tips: [
      'Précise le format exact (Markdown, JSON, tableau, liste, email...)',
      'Indique la longueur souhaitée (nombre de mots, de sections)',
      'Décris la structure attendue avec les titres de sections',
      'L\'IA respecte très fidèlement les contraintes de format'
    ],
    required: false,
    color: 'orange'
  },
  {
    id: 'contraintes',
    tag: 'contraintes',
    label: 'Contraintes',
    description: 'Ce qu\'il faut faire et ne pas faire, les exigences de style et les limites à respecter.',
    placeholder: 'Ex: Ton formel, interdiction de mentionner les suppressions de poste...',
    example: `Ce qu'il faut faire et ne pas faire : Rédiger une Note ComEx (Exec Summary + recommandation). Prioriser le dé-silotage des données et l'intégration Mainframe réaliste. Classer les cas d'usage selon l'AI Act et le niveau d'explicabilité.

Exigences de style : Ton formel et décisionnel (approche par les risques). Remplacer le jargon technique par des analogies business. Utiliser un vocabulaire de valorisation (upskilling, valeur ajoutée) plutôt que technique.

Limitations et frontières : Interdiction stricte de mentionner des "suppressions de postes" ou des "solutions magiques" ignorant la dette technique.`,
    tips: [
      'Sépare ce que l\'IA DOIT faire de ce qu\'elle NE DOIT PAS faire',
      'Précise les exigences de style et de ton',
      'Définis les frontières à ne pas franchir',
      'Les contraintes négatives sont aussi importantes que les positives'
    ],
    required: false,
    color: 'teal'
  }
];

export const PROMPT_TECHNIQUES: PromptTechnique[] = [
  {
    id: 'balises',
    name: 'Balises XML',
    shortName: 'Balises',
    description: 'Structurer les éléments du prompt avec des balises XML pour éviter les hallucinations et bien segmenter les sections.',
    howTo: 'Entoure chaque section de ton prompt avec des balises XML : <rôle>...</rôle>, <tâche>...</tâche>, <contexte>...</contexte>. Recommandé par OpenAI et Google.',
    example: `<rôle>
Tu es un assistant utile et efficace.
</rôle>

<contraintes>
1. Reste objectif.
2. Cite tes sources.
</contraintes>`,
    icon: '⟨/⟩',
    color: 'amber'
  },
  {
    id: 'confiance',
    name: 'Indice de Confiance',
    shortName: 'Confiance',
    description: 'Demander à l\'IA d\'évaluer son niveau de certitude pour chaque affirmation afin d\'éviter les hallucinations.',
    howTo: 'Ajoute dans tes contraintes : "Pour chaque affirmation, évalue ton niveau de confiance : Pratiquement certain (95%+), Très confiant (80-95%), Moyennement confiant (60-80%), Spéculatif (40-60%), Faible confiance (<40%). Justifie ton niveau."',
    example: `Pour chaque affirmation, tu vas évaluer ton niveau de confiance :
• Pratiquement certain (95% et plus)
• Très confiant (80 à 95%)
• Moyennement confiant (60 à 80%)
• Spéculatif (40 à 60%)
• Faible confiance (moins de 40%)

Tu devras justifier ton niveau de confiance.`,
    icon: '◎',
    color: 'sky'
  },
  {
    id: 'verbosity',
    name: 'Verbosité',
    shortName: 'Verbosité',
    description: 'Contrôler la longueur et le niveau de détail des réponses avec un simple paramètre.',
    howTo: 'Ajoute <verbosité>High</verbosité> ou <verbosité>Low</verbosité> dans ton prompt. Fonctionne avec GPT, Claude et Gemini. Peut être défini dans les instructions système pour éviter de le répéter.',
    example: `<verbosité>
Verbosité : High
</verbosité>

// ou pour des réponses courtes :

<verbosité>
Verbosité : Low
</verbosité>`,
    icon: '≡',
    color: 'green'
  },
  {
    id: 'cov',
    name: 'Chain of Verification (COV)',
    shortName: 'COV',
    description: 'Technique avancée qui force l\'IA à vérifier son raisonnement avant de répondre, éliminant les erreurs et hallucinations.',
    howTo: 'Dans tes contraintes, demande à l\'IA d\'appliquer la méthode COV : 1) Identifier les lacunes, 2) Référencer les preuves, 3) Revérifier le résumé, 4) Présenter uniquement la version finale vérifiée.',
    example: `Chain of Verification (COV) : Avant de donner ta réponse finale, applique rigoureusement la méthode COV :

Génération de prédictions : Identifie les solutions standards.
Questions de vérification : Pose-toi des questions critiques.
Exécution de la vérification : Vérifie la cohérence avec les données du contexte.
Révision : Corrige ta réponse pour ne garder que les recommandations validées.`,
    icon: '✓✓',
    color: 'amber'
  },
  {
    id: 'reverse',
    name: 'Reverse Prompting',
    shortName: 'Reverse',
    description: 'Laisser l\'IA rédiger le prompt optimal pour toi, puis l\'exécuter. Gain de temps massif et résultats supérieurs.',
    howTo: 'Décris simplement ce que tu veux accomplir, puis demande : "Rédige le prompt optimal qui générerait le meilleur résultat possible pour cette tâche, en suivant les meilleures pratiques du prompt engineering. Ensuite, exécute ce prompt."',
    example: `Je veux [décrire la tâche ou l'objectif].

Rédige le prompt optimal qui générerait le meilleur résultat possible pour cette tâche, en suivant les meilleures pratiques du prompt engineering. Ensuite, exécute ce prompt et montre-moi la réponse finale.`,
    icon: '↺',
    color: 'sky'
  },
  {
    id: 'fewshot',
    name: 'Few-Shot Prompting',
    shortName: 'Few-Shot',
    description: 'Fournir des exemples concrets pour guider le format et le style de la réponse. Plus efficace que les instructions seules.',
    howTo: 'Inclus 2-5 exemples de la forme "Input → Output" dans ton prompt. Assure-toi que les exemples sont cohérents en format. Préfère les patterns positifs aux patterns négatifs.',
    example: `Voici des exemples du format attendu :

Question : Pourquoi le ciel est bleu ?
Réponse : Diffusion de Rayleigh.

Question : Quelle est la cause des tremblements de terre ?
Réponse : Libération soudaine d'énergie dans la croûte terrestre.

Maintenant, réponds à :
Question : Comment se forme la neige ?`,
    icon: '⋯',
    color: 'green'
  }
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'banking-ai',
    name: 'Stratégie IA Bancaire',
    category: 'Stratégie',
    description: 'Note de cadrage pour l\'intégration de l\'IA dans une banque',
    role: `Tu es un Responsable de la Sécurité des Systèmes d'Information (RSSI) et Expert en éthique algorithmique.

Ton public : Le Comité de Direction d'une banque internationale. Ils ont une vision stratégique mais ne sont pas des experts techniques.

Style de communication : Institutionnel, direct et rassurant. Transforme les risques techniques en enjeux de responsabilité civile et financière.`,
    tache: `Rédiger une note de cadrage stratégique exhaustive pour l'intégration de l'IA au sein d'une institution bancaire de détail.

Exigences clés :
- Analyse des cas d'usage : Front Office (relation client), Middle Office (fraude), Back Office (automatisation)
- Gouvernance et Conformité : dimensions éthiques et réglementaires (AI Act européen)
- Évaluation des risques et ROI : risques opérationnels/cybersécurité, indicateurs à 3 ans`,
    contexte: `Entreprise : Banque historique (15 000 employés) avec un système informatique "Legacy" complexe.

Social : Forte appréhension des salariés. Objectif : l'humain augmenté, pas le remplacement.

Objectifs : Réduction des coûts de 15% en 3 ans, accélération du Time-to-Market, hyper-personnalisation.`,
    format: `Format : Note de cadrage en Markdown avec tableaux et listes.
Longueur : 400 à 600 mots avec résumé exécutif de 10 lignes max.
Structure : Résumé Exécutif → Vision Stratégique → Matrice des Cas d'Usage → Conformité → Risques → KPIs`,
    contraintes: `À faire : Note ComEx avec Exec Summary + recommandations. Prioriser le dé-silotage des données.
Style : Ton formel et décisionnel. Remplacer le jargon technique par des analogies business.
Interdictions : Ne jamais mentionner "suppressions de postes" ou "solutions magiques".`,
    technique: 'cov'
  },
  {
    id: 'podcast-launch',
    name: 'Lancement Podcast',
    category: 'Marketing',
    description: 'Stratégie complète de lancement pour un podcast',
    role: `Tu es un Stratège Marketing Digital spécialisé dans le lancement de podcasts et le personal branding.

Ton public : Un entrepreneur solo qui lance son premier podcast.

Style : Concret, actionnable, orienté résultats. Donne des étapes précises avec des délais.`,
    tache: `Créer une stratégie de lancement complète pour un podcast innovant dédié au bien-être mental des jeunes professionnels dans le monde de l'entreprise en 2026.

Exigences clés :
- Plan de lancement sur 90 jours (pré-lancement, lancement, post-lancement)
- Stratégie de distribution multi-plateforme
- Tactiques de croissance d'audience organique`,
    contexte: `Créateur : Professionnel RH de 32 ans, première expérience podcast.
Budget : 500€ pour le démarrage.
Cible : 25-35 ans, cadres et managers en burnout ou en questionnement.
Différenciation : Approche basée sur la neuroscience et des témoignages authentiques.`,
    format: `Format : Plan structuré avec timeline.
Longueur : 600-800 mots.
Structure : Résumé → Phase 1 (Pré-lancement) → Phase 2 (Lancement) → Phase 3 (Croissance) → KPIs`,
    contraintes: `À faire : Recommandations concrètes et actionnables. Inclure des outils gratuits ou low-cost.
Style : Enthousiaste mais réaliste. Pas de promesses irréalistes.
Interdictions : Ne pas recommander des dépenses publicitaires importantes au démarrage.`
  },
  {
    id: 'chatbot-evaluation',
    name: 'Évaluation Chatbot Service Client',
    category: 'Analyse',
    description: 'Analyse de viabilité pour un chatbot de service client',
    role: `Tu es un Expert en Transformation Digitale et Expérience Client avec 10 ans d'expérience en déploiement de solutions IA.

Ton public : Direction d'une PME e-commerce de 50 personnes.

Style : Analytique, pragmatique, orienté ROI.`,
    tache: `Évaluer la viabilité du lancement d'un chatbot de service client automatisé.

Exigences clés :
- Identifier 3 freins principaux à l'adoption
- Analyser le ROI potentiel (CAC actuel : 12€, taux de rétention : 15%)
- Proposer un plan de déploiement pour maximiser le taux de conversion`,
    contexte: `Entreprise : E-commerce mode, 50 000 clients actifs, 200 tickets/jour.
Problème actuel : 3 agents SAV débordés, délai moyen de réponse 4h.
Budget disponible : 15 000€ pour la première année.
Objectif : Réduire le délai à moins de 2 minutes pour 80% des requêtes.`,
    format: `Format : Rapport d'analyse avec tableaux comparatifs.
Longueur : 500-700 mots.
Structure : Synthèse → Analyse des freins → Projection ROI → Plan de déploiement → Recommandation finale`,
    contraintes: `Style : Professionnel, persuasif et orienté résultats.
Interdiction : Ne pas suggérer de baisser le prix de l'abonnement.
COV requis : Applique la méthode Chain of Verification avant ta réponse finale.`,
    technique: 'cov'
  },
  {
    id: 'content-strategy',
    name: 'Stratégie de Contenu LinkedIn',
    category: 'Marketing',
    description: 'Plan de contenu LinkedIn pour un expert',
    role: `Tu es un Expert en Personal Branding et Content Strategy sur LinkedIn.

Ton public : Un consultant indépendant qui veut développer son audience professionnelle.

Style : Pratique, inspirant, avec des exemples concrets.`,
    tache: `Créer un plan de contenu LinkedIn sur 30 jours pour un consultant en transformation digitale.

Exigences clés :
- 20 idées de posts avec angles différenciants
- Mix de formats (texte, carrousel, vidéo, sondage)
- Stratégie d'engagement et de croissance`,
    contexte: `Profil : Consultant 40 ans, 500 abonnés actuels, expertise en IA et automatisation.
Objectif : Atteindre 2 000 abonnés en 3 mois et générer 2 leads qualifiés/mois.
Disponibilité : 30 minutes par jour pour LinkedIn.
Ton naturel : Direct, sans bullshit, avec de l'humour.`,
    format: `Format : Calendrier éditorial avec tableau.
Longueur : 400-500 mots + tableau des 20 idées.
Structure : Stratégie globale → Calendrier → Top 5 posts détaillés → KPIs`,
    contraintes: `À faire : Posts qui provoquent des réactions et des partages. Inclure des hooks accrocheurs.
Style : Authentique, pas corporate. Éviter le jargon.
Interdictions : Pas de posts génériques type "5 conseils pour...".`
  }
];

export const QUALITY_LEVELS = [
  {
    level: 'basic',
    label: 'Basique',
    description: 'Prompt simple sans structure',
    score: 20,
    color: 'destructive'
  },
  {
    level: 'intermediate',
    label: 'Intermédiaire',
    description: 'Rôle + Tâche définis',
    score: 50,
    color: 'orange'
  },
  {
    level: 'advanced',
    label: 'Avancé',
    description: '4-5 sections complètes',
    score: 75,
    color: 'sky'
  },
  {
    level: 'expert',
    label: 'Expert',
    description: 'Toutes sections + technique avancée',
    score: 100,
    color: 'amber'
  }
];
