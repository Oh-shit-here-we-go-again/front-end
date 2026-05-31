// components/landing/CTASection.tsx
"use client";

import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="text-center bg-gradient-to-br from-poop/20 via-gold/10 to-accent/20 border border-gold/40 rounded-3xl p-10 relative overflow-hidden shadow-lg mb-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
        <span className="text-[200px] select-none">💩</span>
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <h2 className="text-3xl font-black mb-4">Chega de perder dinheiro no trono</h2>
        <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
          Mais de 5.000 CLTs já estão faturando com o ShitGo. Crie sua conta gratuita 
          e comece a contar seus minutos de lucro hoje mesmo.
        </p>
        <Link href="/register">
          <RainbowButton className="shadow-lg transform active:scale-95 transition-transform font-bold text-base h-12 px-8 rounded-xl cursor-pointer">
            Quero meu Assento Reservado 🧻
          </RainbowButton>
        </Link>
        <p className="text-xs text-muted-foreground mt-6">
          * Não vendemos dados intestinais. Prometimos.
        </p>
      </div>
    </section>
  );
}