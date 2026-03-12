// ============================================================
// NEURAL COMMAND — Home Page
// Design: Dark Tech Premium / Mission Control
// Colors: Deep space (#080C14), Amber (#F59E0B), Sky Blue (#38BDF8)
// ============================================================

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, useInView } from "framer-motion";
import { PROMPT_SECTIONS, PROMPT_TECHNIQUES, PROMPT_TEMPLATES } from "@/lib/promptData";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/hero-bg-izPHpcVVeF6d4bYfFPTbZY.webp";
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/prompt-craft-logo-JrRd8EkJxF5PcfPxXC5LKX.webp";
const NEURAL_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/neural-network-bg-GP8fqbuDQbBfR42BMtrq5x.webp";
const MOCKUP_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663431528324/ZEzuuoF7e3Cktusam36Raq/prompt-preview-mockup-EvFu4xqCqkFK7XrueomjUZ.webp";

// Animated counter
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Particle canvas background
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ['rgba(245,159,11,', 'rgba(56,189,248,', 'rgba(245,159,11,'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56,189,248,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Typing animation for hero text
function TypingText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < current.length) {
          setDisplayText(current.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span>
      {displayText}
      <span className="animate-typing-cursor inline-block w-0.5 h-[1em] bg-amber-400 ml-0.5 align-middle" />
    </span>
  );
}

