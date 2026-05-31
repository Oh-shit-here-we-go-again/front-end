"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Clock, Play, Square, CheckCircle, Info } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShineBorder } from "@/components/ui/shine-border";
import { apiFetch } from "@/lib/api";

export function StartSessionScreen() {
  const { user, updateUser } = useAuth();

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0); // in seconds
  const [note, setNote] = useState("");
  const [finished, setFinished] = useState(false);
  const [savedEarnings, setSavedEarnings] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const incrementRef = useRef<NodeJS.Timeout | null>(null);

  // Wage Math
  const salary = user?.monthly_salary || 3500;
  const hours = 44; // CLT padrão
  const hourlyRate = salary / (hours * 4.33);
  const secondRate = hourlyRate / 3600;

  const currentEarnings = time * secondRate;

  // Restore active session on mount
  useEffect(() => {
    const savedId = localStorage.getItem("active_poop_session_id");
    const savedStart = localStorage.getItem("active_poop_session_start");
    const savedNote = localStorage.getItem("active_poop_session_note");

    if (savedId && savedStart) {
      setSessionId(savedId);
      setIsActive(true);
      setIsPaused(false);
      if (savedNote) setNote(savedNote);

      const elapsedSeconds = Math.floor((Date.now() - Number(savedStart)) / 1000);
      setTime(elapsedSeconds);
    }
  }, []);

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

  // Sync note to localStorage in case page reloads
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("active_poop_session_note", note);
    }
  }, [note, sessionId]);

  const handleStart = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (!sessionId) {
        const sessionData = await apiFetch("/api/sessions/start/", {
          method: "POST",
        }) as any;
        setSessionId(sessionData.id);
        localStorage.setItem("active_poop_session_id", sessionData.id);
        localStorage.setItem("active_poop_session_start", Date.now().toString());
      }
      setIsActive(true);
      setIsPaused(false);
    } catch (err) {
      console.error("Erro ao iniciar sessão no trono:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    if (!photoFile) {
      setErrorMessage("Por favor, selecione ou tire uma foto para servir de comprovante no trono.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const finishedSession = await apiFetch(`/api/sessions/${sessionId}/stop/`, {
        method: "POST",
        body: formData,
      }) as any;

      setIsActive(false);
      setIsPaused(true);
      setSavedEarnings(Number(finishedSession.earnings || currentEarnings));
      setFinished(true);

      // Clean local storage
      localStorage.removeItem("active_poop_session_id");
      localStorage.removeItem("active_poop_session_start");
      localStorage.removeItem("active_poop_session_note");

      // Refetch user context data to update ShitCoins in Header/Dock immediately
      const updatedUser = await apiFetch("/api/auth/me/") as any;
      updateUser(updatedUser);
    } catch (err) {
      console.error("Erro ao encerrar sessão no trono:", err);
    } finally {
      setLoading(false);
    }
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
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 transition-all"
        />
      </div>

      {/* Photo File upload */}
      <div className="mb-6">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
          Comprovante da Obra Construida (Foto Obrigatória)
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setPhotoFile(e.target.files[0]);
              setErrorMessage(null);
            }
          }}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
        />
        {photoFile && (
          <p className="text-xxs text-green-500 font-bold mt-1.5">
            ✓ Arquivo selecionado: {photoFile.name}
          </p>
        )}
        {errorMessage && (
          <p className="text-xs text-red-500 font-bold mt-2">
            ⚠️ {errorMessage}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {isPaused ? (
          <RainbowButton
            onClick={handleStart}
            disabled={loading}
            className="w-full h-14 rounded-xl text-base font-black cursor-pointer shadow-md"
          >
            <Play className="size-5 shrink-0" /> {loading ? "Iniciando..." : time > 0 ? "Retomar Cagada" : "Iniciar Cagada 🚽"}
          </RainbowButton>
        ) : (
          <button
            onClick={handlePause}
            disabled={loading}
            className="w-full h-14 bg-card border border-border hover:bg-muted font-black text-foreground rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Square className="size-5 shrink-0 text-red-500" /> Pausar Sessão
          </button>
        )}

        {time > 0 && (
          <button
            onClick={handleFinish}
            disabled={loading}
            className="w-full h-12 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-sm disabled:opacity-60"
          >
            <CheckCircle className="size-4 shrink-0" /> {loading ? "Finalizando..." : "Concluir Obra (Faturar!)"}
          </button>
        )}
      </div>

      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mt-8 flex items-start gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xxs text-muted-foreground leading-relaxed">
          Sua privacidade é nossa prioridade absoluta. Nenhum dado de câmera ou imagem é transmitido sem o seu consentimento. Seu dinheiro é calculated localmente.
        </p>
      </div>
    </div>
  );
}
