// components/landing/StorySection.tsx
"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

export function StorySection() {
  return (
    <section id="como-funciona" className="mb-20 scroll-mt-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-black tracking-tight mb-2">
          A história real do João, CLT cansado
        </h2>
        <p className="text-muted-foreground font-medium">
          (os nomes foram alterados, mas a merda é verdadeira)
        </p>
      </div>

      <div className="relative bg-card/50 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 md:p-12 shadow-xl">
        <Quote className="absolute top-6 left-6 text-gold/20 size-12" />
        <div className="relative z-10 space-y-6 text-foreground/90 leading-relaxed">
          <p className="text-lg font-medium">
            <span className="font-black text-gold">João</span>, analista financeiro de 29 anos, passava em média 25 minutos por dia no banheiro da empresa — 
            entre o cafezinho da manhã e a digestão do almoço. Ele nunca imaginou que esse tempo poderia ser monetizado.
          </p>
          <p>
            Até que um dia, descobriu o <strong>ShitGo</strong>: ao sincronizar seu relógio de ponto com o vaso, 
            cada minuto no trono passou a ser convertido em <strong className="text-accent">ShitCoins</strong>. 
            Em um mês, João faturou o equivalente a 2 dias de salário extra — só cagando.
          </p>
          <p>
            Hoje ele é <strong className="text-poop">Trono de Ouro I</strong> no ranking nacional, troca suas ShitCoins por 
            kits de café premium e até ajuda amigos a subirem de elo nas ligas intestinas.
          </p>
          <div className="border-l-4 border-accent pl-4 italic text-muted-foreground">
            “Nunca imaginei que seria pago para cagar. O ShitGo mudou minha relação com o trabalho 
            e com o vaso. Agora, cada ida é uma vitória.”
          </div>
        </div>
      </div>
    </section>
  );
}