"use client";

import React, { useState, useEffect } from "react";
import { Coins, ShoppingBag, CheckCircle } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { shopService } from "../services/shopService";
import { ShopItem } from "../types/shop.types";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

export function ShopScreen() {
  const { user, updateUser } = useAuth();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userCoins, setUserCoins] = useState(0);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);

  // Sync state coins with user context points
  useEffect(() => {
    if (user) {
      setUserCoins(user.points_balance || 0);
    }
  }, [user]);

  // Fetch shop products on load
  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await shopService.fetchShopItems();
        setShopItems(items);
      } catch (e) {
        console.error("Erro ao obter produtos da lojinha:", e);
      } finally {
        setLoadingItems(false);
      }
    };
    loadItems();
  }, []);

  const handleBuy = async (item: ShopItem) => {
    setMessage("");
    const result = await shopService.buyItem(item.id, userCoins);
    setSuccess(result.success);
    setMessage(result.message);
    
    if (result.success) {
      setUserCoins(result.newCoins);
      // Fetch latest user details from API to sync header points balance
      try {
        const updatedData = await apiFetch("/api/auth/me/");
        updateUser(updatedData);
      } catch (e) {
        console.error("Erro ao sincronizar saldo de ShitCoins:", e);
      }
    }
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
            Gaste suas ShitCoins em mimos e produtos premium criados especialmente para deixar suas sessões no trono muito mais relaxantes, perfumadas e agradáveis.
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
      {loadingItems ? (
        <div className="text-center py-12">
          <span className="text-sm font-bold text-muted-foreground">Carregando mimos da lojinha...</span>
        </div>
      ) : (
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
      )}
    </div>
  );
}
