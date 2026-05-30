// components/landing/PitchSection.tsx
"use client";

import { motion } from "motion/react";
import { Sparkles, Coins, Trophy } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";

export function PitchSection() {
  return (
    <header className="text-center mb-16 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-extrabold shadow-sm border border-gold/40 mb-6"
      >
        <Sparkles className="size-4 text-accent animate-pulse" />
        <span>O programa de fidelidade do seu intestino</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6 max-w-4xl mx-auto"
      >
        Transforme suas{" "}
        <span className="bg-gradient-to-r from-poop via-accent to-gold bg-clip-text text-transparent">
          idas ao banheiro
        </span>{" "}
        em lucro real
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-medium"
      >
        Você já calculou quanto ganha por minuto? Enquanto o chefe paga, você caga. 
        Nós contamos cada segundo no trono e te recompensamos com prêmios, ranking e uma comunidade de profissionais liberados.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Link href="/register">
          <RainbowButton className="shadow-lg transform active:scale-95 transition-transform font-bold text-base h-12 px-8 rounded-xl cursor-pointer">
            Quero faturar no vaso 💩
          </RainbowButton>
        </Link>
        <a
          href="#como-funciona"
          className="inline-flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
        >
          Como funciona?
        </a>
      </motion.div>
    </header>
  );
}