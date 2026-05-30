"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ShineBorder } from "@/components/ui/shine-border";
import { User as UserIcon, DollarSign, Briefcase, Image, LogOut, CheckCircle, Info } from "lucide-react";
import { User } from "@/types/User";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [company, setCompany] = useState(user?.company || "");
  const [salary, setSalary] = useState(user?.monthly_salary?.toString() || "3500");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const updatedData = await apiFetch("/api/auth/me/", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          company,
          monthly_salary: Number(salary),
          avatar_url: avatarUrl,
        }),
      }) as User;

      updateUser(updatedData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro catastrófico ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-black text-foreground">Você precisa estar logado para acessar seu trono.</h2>
        <p className="text-sm text-muted-foreground mt-2">Redirecionando...</p>
      </div>
    );
  }

  const displayName = `${firstName} ${lastName}`.trim() || user.username;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-foreground">Configurações do Trono</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seu perfil de cagador profissional CLT
        </p>
      </div>

      <div className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden mb-8">
        <ShineBorder borderWidth={2} shineColor={["var(--gold)", "var(--poop)", "var(--accent)"]} duration={8} />

        <div className="relative z-10 flex flex-col items-center mb-6 pb-6 border-b border-border/60">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={displayName} className="size-20 rounded-full border border-gold/40 object-cover shadow-md mb-3" />
          ) : (
            <div className="size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-black mb-3">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <h2 className="text-lg font-black text-foreground">{displayName}</h2>
          <span className="text-xs text-muted-foreground font-medium">@{user.username}</span>
        </div>

        <form onSubmit={handleUpdateProfile} className="relative z-10 space-y-4">
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="size-4 shrink-0" />
              <span>Dados atualizados com êxito!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold flex items-start gap-2">
              <Info className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Primeiro Nome</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Sobrenome</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Empresa</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nome da empresa"
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Salário CLT Mensal (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">URL da Imagem do Avatar</label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/avatar.jpg"
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-2">
            <RainbowButton type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold cursor-pointer text-sm">
              {loading ? "Salvando..." : "Salvar Alterações 💾"}
            </RainbowButton>
          </div>
        </form>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold border border-red-500/20 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
      >
        <LogOut className="size-4" /> Dar Descarga (Sair do Trono)
      </button>
    </div>
  );
}