// Section card for the 5 golden rules
function RuleCard({ section, index }: { section: typeof PROMPT_SECTIONS[0]; index: number }) {
  const colorMap = {
    amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', num: 'text-amber-500/20' },
    sky: { border: 'border-sky-400/30', bg: 'bg-sky-400/5', text: 'text-sky-400', num: 'text-sky-400/20' },
    green: { border: 'border-emerald-400/30', bg: 'bg-emerald-400/5', text: 'text-emerald-400', num: 'text-emerald-400/20' },
    orange: { border: 'border-orange-400/30', bg: 'bg-orange-400/5', text: 'text-orange-400', num: 'text-orange-400/20' },
    teal: { border: 'border-teal-400/30', bg: 'bg-teal-400/5', text: 'text-teal-400', num: 'text-teal-400/20' },
  };
  const c = colorMap[section.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative overflow-hidden rounded-lg border ${c.border} ${c.bg} p-6 group hover:border-opacity-60 transition-all duration-300`}
      style={{ background: 'oklch(0.13 0.022 240)' }}
    >
      {/* Large number */}
      <div className={`absolute top-2 right-4 font-syne font-black text-7xl ${c.num} select-none leading-none`}>
        0{index + 1}
      </div>

      {/* Tag */}
      <div className={`nc-tag mb-3 ${c.text}`}>
        &lt;{section.tag}&gt;
      </div>

      {/* Title */}
      <h3 className="font-syne font-bold text-xl text-white mb-2">{section.label}</h3>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed mb-4">{section.description}</p>

      {/* Tips */}
      <ul className="space-y-1.5">
        {section.tips.slice(0, 2).map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
            <span className={`mt-0.5 shrink-0 ${c.text}`}>›</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      {/* Hover glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        style={{ background: `radial-gradient(circle at 50% 0%, ${section.color === 'amber' ? 'rgba(245,159,11,0.05)' : section.color === 'sky' ? 'rgba(56,189,248,0.05)' : 'rgba(52,211,153,0.05)'} 0%, transparent 70%)` }}
      />
    </motion.div>
  );
}

// Technique card
function TechniqueCard({ technique, index }: { technique: typeof PROMPT_TECHNIQUES[0]; index: number }) {
  const colorMap = {
    amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
    sky: { border: 'border-sky-400/30', text: 'text-sky-400', bg: 'bg-sky-400/10' },
    green: { border: 'border-emerald-400/30', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  };
  const c = colorMap[technique.color];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`rounded-lg border ${c.border} p-5 group hover:border-opacity-60 transition-all duration-300`}
      style={{ background: 'oklch(0.13 0.022 240)' }}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-12 h-12 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center font-mono font-bold text-lg ${c.text}`}>
          {technique.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-syne font-bold text-white mb-1">{technique.name}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{technique.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  const stats = [
    { value: 5, suffix: '', label: 'Règles d\'or' },
    { value: 3, suffix: '', label: 'Astuces secrètes' },
    { value: 6, suffix: '', label: 'Techniques avancées' },
    { value: 90000, suffix: '+', label: 'Guides téléchargés' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-nav-bg"
        style={{ backdropFilter: 'blur(20px)' }} aria-label="Navigation principale">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="PromptCraft" className="w-8 h-8 object-contain" loading="lazy" />
            <span className="font-syne font-bold text-white text-lg tracking-tight">
              Prompt<span className="text-amber-400">Craft</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/techniques')} aria-label="Voir les techniques"
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              Techniques
            </button>
            <button onClick={() => navigate('/generator')} aria-label="Ouvrir le générateur"
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              Générateur
            </button>
            <button onClick={() => navigate('/improve')} aria-label="Améliorer un prompt"
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              Améliorer
            </button>
          </div>
          <button
            onClick={() => navigate('/generator')}
            className="nc-bevel-sm px-5 py-2 text-sm font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: 'oklch(0.75 0.18 65)' }}
          >
            Créer un Prompt
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, oklch(0.09 0.018 240 / 0.3) 0%, oklch(0.09 0.018 240 / 0.7) 50%, oklch(0.09 0.018 240) 100%)' }} />
        </div>

        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Grid background */}
        <div className="absolute inset-0 nc-grid-bg opacity-30" />

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-nc-pulse" />
              <span className="text-xs font-medium text-amber-400 tracking-wide uppercase">
                Condensé des guides OpenAI, Google & Anthropic
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-syne font-black text-5xl md:text-7xl text-white leading-[1.05] mb-6"
            >
              Maîtrise l'art du
              <br />
              <span className="text-amber-400">Prompt Engineering</span>
            </motion.h1>

            {/* Typing subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-300 mb-4 font-light"
            >
              Génère des prompts{' '}
              <span className="text-sky-400 font-medium">
                <TypingText texts={['parfaits', 'ultra-précis', 'professionnels', 'experts']} />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed"
            >
              Passe de prompts basiques qui donnent des résultats médiocres à des prompts structurés
              avec les <strong className="text-white">5 règles d'or</strong>, les <strong className="text-white">3 astuces secrètes</strong> et
              les <strong className="text-white">techniques avancées</strong> (COV, Reverse Prompting, Few-Shot).
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => navigate('/generator')}
                className="nc-bevel flex items-center gap-3 px-8 py-4 text-base font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95 nc-glow-amber"
                style={{ background: 'oklch(0.75 0.18 65)' }}
              >
                <span>⚡</span>
                Générer mon Prompt
              </button>
              <button
                onClick={() => navigate('/techniques')}
                className="flex items-center gap-3 px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-lg transition-all duration-200 hover:border-sky-400/50 hover:bg-sky-400/5"
              >
                <span>📖</span>
                Voir les Techniques
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5" style={{ background: 'oklch(0.11 0.02 240)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-syne font-black text-4xl md:text-5xl text-amber-400 mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full border border-sky-400/30 bg-sky-400/10 text-xs text-sky-400 uppercase tracking-wider mb-4">
              La différence
            </div>
            <h2 className="font-syne font-black text-4xl md:text-5xl text-white mb-4">
              Prompt basique vs. Prompt Expert
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Voici concrètement ce que change l'application des 5 règles d'or sur un même sujet.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Bad prompt */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-red-500/20 overflow-hidden"
              style={{ background: 'oklch(0.12 0.025 15)' }}
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-red-500/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <span className="text-xs text-red-400 font-mono">❌ Prompt basique — à ne PAS faire</span>
              </div>
              <div className="p-5">
                <pre className="font-mono text-sm text-red-300/80 whitespace-pre-wrap leading-relaxed">
                  {`<tâche>
Rédiger une Note de Cadrage 
Stratégique sur l'adoption 
de l'IA dans le secteur 
bancaire
</tâche>`}
                </pre>
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400">
                    ⚠️ Résultat : Réponse générique, sans contexte, sans structure, sans expertise spécifique.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Good prompt */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-amber-500/30 overflow-hidden"
              style={{ background: 'oklch(0.12 0.025 240)' }}
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-amber-500/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-amber-400 font-mono">✅ Prompt expert — résultats extraordinaires</span>
              </div>
              <div className="p-5 space-y-2">
                {[
                  { tag: 'contexte', color: 'text-emerald-400' },
                  { tag: 'rôle', color: 'text-amber-400' },
                  { tag: 'tâche', color: 'text-sky-400' },
                  { tag: 'format', color: 'text-orange-400' },
                  { tag: 'contraintes', color: 'text-teal-400' },
                ].map(({ tag, color }) => (
                  <div key={tag} className="flex items-center gap-2">
                    <span className={`font-mono text-xs ${color}`}>&lt;{tag}&gt;</span>
                    <div className="flex-1 h-px bg-white/10" />
                    <span className={`font-mono text-xs ${color} opacity-60`}>&lt;/{tag}&gt;</span>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400">
                    ✨ Résultat : Réponse parfaitement structurée, adaptée au contexte, avec le bon niveau d'expertise.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5 Golden Rules Section */}
      <section className="py-24 relative bg-surface-grid">
        <div className="absolute inset-0 nc-grid-bg opacity-20" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 uppercase tracking-wider mb-4">
              Les 5 Règles d'Or
            </div>
            <h2 className="font-syne font-black text-4xl md:text-5xl text-white mb-4">
              La structure du prompt parfait
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Condensé des guides officiels d'OpenAI, Google et Anthropic. Ces 5 éléments transforment
              n'importe quel prompt en outil de précision chirurgicale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROMPT_SECTIONS.map((section, i) => (
              <RuleCard key={section.id} section={section} index={i} />
            ))}
            {/* CTA card — spans full row on mobile, 1 col on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="rounded-lg border border-amber-500/40 p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:border-amber-500/70 transition-all duration-300 group"
              style={{ background: 'linear-gradient(135deg, oklch(0.15 0.04 65 / 0.3), oklch(0.13 0.022 240))' }}
              onClick={() => navigate('/generator')}
            >
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <div>
                <h3 className="font-syne font-bold text-white text-lg mb-1">Essayer maintenant</h3>
                <p className="text-sm text-slate-400">Construis ton prompt avec le générateur interactif</p>
              </div>
              <div className="text-amber-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                Ouvrir le générateur →
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Techniques Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-3 py-1 rounded-full border border-sky-400/30 bg-sky-400/10 text-xs text-sky-400 uppercase tracking-wider mb-4">
                  Techniques Avancées
                </div>
                <h2 className="font-syne font-black text-4xl md:text-5xl text-white mb-6">
                  3 Astuces secrètes +<br />
                  <span className="text-sky-400">3 Techniques Pro</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Au-delà des 5 règles d'or, ces techniques transforment tes prompts en outils
                  d'une précision redoutable. Les balises XML, l'indice de confiance, la verbosité,
                  le COV, le Reverse Prompting et le Few-Shot sont les armes des experts.
                </p>
                <button
                  onClick={() => navigate('/techniques')}
                  className="flex items-center gap-2 text-sky-400 font-semibold hover:gap-3 transition-all"
                >
                  Voir toutes les techniques
                  <span>→</span>
                </button>
              </motion.div>
            </div>

            <div className="grid gap-4">
              {PROMPT_TECHNIQUES.slice(0, 4).map((technique, i) => (
                <TechniqueCard key={technique.id} technique={technique} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-24 relative bg-surface-grid">
        <div className="absolute inset-0">
          <img src={NEURAL_BG} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-surface-grid/85" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-xs text-emerald-400 uppercase tracking-wider mb-4">
              Templates Prêts à l'emploi
            </div>
            <h2 className="font-syne font-black text-4xl md:text-5xl text-white mb-4">
              Commence avec un template
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              4 templates professionnels pré-configurés avec les meilleures pratiques.
              Personnalise-les en quelques secondes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROMPT_TEMPLATES.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-white/10 p-5 cursor-pointer hover:border-amber-500/40 transition-all duration-300 group"
                style={{ background: 'oklch(0.13 0.022 240)' }}
                onClick={() => navigate('/generator')}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{template.category}</div>
                <h3 className="font-syne font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{template.description}</p>
                {template.technique && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span className="text-xs text-amber-400 font-mono">COV activé</span>
                  </div>
                )}
                <div className="mt-3 text-xs text-slate-500 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                  Utiliser ce template <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mockup showcase */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-2xl opacity-30"
                style={{ background: 'radial-gradient(circle, oklch(0.75 0.18 65 / 0.2) 0%, transparent 70%)' }} />
              <img
                src={MOCKUP_URL}
                alt="Exemple de prompt structuré"
                className="rounded-xl border border-amber-500/20 w-full shadow-2xl"
                loading="lazy"
              />
              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-3 py-2 rounded-lg border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-sm"
              >
                <span className="text-xs text-emerald-400 font-mono font-bold">Score: 100/100 ⚡</span>
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 px-3 py-2 rounded-lg border border-sky-400/40 bg-sky-400/10 backdrop-blur-sm"
              >
                <span className="text-xs text-sky-400 font-mono font-bold">COV ✓ Vérifié</span>
              </motion.div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs text-amber-400 uppercase tracking-wider mb-4">
                  Prompt structuré
                </div>
                <h2 className="font-syne font-black text-4xl md:text-5xl text-white mb-6">
                  Chaque balise,<br />
                  <span className="text-amber-400">une couche de précision</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Les balises XML ne sont pas juste esthétiques — elles permettent à l'IA de
                  segmenter parfaitement les informations et d'éviter les hallucinations.
                  Recommandées par OpenAI et Google dans leurs guides officiels.
                </p>

                <div className="space-y-3">
                  {[
                    { tag: 'rôle', desc: 'Définit l\'expertise et le public', color: 'text-amber-400' },
                    { tag: 'tâche', desc: 'L\'objectif précis avec exigences', color: 'text-sky-400' },
                    { tag: 'contexte', desc: 'Ancre les informations clés', color: 'text-emerald-400' },
                    { tag: 'format', desc: 'Structure la réponse attendue', color: 'text-orange-400' },
                    { tag: 'contraintes', desc: 'Définit les limites et le style', color: 'text-teal-400' },
                  ].map(({ tag, desc, color }) => (
                    <div key={tag} className="flex items-center gap-3">
                      <span className={`font-mono text-sm ${color} w-24 shrink-0`}>&lt;{tag}&gt;</span>
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-xs text-slate-500">{desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Improve Prompt Section */}
      <section className="py-24 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.18 0.05 220 / 0.15) 0%, transparent 70%)' }} />
        </div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 rounded-full border border-sky-400/30 bg-sky-400/10 text-xs text-sky-400 uppercase tracking-wider mb-4">
                Analyse Intelligente
              </div>
              <h2 className="font-syne font-black text-4xl md:text-5xl text-white mb-6">
                Ameliore tes<br />
                <span className="text-sky-400">prompts existants</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Tu as deja un prompt mais tu ne sais pas s'il est optimal ? Colle-le et recois des suggestions d'amelioration basees sur les 5 regles d'or du prompt engineering.
              </p>
              <button
                onClick={() => navigate('/improve')}
                className="nc-bevel inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-background transition-all duration-200 hover:scale-105 active:scale-95 nc-glow-sky"
                style={{ background: 'oklch(0.72 0.14 220)' }}
              >
                <span>🔍</span>
                Analyser un Prompt
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-2xl opacity-20"
                style={{ background: 'radial-gradient(circle, oklch(0.72 0.14 220 / 0.3) 0%, transparent 70%)' }} />
              <div className="relative rounded-xl border border-sky-400/20 bg-sky-400/5 p-6 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sky-400 font-bold text-lg mt-1">⚠️</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Aucun role defini</p>
                      <p className="text-xs text-slate-400">Ajoute un role precis au debut du prompt</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold text-lg mt-1">✓</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Tache bien definie</p>
                      <p className="text-xs text-slate-400">Objectif clair avec exigences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 font-bold text-lg mt-1">⭐</span>
                    <div>
                      <p className="font-semibold text-white mb-1">Balises XML utilisees</p>
                      <p className="text-xs text-slate-400">Structure optimale detectee</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-sky-400/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Score d'optimisation</span>
                    <span className="text-lg font-bold text-sky-400">72/100</span>
                  </div>
                  <div className="w-full h-2 bg-sky-400/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-sky-500 to-sky-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.18 0.05 65 / 0.15) 0%, transparent 70%)' }} />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-syne font-black text-5xl md:text-6xl text-white mb-6">
              Prêt à créer ton<br />
              <span className="text-amber-400">prompt parfait ?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Utilise le générateur interactif pour construire des prompts structurés
              avec toutes les techniques des experts.
            </p>
            <button
              onClick={() => navigate('/generator')}
              className="nc-bevel inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95 nc-glow-amber"
              style={{ background: 'oklch(0.75 0.18 65)' }}
            >
              <span>⚡</span>
              Lancer le Générateur
            </button>
          </motion.div>
        </div>
      </section>

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
            <button onClick={() => navigate('/techniques')} aria-label="Voir les techniques" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Techniques
            </button>
            <button onClick={() => navigate('/generator')} aria-label="Ouvrir le générateur" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Generateur
            </button>
            <button onClick={() => navigate('/improve')} aria-label="Améliorer un prompt" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Ameliorer
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
