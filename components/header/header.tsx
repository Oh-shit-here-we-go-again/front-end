// components/header/Header.tsx
"use client";

import { Dock, DockIcon } from "@/components/ui/dock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthAvatar } from "./AuthAvatar";
import { NAV_ITEMS } from "./NavItems";

import {
  Coins,
  LogOut as LogOutIcon,
  Menu as MenuIcon,
  Plus,
} from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Filtra itens baseado em autenticação
  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.authRequired || (item.authRequired && user),
  );

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "Cagão";

  return (
    <>
      {/* Top Header: Branding & Authentication status */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/60 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
        <TooltipProvider>
          {/* Lado Esquerdo: Moedas no Mobile OU Logo no Desktop */}
          {user ? (
            <>
              {/* Moedas no Mobile (escondidas no desktop) */}
              <Link
                href="/lojinha"
                className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-black text-amber-700 dark:text-amber-300 shadow-sm transition-all animate-fade-in cursor-pointer"
              >
                <Coins className="size-4 text-amber-600 dark:text-amber-400 animate-bounce" />
                <span>{user.points_balance || 0} Cocoins</span>
              </Link>

              {/* Logo no Desktop (escondido no mobile) */}
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 select-none group"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">
                  💩
                </span>
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-poop via-accent to-gold bg-clip-text text-transparent">
                  Shitgo
                </span>
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 select-none group"
            >
              <span className="text-2xl transition-transform group-hover:scale-110">
                💩
              </span>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-poop via-accent to-gold bg-clip-text text-transparent">
                Shitgo
              </span>
            </Link>
          )}

          {/* Centro do Header: Botão de Bater Ponto Centrado e Idêntico ao Dashboard (Apenas Desktop) */}
          {user && (
            <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                href="/sessions/start"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-5 py-3 rounded-2xl hover:bg-primary/95 transition-all shadow-md cursor-pointer text-sm whitespace-nowrap"
              >
                <Plus className="size-4" />
                <span>Bater Ponto (Cagar)</span>
              </Link>
            </div>
          )}

          {/* Lado Direito: Botão de Bater Ponto (Mobile) / Moedas e Perfil (Desktop) OR Botões de Auth (Visitante) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {/* Botão de Bater Ponto (Cagar) - Apenas no Mobile */}
                <Link
                  href="/sessions/start"
                  className="inline-flex sm:hidden items-center gap-2 bg-primary text-primary-foreground font-bold px-4 py-2 rounded-2xl hover:bg-primary/95 transition-all shadow-md cursor-pointer text-xs whitespace-nowrap animate-fade-in"
                >
                  <Plus className="size-4" />
                  <span>Bater Ponto (Cagar)</span>
                </Link>

                {/* Pílula de Cocôins (Apenas Desktop) */}
                <Link
                  href="/lojinha"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-black text-amber-700 dark:text-amber-300 shadow-sm transition-all"
                >
                  <Coins className="size-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                  <span>{user.points_balance || 0} Cocoins</span>
                </Link>

                {/* Perfil Dropdown/Avatar (Apenas Desktop) */}
                <div className="hidden sm:block size-10">
                  <AuthAvatar />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold hover:text-poop transition-colors px-3 py-2"
                >
                  Acessar Trono
                </Link>
                <Link
                  href="/register"
                  className="bg-poop hover:bg-poop/90 text-white text-xs font-black px-4 py-2 rounded-full shadow-sm transition-all whitespace-nowrap"
                >
                  Monetizar Caca 💰
                </Link>
              </>
            )}
          </div>
        </TooltipProvider>
      </header>

      {/* Floating Bottom Dock Navigation: MagicUI Dock Implementation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <TooltipProvider>
          <Dock
            direction="middle"
            className="border border-border/80 bg-background/80 backdrop-blur-md shadow-xl rounded-2xl px-4 py-2 flex items-center justify-center gap-1"
          >
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <DockIcon
                  key={item.label}
                  className="flex items-center justify-center"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        aria-label={item.label}
                        className={cn(
                          "size-10 rounded-full flex items-center justify-center transition-all duration-200",
                          isActive
                            ? "bg-poop text-white shadow-md scale-110"
                            : "text-muted-foreground hover:bg-poop/10 hover:text-poop",
                        )}
                      >
                        <item.icon className="size-5 shrink-0" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-popover text-popover-foreground border border-border font-bold text-xs rounded-lg px-2.5 py-1"
                    >
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              );
            })}

            {/* Menu Hambúrguer Escondido no Dock (apenas para Mobile e se logado) */}
            {user && (
              <DockIcon className="sm:hidden flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      title="Abrir menu"
                      aria-label="Abrir menu"
                      className="size-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-poop/10 hover:text-poop transition-all cursor-pointer"
                    >
                      <MenuIcon className="size-5 shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    className="w-48 mb-3 bg-popover border border-border p-2 rounded-2xl shadow-xl z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/60 mb-1">
                      Logado como{" "}
                      <span className="font-bold text-foreground">
                        @{user.username}
                      </span>
                    </div>
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 cursor-pointer text-xs font-bold p-2 text-red-600 hover:bg-red-500/10 rounded-lg"
                    >
                      <LogOutIcon className="size-4" /> Dar Descarga (Sair)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DockIcon>
            )}
          </Dock>
        </TooltipProvider>
      </div>
    </>
  );
}
