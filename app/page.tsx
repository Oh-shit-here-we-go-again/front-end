"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Coins,
  Accessibility,
  Clock,
  Info,
} from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShineBorder } from "@/components/ui/shine-border";
import { Ripple } from "@/components/ui/ripple";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { cn } from "@/lib/utils";

// Landing components
import { Header } from "@/components/header/header";
import { PitchSection } from "@/components/landing/PitchSection";
import { StorySection } from "@/components/landing/StorySection";
import { CTASection } from "@/components/landing/CTASection";

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



  return (
    <>
      <Header />
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
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-card/60 backdrop-blur-md border border-border/80 shadow-md mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
              <Accessibility className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Acessibilidade e Leitura</h4>
              <p className="text-xs text-muted-foreground hidden sm:block">Escolha a fonte que reduz seu estresse visual</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFont("sans")}
              className={cn(
                "flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer",
                font === "sans"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 border-border hover:bg-muted text-foreground"
              )}
            >
              Padrão
            </button>
            <button
              onClick={() => setFont("lexend")}
              className={cn(
                "flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-bold rounded-xl border transition-all font-lexend cursor-pointer",
                font === "lexend"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 border-border hover:bg-muted text-foreground"
              )}
            >
              Lexend
            </button>
            <button
              onClick={() => setFont("atkinson")}
              className={cn(
                "flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-bold rounded-xl border transition-all font-atkinson cursor-pointer",
                font === "atkinson"
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 border-border hover:bg-muted text-foreground"
              )}
            >
              Atkinson
            </button>
          </div>
        </motion.div>

        {/* ===== PITCH / HERO SECTION (from landing component) ===== */}
        <PitchSection />

        {/* Scroll Marquee */}
        <div className="w-full overflow-hidden py-3 sm:py-4 border-y border-border/80 bg-card/40 backdrop-blur-sm mb-12 sm:mb-16 relative">
          <ScrollVelocityContainer>
            <ScrollVelocityRow baseVelocity={3} className="text-lg sm:text-2xl font-black text-poop tracking-wider flex gap-8">
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



        {/* ===== CALCULATOR SECTION ===== */}
        <section id="calculadora" className="mb-16 sm:mb-20 scroll-mt-24">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Calculadora de Cagada Remunerada</h2>
            <p className="text-muted-foreground font-medium text-sm sm:text-base">Quanto dinheiro você lucra ao ir no banheiro durante o expediente de trabalho?</p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Input Panel */}
            <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-md flex flex-col justify-between relative">
              <div className="space-y-5 sm:space-y-6">
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
                    <span>Horas Semanais</span>
                    <span className="text-primary font-black">{weeklyHours}h</span>
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
                    <span>Idas ao Banheiro / Dia</span>
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
                    <span>Minutos por Ida</span>
                    <span className="text-primary font-black">{poopDuration} min</span>
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

              <div className="bg-primary/5 p-3 sm:p-4 rounded-xl border border-primary/10 mt-5 sm:mt-6 flex items-start gap-3">
                <Info className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Os cálculos assumem semanas de 5 dias úteis e um mês comercial de 22 dias de trabalho efetivo. O valor calculado é 100% livre de impostos da privada!
                </p>
              </div>
            </div>

            {/* Live Results Panel */}
            <div className="lg:col-span-7 relative rounded-2xl bg-card/60 backdrop-blur-md p-5 sm:p-8 border border-border shadow-xl flex flex-col justify-between overflow-hidden">
              <ShineBorder borderWidth={2.5} shineColor={["var(--gold)", "var(--poop)", "var(--accent)"]} duration={7} />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/80 pb-4 mb-5 sm:mb-6 gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                    <Coins className="size-5 text-gold" /> Relatório de Rendimentos
                  </h3>
                  <span className="text-xs bg-accent/20 text-accent font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {percentageOfSalary.toFixed(1)}% do salário
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Lucro por Minuto</span>
                    <p className="text-xl sm:text-2xl font-black text-foreground">R$ {minuteWage.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">Valor por Cagada</span>
                    <p className="text-xl sm:text-2xl font-black text-foreground">R$ {(minuteWage * poopDuration).toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-background/80 p-4 sm:p-6 rounded-2xl border border-border/80 mb-5 sm:mb-6 space-y-3 sm:space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-muted-foreground">Faturamento Diário:</span>
                    <span className="font-extrabold text-sm sm:text-base text-foreground">R$ {dailyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-muted-foreground">Faturamento Mensal:</span>
                    <span className="font-black text-lg sm:text-xl text-primary">R$ {monthlyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-border/60 pt-3 gap-1">
                    <span className="font-extrabold text-sm text-muted-foreground flex items-center gap-1">
                      Faturamento Anual: <span className="animate-pulse">✨</span>
                    </span>
                    <span className="font-black text-2xl sm:text-3xl text-gold">R$ {yearlyEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Funny equivalents */}
                <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-3">Equivalência de Prêmios Anuais</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-secondary/40 p-2 sm:p-3 rounded-xl border border-gold/20 text-center">
                    <span className="text-lg sm:text-xl">🧻</span>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-1">{toiletPaperPacks} rolos</p>
                    <span className="text-xxs text-muted-foreground hidden sm:block">Papel Premium</span>
                  </div>
                  <div className="bg-secondary/40 p-2 sm:p-3 rounded-xl border border-gold/20 text-center">
                    <span className="text-lg sm:text-xl">🍓</span>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-1">{laxativeBoxes} caixas</p>
                    <span className="text-xxs text-muted-foreground hidden sm:block">Laxante Rápido</span>
                  </div>
                  <div className="bg-secondary/40 p-2 sm:p-3 rounded-xl border border-gold/20 text-center">
                    <span className="text-lg sm:text-xl">☕</span>
                    <p className="text-xs sm:text-sm font-black text-foreground mt-1">{coffeeCups} xícaras</p>
                    <span className="text-xxs text-muted-foreground hidden sm:block">Café da Firma</span>
                  </div>
                </div>
              </div>

              {/* Extra fun stat */}
              <div className="relative z-10 border-t border-border/80 pt-4 mt-5 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground font-bold">
                <span className="flex items-center gap-1.5"><Clock className="size-4 text-accent" /> Tempo acumulado no vaso:</span>
                <span className="text-foreground font-black bg-secondary px-2 py-0.5 rounded border border-gold/20">{totalYearlyHours.toFixed(0)} horas por ano</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STORY SECTION (from landing component) ===== */}
        <StorySection />



        {/* ===== CTA SECTION (from landing component) ===== */}
        <CTASection />
      </div>
    </div>
  </>
  );
}
