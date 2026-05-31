// components/landing/StorePreview.tsx
"use client";

import { ShoppingBag, Coins, Gift } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

const products = [
  { name: "Papel Higiênico Premium", price: 120, emoji: "🧻" },
  { name: "Laxante Sabor Morango", price: 250, emoji: "🍓" },
  { name: "Incenso Antifedor", price: 300, emoji: "🕯️" },
  { name: "Assento Térmico", price: 1500, emoji: "🔥" },
];

export function StorePreview() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight mb-2">
          shoPum 🛍️
        </h2>
        <p className="text-muted-foreground font-medium max-w-xl mx-auto">
          Troque suas Cocoins por produtos que vão melhorar sua experiência no trono — 
          ou presentear aquele colega que também adora uma cagada remunerada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.name}
            className="relative bg-card border border-border rounded-2xl p-5 text-center hover:border-gold/40 transition-all group"
          >
            <ShineBorder borderWidth={1.5} shineColor="var(--gold)" duration={6} className="rounded-2xl" />
            <div className="relative z-10">
              <div className="text-5xl mb-3">{product.emoji}</div>
              <h3 className="font-extrabold text-lg">{product.name}</h3>
              <div className="flex items-center justify-center gap-1 text-accent font-black mt-2">
                <Coins className="size-4" /> {product.price}
              </div>
              <button className="mt-4 w-full bg-secondary hover:bg-muted text-foreground font-bold py-2 rounded-xl transition cursor-not-allowed opacity-80">
                Resgatar (em breve)
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <span className="inline-flex items-center gap-2 text-sm bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
          <Gift className="size-4 text-accent" />
          Novos produtos toda semana — incluindo a Privada Tecnológica!
        </span>
      </div>
    </section>
  );
}