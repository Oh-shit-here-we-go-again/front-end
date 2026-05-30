// components/landing/WeeklyChampionship.tsx
"use client";

import { motion } from "motion/react";
import { Trophy, Medal, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

const weeklyRanking = [
  { name: "cagador_pro", poops: 42, earnings: 187.50, prize: 500 },
  { name: "trono_de_ouro", poops: 38, earnings: 162.30, prize: 300 },
  { name: "flatulencia_master", poops: 35, earnings: 149.90, prize: 200 },
  { name: "reis_da_pressa", poops: 29, earnings: 120.40, prize: 100 },
  { name: "cafe_com_leite", poops: 27, earnings: 110.20, prize: 50 },
];

export function WeeklyChampionship() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight mb-2">
          🏆 Campeonato Semanal 🏆
        </h2>
        <p className="text-muted-foreground font-medium max-w-xl mx-auto">
          Toda semana, os 5 profissionais que mais cagarem ganham ShitCoins para gastar na lojinha. 
          O topo do ranking leva 500 moedas — e muito respeito na comunidade.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <div className="grid grid-cols-12 gap-2 bg-secondary/50 p-3 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Cagador</div>
          <div className="col-span-2 text-center">💩 / semana</div>
          <div className="col-span-2 text-center">💰 Lucro</div>
          <div className="col-span-2 text-center">🏆 Prêmio</div>
        </div>
        {weeklyRanking.map((user, idx) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
            className={cn(
              "grid grid-cols-12 gap-2 p-3 items-center border-b border-border/60 hover:bg-muted/30 transition",
              idx === 0 && "bg-gradient-to-r from-gold/10 to-transparent"
            )}
          >
            <div className="col-span-1 text-center font-black">
              {idx === 0 && <Trophy className="size-5 text-gold inline" />}
              {idx === 1 && <Medal className="size-5 text-slate-400 inline" />}
              {idx === 2 && <Medal className="size-5 text-amber-600 inline" />}
              {idx > 2 && idx + 1}
            </div>
            <div className="col-span-5 font-bold">{user.name}</div>
            <div className="col-span-2 text-center font-mono">{user.poops}</div>
            <div className="col-span-2 text-center text-green-600 font-bold">
              R$ {user.earnings.toFixed(2)}
            </div>
            <div className="col-span-2 text-center flex items-center justify-center gap-1 text-accent font-black">
              <Coins className="size-4" /> {user.prize}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-center text-muted-foreground mt-4">
        * Ranking atualizado a cada minuto. O campeonato reseta toda segunda-feira às 8h.
      </p>
    </section>
  );
}