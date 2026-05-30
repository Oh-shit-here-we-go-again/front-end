"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Info, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // useAuth automatically updates state and context
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
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

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold flex items-start gap-2">
            <Info className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              E-mail corporativo (CLT)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@empresa.com.br"
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
