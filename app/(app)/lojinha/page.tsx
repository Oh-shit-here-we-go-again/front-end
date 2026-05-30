"use client";

import React, { useState } from "react";
import { Coins, ShoppingBag, CheckCircle, Info, Sparkles } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

interface ShopItem {
  id: number;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  type: string;
}

export default function LojinhaPage() {
  const [userCoins, setUserCoins] = useState(520);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const shopItems: ShopItem[] = [
    {
      id: 1,
      name: "Laxante Turbo sabor Morango",
      emoji: "🍓",
      cost: 150,
      description: "Aumente sua produtividade de ida ao banheiro em 50%. Aprovado pela diretoria (em segredo).",
      type: "Consumível"
    },
    {
      id: 2,
      name: "Incensinho Anti-Odor da Firma",
      emoji: "🕯️",
      cost: 80,
      description: "Esconda o rastro do faturamento. Garante 100% de neutralização de odores na cabine.",
      type: "Utilidade"
    },
    {
      id: 3,
      name: "Papel Higiênico Folha Tripla",
      emoji: "🧻",
      cost: 50,
      description: "O toque suave e confortável da riqueza que você merece depois de faturar no trono.",
      type: "Consumível"
    },
    {
      id: 4,
      name: "Privada Inteligente Pro 9000",
      emoji: "🚽",
      cost: 9999,
      description: "Assento térmico, som de cascata acoplado, descarga eco-friendly e IA de feedback nutricional.",
      type: "Colecionável"
    }
  ];

  const handleBuy = (item: ShopItem) => {
    setMessage("");
    if (userCoins < item.cost) {
      setSuccess(false);
      setMessage(`ShitCoins insuficientes! Você precisa de mais ${item.cost - userCoins} moedas.`);
      return;
    }

    setSuccess(true);
    setUserCoins((prev) => prev - item.cost);
    setMessage(`Sucesso! Você comprou: ${item.name}. O item foi enviado para seu e-mail CLT.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
            <ShoppingBag className="size-8 text-primary" /> Lojinha do Banheiro
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Troque as ShitCoins arrecadadas em suas idas ao banheiro por prêmios e utilitários.
          </p>
        </div>

        <div className="relative bg-card border border-gold/30 px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 shrink-0 overflow-hidden min-w-[160px]">
          <ShineBorder borderWidth={1.5} shineColor="var(--gold)" duration={8} />
          <Coins className="size-5 text-gold animate-bounce" />
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Seu Saldo</span>
            <span className="font-black text-lg text-gold">{userCoins} ShitCoins</span>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${
          success 
            ? "bg-green-500/10 border-green-500/30 text-green-600" 
            : "bg-red-500/10 border-red-500/30 text-red-500"
        }`}>
          <CheckCircle className="size-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shopItems.map((item) => (
          <div key={item.id} className="bg-card border border-border p-6 rounded-2xl shadow-md flex flex-col justify-between hover:border-gold/40 transition-all">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="bg-secondary/60 size-14 rounded-2xl flex items-center justify-center text-3xl border border-gold/10">
                  {item.emoji}
                </div>
                <span className="text-xxs bg-muted px-2 py-0.5 rounded text-muted-foreground font-black border border-border/40 uppercase">
                  {item.type}
                </span>
              </div>
              <h3 className="font-black text-lg text-foreground mb-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-6">
              <span className="font-extrabold text-sm text-gold flex items-center gap-1">
                <Coins className="size-4" /> {item.cost} moedas
              </span>
              <button
                onClick={() => handleBuy(item)}
                className="bg-primary text-primary-foreground font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary/95 transition cursor-pointer"
              >
                Comprar Item
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mt-8 flex items-start gap-3">
        <Info className="size-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xxs text-muted-foreground leading-relaxed">
          Você ganha 10 ShitCoins para cada R$ 1,00 faturados durante suas cagadas remuneradas. Prêmios físicos e cupons de desconto serão enviados diretamente para sua caixa de entrada CLT cadastrada.
        </p>
      </div>
    </div>
  );
}
