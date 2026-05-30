"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Info, Lock, User, CheckCircle } from "lucide-react";

import { getDramaticErrorMessage } from "@/lib/errors";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("descarga=true")) {
      setLogoutMessage(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !password) {
      setError("Me ajuda a te ajudar! Você mandou o formulário pela metade. Isso é o equivalente a soltar um peido e perceber que veio com 'brinde'. Um desastre anunciado. Preenche todos os campos antes que essa requisição suje a minha tela!");
      setLoading(false);
      return;
    }

    try {
      await login(username, password);
      // useAuth automatically updates state and context
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(getDramaticErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <span className="text-5xl">💩</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground">
          Acesse o Shitgo
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Monetize seu momento mais precioso do dia
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
        {logoutMessage && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-600 p-4 rounded-xl text-xs font-bold flex items-start gap-2.5 w-full break-words whitespace-normal animate-fade-in">
            <CheckCircle className="size-4 shrink-0 mt-0.5" />
            <span className="break-words w-full">
              Água desceu! 🌊 Você saiu do banheiro de fininho e desocupou o trono com sucesso. Não se esqueça de lavar as mãos! 🧼
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold flex items-start gap-2">
            <Info className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Nome do Cagão (Username)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="agostinho_car"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Senha secreta do trono
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <RainbowButton type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-bold cursor-pointer">
            {loading ? "Entrando..." : "Entrar no Banheiro 🚽"}
          </RainbowButton>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          Ainda não tem cadastro?{" "}
          <Link href="/register" className="text-primary font-black hover:underline">
            Cadastre-se aqui
          </Link>
        </div>
      </form>
    </>
  );
}
