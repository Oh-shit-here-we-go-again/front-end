"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Coins, Trophy, Calendar, Clock, DollarSign, Plus, ArrowUpRight } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";
import { sessionService } from "../services/sessionService";
import { DjangoSession } from "../types/session.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardScreen() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<DjangoSession[]>([]);
  const [panicModalOpen, setPanicModalOpen] = useState(false);
  const [panicMessage, setPanicMessage] = useState("");

  const triggerDramaticPanic = () => {
    const PANIC_ERRORS = [
      "O desespero me consome por completo! Eu acabei de concluir com êxito a minha produção diária remunerada, mas ao olhar para o lado... o rolo está completamente nu! Não sobrou sequer uma folha de papel higiênico no banheiro da empresa. Estou aqui preso no cubículo, em silêncio absoluto, ouvindo os passos dos meus colegas no corredor e implorando para que alguém venha me salvar!",
      "Eu estava lá, na minha paz sagrada, faturando mais R$ 2,50 de tempo remunerado longe do computador, quando ouço passos pesados. De repente, três batidas secas na porta e a voz do meu chefe ressoa: 'Você está aí? A planilha de fechamento é pra agora!'. Minha pressão caiu instantaneamente, meu coração disparou de pânico e eu só consegui dar descarga no desespero para fingir que estava saindo!",
      "Estou vivendo o pior pesadelo do trabalhador CLT! O meu tempo no banheiro está se estendendo além do limite de segurança dos 15 minutos clássicos. Eu passo o papel, olho, e a limpeza parece incompleta... Passo de novo, e nada de limpar por completo! A paranoia está me devorando: o RH vai rastrear minha ausência? O gerente vai me dar advertência? Minhas pernas estão dormentes e eu não consigo sair desse ciclo infinito de limpeza!",
      "Eu achei que estava sozinho na minha fortaleza de paz, mas a porta principal do banheiro abriu com força. Dois colegas do time de vendas entraram e começaram a lavar as mãos enquanto comentavam fofocas do escritório. Fiquei paralisado no cubículo, segurando a respiração para não fazer o menor ruído e revelar a minha identidade secreta. A vergonha de ser descoberto faturando em silêncio me mata!",
      "Eu estiquei tanto a minha pausa remunerada que a tragédia física me atingiu sem piedade. Quando finalmente decidi que já tinha lucrado o suficiente (R$ 8,00 na cotação do meu salário), tentei ficar de pé, mas minhas pernas estavam completamente dormentes! Pareciam duas gelatinas sem vida. Eu desabei no chão do cubículo, tateando a parede e rastejando de volta para tentar reativar a circulação antes que alguém entre!",
      "Eu decidi usar o banheiro da diretoria no 5º andar para cagar com o luxo que eu mereço. Mas a minha produção foi tão intensa e expressiva que o ambiente ficou completamente insuportável! De repente, ouço a maçaneta girar... É o diretor financeiro entrando! Eu estou trancado aqui dentro, suando frio de pânico, sabendo que se eu abrir essa porta e ele sentir o bouquet da minha produção, minha demissão será assinada hoje mesmo!",
      "Eu puxei a descarga com orgulho após uma sessão monumental... mas a água começou a subir em vez de descer! O pânico foi imediato. A água está subindo, quase transbordando, e o meu barro colossal está flutuando como uma boia do desespero. O que eu faço?! Se eu sair correndo, vão me rastrear pelas câmeras do corredor! Se eu ficar, serei o responsável pelo maior alagamento fecal da história do escritório!",
      "A segunda-feira mal começou e a minha barriga deu um nó violento logo após o café da copa da firma. Eu corri desesperado para o banheiro e desabei no vaso. Estou aqui deitado em suor frio, ouvindo os alarmes de reuniões apitando no meu celular no bolso. Eu só queria uma manhã de trabalho normal, mas minhas entranhas decidiram fazer uma revolução sindical contra o meu próprio corpo!",
      "O silêncio no banheiro do escritório era absoluto, quase solene... até que eu soltei uma nota sonora que ecoou como um trovão de pânico pelas paredes de azulejo! O eco foi tão violento que o encarregado do RH, que estava no mictório ao lado, parou imediatamente o que estava fazendo. A humilhação de ter a minha identidade associada àquele estrondo vai me forçar a pedir demissão!",
      "Eu caí na armadilha clássica: tomei três cafezinhos de graça da máquina da empresa para ter energia para trabalhar. A consequência foi instantânea e devastadora. Minha barriga começou a gritar em pânico e eu tive que correr para o trono. Agora estou preso aqui, desidratando e faturando centavos enquanto o meu estômago reclama das minhas decisões de vida corporativa!",
      "Eu fui usar o banheiro comum no subsolo da empresa e o assento de plástico estava tão congelante que o choque térmico contra a minha pele fez a minha alma sair do corpo por alguns segundos! Eu contraí instantaneamente toda a minha musculatura de sustentação, a minha produção recuou assustada para o fundo das minhas entranhas e eu esqueci até qual era a minha meta diária de trabalho!"
    ];
    const randomIndex = Math.floor(Math.random() * PANIC_ERRORS.length);
    setPanicMessage(PANIC_ERRORS[randomIndex]);
    setPanicModalOpen(true);
  };

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
  const dailySessions = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach(s => {
    const sDate = new Date(s.created_at);
    if (sDate >= startOfWeek && sDate < endOfWeek) {
      const day = sDate.getDay();
      const dayIndex = day === 0 ? 6 : day - 1;
      dailyEarnings[dayIndex] += Number(s.earnings || 0);
      dailySessions[dayIndex] += 1;
    }
  });

  const totalWeekEarnings = dailyEarnings.reduce((a, b) => a + b, 0);

  const finalDailyEarnings = dailyEarnings;
  const finalDailySessions = dailySessions;
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
            {finalDailySessions.map((sessionsCount, idx) => {
              const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
              const isToday = idx === (now.getDay() === 0 ? 6 : now.getDay() - 1);
              const maxVal = Math.max(...finalDailySessions, 1);
              const barHeight = (sessionsCount / maxVal) * 80;
              
              return (
                <div key={dayNames[idx]} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className={cn(
                    "text-xs font-bold font-mono",
                    isToday ? "text-amber-600 dark:text-gold font-extrabold" : "text-muted-foreground/60"
                  )}>
                    {sessionsCount > 0 ? sessionsCount : "—"}
                  </span>
                  
                  <div className="w-full flex justify-center items-end h-20">
                    <div 
                      className={cn(
                        "w-6 sm:w-8 rounded-t-md transition-all duration-500",
                        isToday 
                          ? "bg-gradient-to-t from-amber-600 to-gold dark:from-accent dark:to-gold shadow-[0_0_12px_rgba(217,119,6,0.3)] dark:shadow-[0_0_15px_oklch(var(--gold)/0.4)]" 
                          : "bg-poop/10 hover:bg-poop/20 dark:bg-muted/40 dark:hover:bg-muted/60"
                      )}
                      style={{ height: sessionsCount > 0 ? `${barHeight}%` : "6px" }}
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

      {/* Deu merda emergency button */}
      <div className="bg-red-500/5 border-2 border-red-500/25 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-6">
        <div>
          <h4 className="font-extrabold text-base text-red-600 flex items-center gap-1.5 font-mono">
            🚨 BOTÃO DE EMERGÊNCIA: DEU MERDA!
          </h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-lg">
            Acabou o papel? O chefe bateu na porta? Sente o pânico total? Use o botão de emergência para relatar a sua tragédia instantânea ao servidor.
          </p>
        </div>
        <button
          onClick={triggerDramaticPanic}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap uppercase tracking-widest flex items-center gap-2 animate-pulse"
        >
          💩 Deu Merda!
        </button>
      </div>

      {/* Dramatic Fecal Panic Modal */}
      <Dialog open={panicModalOpen} onOpenChange={setPanicModalOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl border-4 border-red-600/35 bg-gradient-to-br from-red-50/98 via-stone-50/98 to-red-100/90 dark:from-stone-950 dark:via-stone-900/95 dark:to-red-950/60 dark:border-red-700/35 shadow-2xl overflow-hidden text-center flex flex-col items-center justify-center gap-4 backdrop-blur-md">
          <DialogHeader className="pb-2 border-b border-red-600/20 w-full shrink-0">
            <DialogTitle className="text-lg font-serif italic text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
              🚨 COMUNICADO DE TRAGÉDIA 🚨
            </DialogTitle>
            <p className="text-[9px] text-stone-500 dark:text-stone-400 font-mono tracking-widest uppercase">
              Relatório em Primeira Pessoa de Colapso Interno
            </p>
          </DialogHeader>

          <div className="text-6xl animate-bounce my-2 select-none">
            😱🚽💥
          </div>

          <p className="text-sm font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed px-2 bg-white/70 dark:bg-stone-900/70 p-5 rounded-2xl border border-red-600/10 shadow-inner max-h-[30vh] overflow-y-auto">
            "{panicMessage}"
          </p>

          <button
            onClick={() => setPanicModalOpen(false)}
            className="mt-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer w-full max-w-[200px]"
          >
            Assumir a Culpa 😔
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
