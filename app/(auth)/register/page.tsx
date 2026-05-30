"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Info, Lock, Mail, User, DollarSign, Briefcase } from "lucide-react";

import { getDramaticErrorMessage } from "@/lib/errors";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [salary, setSalary] = useState("3500");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !username.trim() || !email.trim() || !password || !salary || !company.trim()) {
      setError("Me ajuda a te ajudar! Você mandou o formulário pela metade. Isso é o equivalente a soltar um peido e perceber que veio com 'brinde'. Um desastre anunciado. Preenche todos os campos antes que essa requisição suje a minha tela!");
      setLoading(false);
      return;
    }

    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const registerData = {
        username: username.trim().toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        password: password,
        monthly_salary: Number(salary),
        company: company.trim() || "Empresa CLT",
      };
      
      await register(registerData);
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
          Cadastro de Merda
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Calcule e resgate seus lucros como CLT
        </p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold flex items-start gap-2 w-full break-words whitespace-normal">
            <Info className="size-4 shrink-0 mt-0.5" />
            <span className="break-words w-full">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                Nome do Cagão
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="agostinho_car"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colaborador@empresa.com"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                Salário CLT (R$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="number"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="3500"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
                Empresa
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Empresa"
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <RainbowButton type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-bold cursor-pointer">
            {loading ? "Cadastrando..." : "Iniciar no Trono 🚀"}
          </RainbowButton>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary font-black hover:underline">
            Entre aqui
          </Link>
        </div>
      </form>
    </>
  );
}
