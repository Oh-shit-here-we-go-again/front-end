"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Coins,
  Trophy,
  Sparkles,
  ShieldAlert,
  Users,
  ShoppingBag,
  Eye,
  Heart,
  MessageSquare,
  Accessibility,
  CheckCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShineBorder } from "@/components/ui/shine-border";
import { Ripple } from "@/components/ui/ripple";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { cn } from "@/lib/utils";

// Interface for mock social posts
interface PoopPost {
  id: number;
  author: string;
  avatar: string;
  rank: string;
  time: string;
  content: string;
  spoilerContent: string;
  revealed: boolean;
  likes: number;
  poops: number;
  flames: number;
  comments: string[];
}

// Interface for falling poop particles
interface PoopParticle {
  id: number;
  left: string;
  duration: string;
  size: string;
  delay: string;
  emoji: string;
}

export default function Home() {
  // Accessibility Font Family State
  const [font, setFont] = useState<"sans" | "lexend" | "atkinson">("lexend");

  // Calculator States
  const [salary, setSalary] = useState<number>(3500);
  const [weeklyHours, setWeeklyHours] = useState<number>(44);
  const [poopsPerDay, setPoopsPerDay] = useState<number>(2);
  const [poopDuration, setPoopDuration] = useState<number>(15);

  // Poop rain particle state
  const [particles, setParticles] = useState<PoopParticle[]>([]);
  const particleIdCounter = useRef<number>(0);

  // Simulated Global Poop Stats
  const [globalEarnings, setGlobalEarnings] = useState<number>(1524823.40);
  const [globalPoops, setGlobalPoops] = useState<number>(348230);

  // Mock Sommelier Social Feed State
  const [feed, setFeed] = useState<PoopPost[]>([
    {
      id: 1,
      author: "Carlos Caçador",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=carlos",
      rank: "👑 Trono de Ouro IV",
      time: "Há 12 min",
      content: "Resultado da feijoada de ontem à noite na firma. Foco total em bater a meta de cagadas remuneradas da semana! Consistência firme e textura padrão de exportação.",
      spoilerContent: "💩✨",
      revealed: false,
      likes: 8,
      poops: 34,
      flames: 12,
      comments: ["Obra prima da engenharia biológica!", "Isso sim é monetizar o tempo livre."]
    },
    {
      id: 2,
      author: "Juliana Toalete",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=juliana",
      rank: "🥉 Lama II",
      time: "Há 43 min",
      content: "Cagada sagrada pós-café. Fui do elo Lama I para Lama II! Cronometrados 18 minutos de pura introspecção remunerada.",
      spoilerContent: "☕🚽💨",
      revealed: false,
      likes: 15,
      poops: 19,
      flames: 26,
      comments: ["A clássica cagada do café nunca falha.", "Lindo avanço de elo, parabéns!"]
    }
  ]);

  // Update global live stats
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalEarnings((prev) => prev + Math.random() * 4.5);
      setGlobalPoops((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Launch poop rain function
  const triggerPoopRain = () => {
    const poopEmojis = ["💩", "🚽", "🧻", "💩", "💩"];
    const newParticles: PoopParticle[] = Array.from({ length: 25 }).map(() => {
      const id = particleIdCounter.current++;
      const left = `${Math.random() * 95}%`;
      const size = `${1.2 + Math.random() * 1.8}rem`;
      const duration = `${2.5 + Math.random() * 2}s`;
      const delay = `${Math.random() * 0.5}s`;
      const emoji = poopEmojis[Math.floor(Math.random() * poopEmojis.length)];
      return { id, left, duration, size, delay, emoji };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 5000);
  };

  // Calculator Math
  const weeksPerMonth = 4.33;
  const monthlyWorkHours = weeklyHours * weeksPerMonth;
  const hourlyWage = salary / (monthlyWorkHours || 1);
  const minuteWage = hourlyWage / 60;
  
  const dailyPoopMinutes = poopsPerDay * poopDuration;
  const dailyEarnings = dailyPoopMinutes * minuteWage;
  const weeklyEarnings = dailyEarnings * 5; // 5 working days
  const monthlyEarnings = dailyEarnings * 22; // 22 working days
  const yearlyEarnings = monthlyEarnings * 12;

  const percentageOfSalary = salary > 0 ? (monthlyEarnings / salary) * 100 : 0;
  const totalYearlyHours = ((poopsPerDay * poopDuration * 22 * 12) / 60);

  // Equivalents Math
  const toiletPaperPacks = Math.max(1, Math.round(yearlyEarnings / 4.5)); // Premium roll cost
  const laxativeBoxes = Math.max(1, Math.round(yearlyEarnings / 14)); // Laxative package cost
  const coffeeCups = Math.max(1, Math.round(yearlyEarnings / 6.0)); // Coffee cup cost

  // Interaction handlers for mock social posts
  const handleReveal = (id: number) => {
    setFeed((prev) =>
      prev.map((post) => (post.id === id ? { ...post, revealed: !post.revealed } : post))
    );
  };

  const handleReact = (postId: number, reaction: "poops" | "flames" | "likes") => {
    setFeed((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            [reaction]: post[reaction] + 1
          };
        }
        return post;
      })
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen pb-24 pt-28 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-all duration-300 relative overflow-hidden",
        font === "lexend" && "font-lexend",
        font === "atkinson" && "font-atkinson",
        font === "sans" && "font-sans"
      )}
    >
      {/* Poop rain container */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-fall select-none"
            style={{
              left: p.left,
              fontSize: p.size,
              top: "-50px",
              "--fall-duration": p.duration,
              animationDelay: p.delay
            } as React.CSSProperties}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Background Ripple & Light Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-0 opacity-40">
        <Ripple mainCircleSize={250} mainCircleOpacity={0.15} numCircles={6} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Visual Accessibility Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-md mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Accessibility className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Acessibilidade e Leitura</h4>
              <p className="text-xs text-muted-foreground">Escolha a fonte que reduz seu estresse visual</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFont("sans")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer",
                font === "sans"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 border-border hover:bg-muted text-foreground"
              )}
            >
              Padrão (Sans)
            </button>
            <button
              onClick={() => setFont("lexend")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl border transition-all font-lexend cursor-pointer",
                font === "lexend"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 border-border hover:bg-muted text-foreground"
              )}
            >
              Lexend (Recomendado)
            </button>
            <button
              onClick={() => setFont("atkinson")}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl border transition-all font-atkinson cursor-pointer",
                font === "atkinson"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 border-border hover:bg-muted text-foreground"
              )}
            >
              Atkinson Hyperlegible
            </button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <header className="text-center mb-16 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-extrabold shadow-sm border border-gold/40 mb-6"
          >
            <Sparkles className="size-4 text-accent animate-pulse" />
            <span>Transformando Necessidade em Lucro</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6 max-w-4xl mx-auto"
          >
            Cagada Remunerada: <br />
            <span className="bg-gradient-to-r from-poop via-accent to-gold bg-clip-text text-transparent">
              O Seu Trono Vale Ouro
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-medium"
          >
            Você faz a força, nós fazemos a conta. Calcule em tempo real o quanto você lucra ao usar o banheiro no expediente e junte-se à revolução do bem-estar intestinal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <RainbowButton onClick={triggerPoopRain} className="shadow-lg transform active:scale-95 transition-transform font-bold text-base h-12 px-8 rounded-xl cursor-pointer">
              Lançar Chuva de Coco 💩
            </RainbowButton>
            
            <a
              href="#calculadora"
              className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-bold px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Ir para Calculadora <ArrowRight className="size-4" />
            </a>
          </motion.div>
        </header>

        {/* Scroll Marquee (Magic UI Inspired) */}
        <div className="w-full overflow-hidden py-4 border-y border-border/80 bg-card/40 backdrop-blur-sm mb-16 relative">
          <ScrollVelocityContainer>
            <ScrollVelocityRow baseVelocity={3} className="text-xl sm:text-2xl font-black text-poop tracking-wider flex gap-8">
              <span className="mx-4">SHITGO</span>
              <span className="mx-4">💩</span>
              <span className="mx-4">CAGADA REMUNERADA</span>
              <span className="mx-4">💰</span>
              <span className="mx-4">LUCRO NO TRONO</span>
              <span className="mx-4">🚽</span>
              <span className="mx-4">SOMMELIER DE COCO</span>
              <span className="mx-4">🌟</span>
              <span className="mx-4">MONETIZE SUA CACA</span>
              <span className="mx-4">⚡</span>
            </ScrollVelocityRow>
          </ScrollVelocityContainer>
        </div>

        {/* Global Live Feed Tracker */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between p-6 rounded-2xl bg-card border border-border shadow-md"
          >
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Faturamento Global (Simulado)</p>
              <h3 className="text-3xl sm:text-4xl font-black text-gold tracking-tight mt-1">
                R$ {globalEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="size-4 text-green-500 animate-pulse" /> Lucros globais subindo em tempo real!
              </p>
            </div>
            <div className="text-4xl p-3 bg-secondary rounded-2xl border border-gold/30">💰</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between p-6 rounded-2xl bg-card border border-border shadow-md"
          >
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cagadas Registradas Hoje</p>
              <h3 className="text-3xl sm:text-4xl font-black text-poop tracking-tight mt-1">
                {globalPoops.toLocaleString("pt-BR")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Users className="size-4 text-accent" /> Profissionais ativos aliviando o orçamento.
              </p>
            </div>
            <div className="text-4xl p-3 bg-primary/10 rounded-2xl border border-primary/20">💩</div>
          </motion.div>
        </section>

        {/* Poop Calculator Container */}
        <section id="calculadora" className="mb-20 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2">Calculadora de Cagada Remunerada</h2>
            <p className="text-muted-foreground font-medium">Quanto dinheiro você lucra ao ir no banheiro durante o expediente de trabalho?</p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Input Panel */}
            <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col justify-between relative">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between text-sm font-bold mb-2">
                    <span>Salário Mensal (R$)</span>
                    <span className="text-primary font-black">R$ {salary.toLocaleString("pt-BR")}</span>
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="100"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xxs text-muted-foreground mt-1">
                    <span>R$ 1.000</span>
                    <span>R$ 10.000</span>
                    <span>R$ 20.000</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-bold mb-2">
                    <span>Horas Semanais de Trabalho</span>
                    <span className="text-primary font-black">{weeklyHours}h semanais</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="48"
                    step="1"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xxs text-muted-foreground mt-1">
                    <span>20h</span>
                    <span>40h</span>
                    <span>48h</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-bold mb-2">
                    <span>Idas ao Banheiro por Dia</span>
                    <span className="text-primary font-black">{poopsPerDay} idas</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={poopsPerDay}
                    onChange={(e) => setPoopsPerDay(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xxs text-muted-foreground mt-1">
                    <span>1 ida</span>
                    <span>3 idas</span>
                    <span>6 idas</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-bold mb-2">
                    <span>Minutos por Ida ao Banheiro</span>
                    <span className="text-primary font-black">{poopDuration} minutos</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={poopDuration}
                    onChange={(e) => setPoopDuration(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xxs text-muted-foreground mt-1">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-6 flex items-start gap-3">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Os cálculos assumem semanas de 5 dias úteis e um mês comercial de 22 dias de trabalho efetivo. O valor calculado é 100% livre de impostos da privada!
                </p>
              </div>
            </div>

            {/* Live Results Panel */}
            <div className="lg:col-span-7 relative rounded-2xl bg-card/60 backdrop-blur-md p-8 border border-border shadow-xl flex flex-col justify-between overflow-hidden">
              <ShineBorder borderWidth={2.5} shineColor={["var(--gold)", "var(--poop)", "var(--accent)"]} duration={7} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    <Coins className="size-5 text-gold" /> Relatório de Rendimentos
                  </h3>
                  <span className="text-xs bg-accent/20 text-accent font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {percentageOfSalary.toFixed(1)}% do salário faturado no trono
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Lucro por Minuto</span>
                    <p className="text-2xl font-black text-foreground">R$ {minuteWage.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Valor por Cagada</span>
                    <p className="text-2xl font-black text-foreground">R$ {(minuteWage * poopDuration).toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-background/80 p-6 rounded-2xl border border-border/80 mb-6 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-muted-foreground">Faturamento Diário:</span>
                    <span className="font-extrabold text-base text-foreground">R$ {dailyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-muted-foreground">Faturamento Mensal:</span>
                    <span className="font-black text-xl text-primary">R$ {monthlyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/60 pt-3">
                    <span className="font-extrabold text-sm text-muted-foreground flex items-center gap-1">
                      Faturamento Anual: <span className="animate-pulse">✨</span>
                    </span>
                    <span className="font-black text-3xl text-gold">R$ {yearlyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Funny equivalents */}
                <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-3">Equivalência de Prêmios Anuais</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/40 p-3 rounded-xl border border-gold/20 text-center">
                    <span className="text-xl">🧻</span>
                    <p className="text-sm font-black text-foreground mt-1">{toiletPaperPacks} rolos</p>
                    <span className="text-xxs text-muted-foreground">Papel Premium</span>
                  </div>
                  <div className="bg-secondary/40 p-3 rounded-xl border border-gold/20 text-center">
                    <span className="text-xl">🍓</span>
                    <p className="text-sm font-black text-foreground mt-1">{laxativeBoxes} caixas</p>
                    <span className="text-xxs text-muted-foreground">Laxante Rápido</span>
                  </div>
                  <div className="bg-secondary/40 p-3 rounded-xl border border-gold/20 text-center">
                    <span className="text-xl">☕</span>
                    <p className="text-sm font-black text-foreground mt-1">{coffeeCups} xícaras</p>
                    <span className="text-xxs text-muted-foreground">Café da Firma</span>
                  </div>
                </div>
              </div>

              {/* Extra fun stat */}
              <div className="relative z-10 border-t border-border/80 pt-4 mt-6 flex items-center justify-between text-xs text-muted-foreground font-bold">
                <span className="flex items-center gap-1.5"><Clock className="size-4 text-accent" /> Tempo acumulado no vaso:</span>
                <span className="text-foreground font-black bg-secondary px-2 py-0.5 rounded border border-gold/20">{totalYearlyHours.toFixed(0)} horas por ano</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid: App Roadmap */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black tracking-tight mb-2">Funcionalidades do MVP (2 Dias de Desenvolvimento)</h2>
            <p className="text-muted-foreground font-medium">Confira as ferramentas absurdas que estamos construindo para revolucionar sua rotina</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-md hover:border-gold/60 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-primary/10 size-12 rounded-xl flex items-center justify-center text-2xl mb-4 border border-primary/20">📱</div>
                <h3 className="font-extrabold text-lg mb-2">Cadastro & Perfil Customizado</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Defina seu salário, suas horas semanais e configure seu perfil único. Todo o tratamento de erros está incluso com mensagens dramáticas de primeira pessoa!
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-accent font-bold">
                <CheckCircle className="size-4 text-green-500" /> Pronto para produção
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-md hover:border-gold/60 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-primary/10 size-12 rounded-xl flex items-center justify-center text-2xl mb-4 border border-primary/20">🏆</div>
                <h3 className="font-extrabold text-lg mb-2">Ranking de Elos de Caca</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compita com seus amigos em grupos ou globalmente. Suba de elo desde a humilde &quot;Lama I&quot; até o majestoso &quot;Trono Divino III&quot;. O ranking reseta mensalmente!
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-accent font-bold">
                <Zap className="size-4 text-accent animate-pulse" /> Em desenvolvimento
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-md hover:border-gold/60 transition-all flex flex-col justify-between">
              <div>
                <div className="bg-primary/10 size-12 rounded-xl flex items-center justify-center text-2xl mb-4 border border-primary/20">🛍️</div>
                <h3 className="font-extrabold text-lg mb-2">A Lojinha do Banheiro</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ganhe pontos a cada ida ao banheiro e troque-os por incensos aromáticos, laxantes premium sabor morango ou resgate uma privada super tecnológica para sua casa!
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-accent font-bold">
                <ShoppingBag className="size-4 text-muted-foreground" /> Ideia aprovada
              </div>
            </div>
          </div>
        </section>

        {/* Sommelier de Coco Section (Feed de Bosta) */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">Sommelier de Coco (Feed de Bosta)</h2>
            <p className="text-muted-foreground font-medium">A primeira rede social escatológica com spoiler de caca e análise de saúde</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {feed.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-6 shadow-md relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="size-10 rounded-full bg-secondary border border-border" />
                    <div>
                      <h4 className="font-extrabold text-sm">{post.author}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xxs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black border border-primary/10">
                          {post.rank}
                        </span>
                        <span className="text-xxs text-muted-foreground">{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-green-500" /> Analisado por IA
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-foreground mb-4 leading-relaxed">{post.content}</p>

                {/* Visual Spoiler Container */}
                <div className="relative rounded-xl border border-border/80 overflow-hidden bg-background mb-4 text-center p-6 flex flex-col items-center justify-center min-h-[140px]">
                  {!post.revealed ? (
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-xl flex flex-col items-center justify-center p-4">
                      <ShieldAlert className="size-8 text-poop mb-2 animate-bounce" />
                      <p className="text-xs font-black text-foreground uppercase tracking-wider mb-2">
                        ⚠️ ALERTA DE SPOILER DE COCO
                      </p>
                      <button
                        onClick={() => handleReveal(post.id)}
                        className="px-4 py-2 text-xxs font-extrabold bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition cursor-pointer"
                      >
                        Visualizar Obra
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl animate-bounce">💩</span>
                      <span className="text-xs font-extrabold text-muted-foreground mt-2 uppercase tracking-wide">
                        Consistência: Fezes Tipo 4 (Macia e Lisa)
                      </span>
                      <button
                        onClick={() => handleReveal(post.id)}
                        className="mt-3 text-xxs font-bold text-muted-foreground underline hover:text-foreground cursor-pointer"
                      >
                        Ocultar imagem
                      </button>
                    </div>
                  )}
                  {/* Underlay just for fun decoration */}
                  <span className="text-sm font-bold text-muted-foreground/30">Visualização de Amostra Sanitária</span>
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                  <button
                    onClick={() => handleReact(post.id, "poops")}
                    className="flex items-center gap-1.5 text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full border border-gold/20 transition cursor-pointer"
                  >
                    <span>💩</span>
                    <span className="font-extrabold text-foreground">{post.poops}</span>
                  </button>
                  <button
                    onClick={() => handleReact(post.id, "flames")}
                    className="flex items-center gap-1.5 text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full border border-gold/20 transition cursor-pointer"
                  >
                    <span>🔥</span>
                    <span className="font-extrabold text-foreground">{post.flames}</span>
                  </button>
                  <button
                    onClick={() => handleReact(post.id, "likes")}
                    className="flex items-center gap-1.5 text-xs bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full border border-gold/20 transition cursor-pointer"
                  >
                    <span>❤️</span>
                    <span className="font-extrabold text-foreground">{post.likes}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="mt-4 bg-muted/40 p-4 rounded-xl space-y-2 border border-border/40">
                  <p className="text-xxs font-black text-muted-foreground uppercase tracking-widest mb-1">
                    Comentários Recentes
                  </p>
                  {post.comments.map((comment, index) => (
                    <p key={index} className="text-xs text-foreground leading-relaxed flex items-start gap-1">
                      <span className="font-bold shrink-0">Anonymous:</span>
                      <span className="text-muted-foreground">{comment}</span>
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="text-center bg-gradient-to-br from-poop/20 via-gold/10 to-accent/20 border border-gold/40 rounded-3xl p-10 relative overflow-hidden shadow-lg">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
            <span className="text-[200px] select-none">💩</span>
          </div>

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl font-black mb-4">Comece a Faturar no Trono Hoje</h2>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              Crie sua conta no Shitgo para salvar seus relatórios de rendimento, acompanhar o feed de análises e subir nas ligas de cagadores profissionais.
            </p>
            <RainbowButton onClick={triggerPoopRain} className="shadow-lg transform active:scale-95 transition-transform font-bold text-base h-12 px-8 rounded-xl cursor-pointer">
              Criar Conta Grátis 💩
            </RainbowButton>
          </div>
        </section>
      </div>
    </div>
  );
}
