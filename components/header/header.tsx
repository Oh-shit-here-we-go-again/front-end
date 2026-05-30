// components/header/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/lib/auth";
import { NAV_ITEMS, SOCIAL_LINKS } from "./NavItems";
import { AuthAvatar } from "./AuthAvatar";
import { Icons } from "./Icons"; // você pode mover os ícones customizados para um arquivo separado

import { Coins } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Filtra itens baseado em autenticação
  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.authRequired || (item.authRequired && user)
  );

  const displayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ""}`.trim() 
    : user?.username || "Cagão";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/60 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
      <TooltipProvider>
        {/* Lado Esquerdo: Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <span className="text-2xl transition-transform group-hover:scale-110">💩</span>
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-poop via-accent to-gold bg-clip-text text-transparent">
            Shitgo
          </span>
        </Link>

        {/* Lado Central: Navegação de Ícones e Menus */}
        <nav className="flex items-center gap-1 bg-secondary/50 border border-border/80 rounded-full p-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 select-none whitespace-nowrap",
                  isActive
                    ? "bg-poop text-white shadow-sm scale-105"
                    : "text-muted-foreground hover:text-poop hover:bg-poop/10"
                )}
              >
                <item.icon className="size-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Lado Direito: Saldo de Pontos & Perfil Dropdown */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              {/* Pílula de Cocôins */}
              <Link
                href="/lojinha"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-gold/30 text-xs font-black text-foreground shadow-sm transition-all"
              >
                <Coins className="size-3.5 text-gold animate-pulse" />
                <span>{user.points_balance || 0} 💩</span>
              </Link>

              {/* Perfil Dropdown/Avatar */}
              <div className="size-10">
                <AuthAvatar />
              </div>
            </>
          )}
        </div>
      </TooltipProvider>
    </header>
  );
}