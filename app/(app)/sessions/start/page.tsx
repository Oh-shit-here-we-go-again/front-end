"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Clock, Play, Square, CheckCircle, Info, Sparkles } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShineBorder } from "@/components/ui/shine-border";

export default function StartSessionPage() {
  const { user } = useAuth();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0); // in seconds
  const [note, setNote] = useState("");
  const [finished, setFinished] = useState(false);
  const [savedEarnings, setSavedEarnings] = useState(0);

  const incrementRef = useRef<NodeJS.Timeout | null>(null);

  // Wage Math
  const salary = user?.monthly_salary || 3500;
  const hours = 44; // CLT padrão
  const hourlyRate = salary / (hours * 4.33);
  const secondRate = hourlyRate / 3600;

  const currentEarnings = time * secondRate;

  useEffect(() => {
    if (isActive && !isPaused) {
      incrementRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (incrementRef.current) clearInterval(incrementRef.current);
    }

    return () => {
      if (incrementRef.current) clearInterval(incrementRef.current);
    };
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleFinish = () => {
    setIsActive(false);
    setIsPaused(true);
    setSavedEarnings(currentEarnings);
    setFinished(true);

    // Save to local storage mock history
    const newSession = {
      id: Math.random(),
      date: "Hoje",
      duration: Math.max(1, Math.round(time / 60)),
      earned: Number(currentEarnings.toFixed(2)),
      note: note || "Cagada de expediente"
    };

    console.log("Saved Poop Session:", newSession);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <span className="text-6xl animate-bounce inline-block">🎉</span>
        <h2 className="text-3xl font-black text-foreground mt-6">Obra Concluída!</h2>
        <p className="text-muted-foreground mt-2">Você concluiu seu dever e faturou com sucesso!</p>

        <div className="bg-card border border-border p-8 rounded-3xl mt-8 shadow-lg relative overflow-hidden">
          <ShineBorder borderWidth={2} shineColor="var(--gold)" duration={6} />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">
            Rendimento da Sessão
          </span>
          <h3 className="text-4xl font-black text-gold">R$ {savedEarnings.toFixed(2)}</h3>
          <p className="text-xs text-muted-foreground mt-4">
            Tempo gasto: {Math.max(1, Math.round(time / 60))} min ({time}s)
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => { window.location.href = "/dashboard"; }}
            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl cursor-pointer hover:bg-primary/95 transition-all"
          >
            Voltar ao Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-foreground">Bater Ponto Remunerado</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Não faça isso de graça. Inicie o cronômetro antes de se sentar.
        </p>
      </div>

      {/* Timer and Earnings Displays */}
      <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-lg mb-6 relative overflow-hidden">
        {isActive && !isPaused && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500/10 text-green-500 border border-green-500/20 text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            <span className="size-1.5 bg-green-500 rounded-full inline-block" /> Faturando
          </div>
        )}

        <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          Lucro Acumulado
        </span>
        <h2 className="text-5xl font-black text-gold tracking-tight mb-4">
          R$ {currentEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
        </h2>

        <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-2xl border border-border/60">
          <Clock className="size-4 text-primary" />
          <span className="font-black text-lg text-foreground font-mono">{formatTime(time)}</span>
        </div>
      </div>

      {/* Note input */}
      <div className="mb-6">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          O que você está fazendo? (Opcional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex: Refletindo sobre a reunião trimestral"
          disabled={isActive && !isPaused}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all"
        />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {isPaused ? (
          <RainbowButton onClick={handleStart} className="w-full h-14 rounded-xl text-base font-black cursor-pointer shadow-md">
            <Play className="size-5 shrink-0" /> {time > 0 ? "Retomar Cagada" : "Iniciar Cagada 🚽"}
          </RainbowButton>
        ) : (
          <button
            onClick={handlePause}
            className="w-full h-14 bg-card border border-border hover:bg-muted font-black text-foreground rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Square className="size-5 shrink-0 text-red-500" /> Pausar Sessão
          </button>
        )}

        {time > 0 && (
          <button
            onClick={handleFinish}
            className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-sm"
          >
            <CheckCircle className="size-4 shrink-0" /> Concluir Obra (Faturar!)
          </button>
        )}
      </div>

      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mt-8 flex items-start gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xxs text-muted-foreground leading-relaxed">
          Sua privacidade é nossa prioridade absoluta. Nenhum dado de câmera ou imagem é transmitido sem o seu consentimento. Seu dinheiro é calculado localmente.
        </p>
      </div>
    </div>
  );
}
