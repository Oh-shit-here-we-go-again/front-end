"use client";

import React, { useState, useEffect } from "react";
import { Coins, ShoppingBag, CheckCircle, History } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { shopService } from "../services/shopService";
import { ShopItem, Order } from "../types/shop.types";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { User } from "@/types/User";

export function ShopScreen() {
  const { user, updateUser } = useAuth();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [userCoins, setUserCoins] = useState(0);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);

  // Orders state
  const [activeTab, setActiveTab] = useState<"store" | "orders">("store");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const fetchedOrders = await shopService.fetchOrders();
      setOrders(fetchedOrders);
    } catch (e) {
      console.error("Erro ao carregar histórico de pedidos:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]);

  const handleBuy = async (item: ShopItem) => {
    setMessage("");
    const result = await shopService.buyItem(item.id, userCoins);
    setSuccess(result.success);
    setMessage(result.message);
    
    if (result.success) {
      setUserCoins(result.newCoins);
      // Fetch latest user details from API to sync header points balance
      try {
        const updatedData = await apiFetch("/api/auth/me/") as User;
        updateUser(updatedData);
      } catch (e) {
        console.error("Erro ao sincronizar saldo de Cocoins:", e);
      }
      // If we are currently showing orders, update them as well
      if (activeTab === "orders") {
        loadOrders();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
            <ShoppingBag className="size-8 text-primary" /> shoPum
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gaste suas Cocoins em mimos e produtos premium criados especialmente para deixar suas sessões no trono muito mais relaxantes, perfumadas e agradáveis.
          </p>
        </div>

        <div className="relative bg-card border border-amber-500/20 px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 shrink-0 overflow-hidden min-w-[160px]">
          <ShineBorder borderWidth={1.5} shineColor="var(--gold)" duration={8} />
          <Coins className="size-5 text-amber-600 dark:text-gold animate-bounce" />
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Seu Saldo</span>
            <span className="font-black text-lg text-amber-700 dark:text-gold">{userCoins} Cocoins</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border/60 mb-6">
        <button
          onClick={() => setActiveTab("store")}
          className={`pb-3 text-sm font-black border-b-2 transition-all cursor-pointer ${
            activeTab === "store"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Loja de Mimos
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 text-sm font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="size-4" /> Meus Resgates
        </button>
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

      {/* Tabs Content */}
      {activeTab === "store" ? (
        loadingItems ? (
          <div className="text-center py-12">
            <span className="text-sm font-bold text-muted-foreground animate-pulse">Carregando mimos da lojinha...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shopItems.map((item) => (
              <div key={item.id} className="bg-card border border-border p-6 rounded-2xl shadow-md flex flex-col justify-between hover:border-gold/40 transition-all">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-secondary/60 size-14 rounded-2xl flex items-center justify-center border border-gold/10 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="size-full object-cover" />
                      ) : (
                        <span className="text-3xl">{item.emoji}</span>
                      )}
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
        )
      ) : (
        loadingOrders ? (
          <div className="text-center py-12">
            <span className="text-sm font-bold text-muted-foreground animate-pulse">Carregando histórico de resgates...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-card border border-dashed border-border rounded-3xl">
            <span className="text-sm font-bold text-muted-foreground block mb-1">Nenhum resgate encontrado.</span>
            <span className="text-xs text-muted-foreground/80">Faça cagadas remuneradas para acumular Cocoins e resgatar mimos!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xxs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border/40">
                      Pedido #{order.id.slice(0, 8)}
                    </span>
                    <span className={`text-xxs font-black px-2 py-0.5 rounded uppercase ${
                      order.status === "completed" 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                        : order.status === "pending"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}>
                      {order.status === "completed" ? "Concluído" : order.status === "pending" ? "Pendente" : "Cancelado"}
                    </span>
                  </div>
                  
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-foreground">
                        {item.quantity}x {item.product?.name || item.product?.avatar_name || "Produto Desconhecido"}
                      </span>
                      <span className="text-xxs text-muted-foreground">({item.points_at_purchase} pts cada)</span>
                    </div>
                  ))}
                  
                  <span className="text-xxs text-muted-foreground block mt-2">
                    Realizado em: {new Date(order.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
                
                <div className="text-right shrink-0 border-t md:border-t-0 border-border/60 pt-3 md:pt-0">
                  <span className="text-xxs font-bold text-muted-foreground block uppercase">Total Gasto</span>
                  <span className="font-extrabold text-amber-600 dark:text-gold text-lg flex items-center justify-end gap-1 mt-0.5">
                    <Coins className="size-4 text-gold" /> {order.total_points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

