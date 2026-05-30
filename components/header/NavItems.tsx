// components/header/NavItems.ts
import { HomeIcon, LayoutDashboardIcon, MessageSquareShare, Trophy, ShoppingBag } from "lucide-react";
import { Icons } from "./Icons";

export const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboardIcon, label: "Estatísticas de Merda", authRequired: true },
  { href: "/lojinha", icon: ShoppingBag, label: "ShoPum", authRequired: true },
];

// Você pode manter seus ícones customizados (LinkedIn, X, GitHub) em um arquivo separado
export const SOCIAL_LINKS = {
  GitHub: { name: "GitHub", url: "https://github.com/seu-usuario", icon: Icons.github },
  LinkedIn: { name: "LinkedIn", url: "https://linkedin.com/in/seu-perfil", icon: Icons.linkedin },
  X: { name: "X", url: "https://x.com/seu-usuario", icon: Icons.x },
};