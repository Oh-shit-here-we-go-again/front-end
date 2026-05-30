"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Coins, Trophy, Calendar, Clock, DollarSign, Play, ArrowUpRight, Plus } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Custom mock data for sessions
  const [sessions, setSessions] = useState([
    { id: 1, date: "Hoje", duration: 18, earned: 11.20, note: "Pós-almoço remunerado" },
    { id: 2, date: "Ontem", duration: 15, earned: 9.30, note: "Cagada tática matinal" },
    { id: 3, date: "28 Mai", duration: 25, earned: 15.50, note: "Intensa reflexão sobre a carreira" },
    { id: 4, date: "27 Mai", duration: 12, earned: 7.44, note: "Rápida do café da tarde" }
  ]);

  const userName = user?.name || "Colaborador";
  const userSalary = user?.salary || 3500;
  const userHours = user?.weeklyHours || 44;

  const hourlyRate = userSalary / (userHours * 4.33);
  const minRate = hourlyRate / 60;

  // Calculate totals
  const totalEarned = sessions.reduce((sum, s) => sum + s.earned, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Olá, {userName}! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seu tempo é precioso. Continue faturando no banheiro.
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
          {sessions.map((s) => (
            <div key={s.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-foreground">{s.note}</span>
                  <span className="text-xxs bg-muted px-2 py-0.5 rounded text-muted-foreground font-bold">{s.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="size-3.5" /> {s.duration} minutos de duração
                </p>
              </div>
              <div className="text-right">
                <span className="font-black text-base text-gold">+ R$ {s.earned.toFixed(2)}</span>
                <p className="text-xxs text-muted-foreground">Faturados</p>
              </div>
            </div>
          ))}
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
        <Link
          href="/ranking"
          className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline whitespace-nowrap"
        >
          Ver Leaderboard <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
