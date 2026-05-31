"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Coins, Trophy, Calendar, Clock, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";
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

  // Calculate weekly earnings dynamically from sessions
  const now = new Date();
  const currentDay = now.getDay();
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - distanceToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const dailyEarnings = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach(s => {
    const sDate = new Date(s.created_at);
    if (sDate >= startOfWeek && sDate < endOfWeek) {
      const day = sDate.getDay();
      const dayIndex = day === 0 ? 6 : day - 1;
      dailyEarnings[dayIndex] += Number(s.earnings || 0);
    }
  });

  const totalWeekEarnings = dailyEarnings.reduce((a, b) => a + b, 0);

  const finalDailyEarnings = dailyEarnings;
  const finalTotalWeekEarnings = totalWeekEarnings;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Dashboard de Merda</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Olá, {userName}! Seu tempo é precioso. Continue faturando no banheiro.
          </p>
        </div>
      </div>

      {/* Grid: Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="relative rounded-2xl bg-card border border-border p-6 shadow-md flex flex-col justify-between overflow-hidden">
          <ShineBorder borderWidth={2} shineColor="var(--gold)" duration={10} />
          <div className="relative z-10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Lucrado</span>
            <h3 className="text-3xl font-black text-amber-700 dark:text-gold">R$ {totalEarned.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
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
            <h3 className="text-3xl font-black text-amber-600 dark:text-accent">R$ {minRate.toFixed(2)}/min</h3>
            <p className="text-xxs text-muted-foreground mt-3">
              Baseado no salário de R$ {userSalary.toLocaleString("pt-BR")}.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Earnings Chart */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 text-foreground">
            📊 Ganhos da Semana
          </h3>
          <span className="font-black text-lg text-green-600 dark:text-green-400">
            R$ {finalTotalWeekEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-md">
          <div className="flex justify-between items-end h-32 gap-2 sm:gap-4 px-2">
            {finalDailyEarnings.map((val, idx) => {
              const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
              const isToday = idx === (now.getDay() === 0 ? 6 : now.getDay() - 1);
              const maxVal = Math.max(...finalDailyEarnings, 1);
              const barHeight = (val / maxVal) * 80;
              
              return (
                <div key={dayNames[idx]} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className={cn(
                    "text-xs font-bold font-mono",
                    isToday ? "text-amber-600 dark:text-gold font-extrabold" : "text-muted-foreground/60"
                  )}>
                    {val > 0 ? val.toFixed(0) : "—"}
                  </span>
                  
                  <div className="w-full flex justify-center items-end h-20">
                    <div 
                      className={cn(
                        "w-6 sm:w-8 rounded-t-md transition-all duration-500",
                        isToday 
                          ? "bg-gradient-to-t from-amber-600 to-gold dark:from-accent dark:to-gold shadow-[0_0_12px_rgba(217,119,6,0.3)] dark:shadow-[0_0_15px_oklch(var(--gold)/0.4)]" 
                          : "bg-poop/10 hover:bg-poop/20 dark:bg-muted/40 dark:hover:bg-muted/60"
                      )}
                      style={{ height: val > 0 ? `${barHeight}%` : "6px" }}
                    />
                  </div>

                  <span className={cn(
                    "text-xs font-semibold mt-1",
                    isToday ? "text-amber-700 dark:text-gold font-black" : "text-muted-foreground"
                  )}>
                    {dayNames[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Session log */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-md mb-8">
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Calendar className="size-5 text-primary" /> Histórico de Alívios
          </h3>
          <span className="text-xs text-muted-foreground font-medium">Todas as sessões</span>
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
