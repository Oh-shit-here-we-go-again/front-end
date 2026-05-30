"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Coins, Trophy, Calendar, Clock, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { sessionService } from "../services/sessionService";
import { DjangoSession } from "../types/session.types";

export function DashboardScreen() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DjangoSession[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await sessionService.fetchSessions();
        setSessions(data);
      } catch (err) {
        console.error("Erro ao carregar sessões no dashboard:", err);
        setSessions([]);
      }
    };
    if (user) {
      loadSessions();
    }
  }, [user]);

  const userName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ""}`.trim() 
    : user?.username || "Colaborador";
  const userSalary = user?.monthly_salary || 3500;
  const userHours = 44; // CLT padrão

  const hourlyRate = userSalary / (userHours * 4.33);
  const minRate = hourlyRate / 60;

  // Calculate totals
  const totalEarned = sessions.reduce((sum, s) => sum + Number(s.earnings || 0), 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + Math.round((s.duration_seconds || 0) / 60), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Estatísticas de Merda</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Olá, {userName}! Seu tempo é precioso. Continue faturando no banheiro.
          </p>
        </div>

        <Link
          href="/sessions/start"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl hover:bg-primary/95 transition-all shadow-md cursor-pointer text-sm"
        >
          <Plus className="size-4" /> Bater Ponto (Cagar)
        </Link>
      </div>

      {/* Grid: Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="relative rounded-2xl bg-card border border-border p-6 shadow-md flex flex-col justify-between overflow-hidden">
          <ShineBorder borderWidth={2} shineColor="var(--gold)" duration={10} />
          <div className="relative z-10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Lucrado</span>
            <h3 className="text-3xl font-black text-gold">R$ {totalEarned.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
            <p className="text-xxs text-muted-foreground mt-3 flex items-center gap-1">
              <Coins className="size-3.5 text-gold animate-bounce" /> Equivale a {(totalEarned * 10).toFixed(0)} ShitCoins!
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tempo Remunerado</span>
            <h3 className="text-3xl font-black text-primary">{totalMinutes} min</h3>
            <p className="text-xxs text-muted-foreground mt-3">
              {(totalMinutes / 60).toFixed(1)} horas fora da mesa de trabalho.
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tarifa do Banheiro</span>
            <h3 className="text-3xl font-black text-accent">R$ {minRate.toFixed(2)}/min</h3>
            <p className="text-xxs text-muted-foreground mt-3">
              Baseado no salário de R$ {userSalary.toLocaleString("pt-BR")}.
            </p>
          </div>
        </div>
      </div>

      {/* Session log */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-md mb-8">
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Calendar className="size-5 text-primary" /> Histórico de Alívios
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Últimas 4 sessões</span>
        </div>

        <div className="divide-y divide-border/60">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-2">🧻</span>
              <p className="text-sm font-bold text-muted-foreground">Você ainda não faturou no trono.</p>
              <p className="text-xs text-muted-foreground mt-1">Vá ao banheiro e bata seu ponto para começar!</p>
            </div>
          ) : (
            sessions.map((s) => {
              const formattedDate = new Date(s.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short"
              });
              const durationMin = Math.round((s.duration_seconds || 0) / 60);

              return (
                <div key={s.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-foreground">Sessão Remunerada</span>
                      <span className="text-xxs bg-muted px-2 py-0.5 rounded text-muted-foreground font-bold">{formattedDate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="size-3.5" /> {durationMin} minutos de duração
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-base text-gold">+ R$ {Number(s.earnings).toFixed(2)}</span>
                    <p className="text-xxs text-muted-foreground">Faturados</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CLT Motivation card */}
      <div className="bg-gradient-to-r from-poop/15 via-gold/5 to-accent/15 border border-border rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-base flex items-center gap-1.5">
            🏆 Torneio Semanal CLT <span className="animate-pulse">🔥</span>
          </h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-lg">
            Participe da liga de cagadores profissionais da sua empresa. Quem ficar no Top 3 do ranking semanal ganha 500 moedas extras para a Lojinha!
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-black text-muted-foreground cursor-not-allowed whitespace-nowrap"
        >
          Leaderboard (Em breve 🚧)
        </span>
      </div>
    </div>
  );
}
