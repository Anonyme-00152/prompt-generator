# PromptCraft — Brainstorming Design

## Contexte
Site de génération de prompts IA ultra-poussé, basé sur les 5 règles d'or + 3 astuces secrètes + techniques avancées (COV, Reverse Prompting, Few-shot). Palette : pas de violet, pas de rose. Ambiance masculine, technique, premium.

---

<response>
<text>
## Idée 1 — "Terminal Forge" (Cyberpunk Industriel)

**Design Movement**: Cyberpunk industriel / Hacker aesthetic — inspiré des terminaux Unix, des interfaces de salle des marchés et des cockpits militaires.

**Core Principles**:
1. Tout est construit comme un outil professionnel, pas une app grand public
2. La grille et le code sont les motifs visuels dominants
3. Chaque interaction donne l'impression de "compiler" quelque chose de puissant
4. Contraste extrême : fond quasi-noir, texte lumineux

**Color Philosophy**: Fond #0A0E1A (bleu nuit profond), accents #00D4FF (cyan électrique) et #FF6B00 (orange ambre). Évoque les moniteurs de trading et les terminaux de commande. Aucune couleur "douce".

**Layout Paradigm**: Interface split asymétrique — panneau gauche étroit (navigation/étapes), zone centrale large (formulaire builder), panneau droit (preview live du prompt). Ressemble à un IDE.

**Signature Elements**:
- Scanlines subtiles sur les fonds sombres (effet CRT)
- Curseur clignotant dans les champs de texte
- Bordures avec effet "glow" cyan sur focus

**Interaction Philosophy**: Chaque action produit un feedback visuel immédiat — les sections s'assemblent comme des blocs de code, le prompt final "compile" avec une animation de frappe.

**Animation**: Entrées en slide-from-left pour les panneaux, typing effect sur le prompt généré, pulse sur les boutons CTA, particules flottantes en arrière-plan.

**Typography System**: `Space Grotesk` (titres, bold 700) + `JetBrains Mono` (code/prompts) + `Inter` (corps de texte). Hiérarchie très marquée.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idée 2 — "Architect Studio" (Brutalisme Moderne)

**Design Movement**: Brutalisme numérique / Swiss International Style — inspiré des studios de design suisses des années 70, revu avec une sensibilité tech 2026.

**Core Principles**:
1. La structure EST le design — grilles visibles, alignements parfaits
2. Typographie comme élément graphique dominant
3. Couleurs fonctionnelles, jamais décoratives
4. Espace négatif massif pour mettre en valeur le contenu

**Color Philosophy**: Fond blanc cassé #F5F2ED, noir profond #1A1A1A, accent unique #E8500A (orange brûlé). Un seul accent, utilisé avec parcimonie. Aucune couleur parasite.

**Layout Paradigm**: Mise en page magazine — colonnes inégales, titres géants qui débordent, sections qui se chevauchent légèrement. Pas de cartes uniformes.

**Signature Elements**:
- Numérotation en grand format (01, 02, 03) pour les étapes
- Lignes horizontales fines comme séparateurs
- Labels en petites capitales avec tracking élevé

**Interaction Philosophy**: Minimaliste mais précis — hover states subtils, transitions rapides (150ms), focus très visible. Tout est intentionnel.

**Animation**: Transitions en fade + slight scale (0.98 → 1.0), scroll-triggered reveals, aucune animation superflue.

**Typography System**: `Bebas Neue` (titres display) + `DM Sans` (corps) + `Fira Code` (prompts/code). Contraste de personnalité fort.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Idée 3 — "Neural Command" (Dark Tech Premium) ← CHOISI

**Design Movement**: Dark Tech Premium / Mission Control — inspiré des interfaces NASA, des salles de contrôle de fusée, et des dashboards de trading haute fréquence.

**Core Principles**:
1. Fond sombre profond avec des couches de profondeur (pas un simple noir plat)
2. Accents lumineux utilisés comme signaux, pas comme décoration
3. Chaque section du formulaire est un "module" autonome avec sa propre identité visuelle
4. Le prompt généré est traité comme un artefact précieux

**Color Philosophy**: Fond #080C14 (bleu-noir spatial), surfaces #0F1623 et #1A2235, accent primaire #F59E0B (ambre/or) et #38BDF8 (bleu ciel). Évoque la précision et l'intelligence. Zéro violet, zéro rose.

**Layout Paradigm**: Dashboard asymétrique — sidebar gauche fixe avec les étapes/modules (20%), zone principale scrollable (55%), panneau preview sticky à droite (25%). Sur mobile : accordéon vertical.

**Signature Elements**:
- Coins biseautés (clip-path) sur certains éléments clés
- Numéros d'étape en grand format avec cercle lumineux
- Badges de statut animés (pulsing dot) pour indiquer les sections actives

**Interaction Philosophy**: Chaque module du formulaire s'active progressivement. Compléter une section "déverrouille" la suivante avec une animation de validation. Le prompt se construit en temps réel dans le panneau de droite.

**Animation**: Framer Motion — entrées en stagger depuis le bas, glow pulse sur les éléments actifs, typing animation pour le prompt final, particules de données en arrière-plan (canvas).

**Typography System**: `Syne` (titres, très bold) + `Space Grotesk` (UI/labels) + `JetBrains Mono` (prompts/code). Identité forte et reconnaissable.
</text>
<probability>0.09</probability>
</response>

---

## Décision : Idée 3 — "Neural Command"

Philosophie choisie : **Dark Tech Premium / Mission Control**
- Fond spatial profond, accents ambre et bleu ciel
- Layout dashboard 3 colonnes
- Animations Framer Motion sophistiquées
- Typography : Syne + Space Grotesk + JetBrains Mono
