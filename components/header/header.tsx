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

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
 
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Filtra itens baseado em autenticação
  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.authRequired || (item.authRequired && user)
  );

  // Posicionamento: desktop no topo, mobile/tablet na parte inferior
  const positionClass = "fixed bottom-4 left-1/2 -translate-x-1/2";

  
   const avatarInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <header className={cn(positionClass, "z-50 w-auto")}>
      <TooltipProvider>
        <Dock direction="middle" className="bg-background/60 backdrop-blur-md shadow-lg">
          {/* Links de navegação */}
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <DockIcon key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12 rounded-full transition-colors",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            );
          })}

          <Separator orientation="vertical" className="h-full" />

          {/* Redes sociais (sempre visíveis) */}
          {Object.entries(SOCIAL_LINKS).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <social.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          {/* Avatar do usuário logado */}
          {user && (
            <>
              <Separator orientation="vertical" className="h-full" />
              <DockIcon>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                    {avatarInitials}
                  </div>
                )}
              </DockIcon>
            </>
          )}
        </Dock>
      </TooltipProvider>
    </header>
  );
}