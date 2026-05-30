import { HomeIcon, LayoutDashboardIcon, Trophy, MessageSquare, ShoppingBag } from "lucide-react";
import { Icons } from "./Icons";

export const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, label: "Início", authRequired: false },
  { href: "/dashboard", icon: LayoutDashboardIcon, label: "Painel", authRequired: true },
  { href: "/feed", icon: MessageSquare, label: "Feed", authRequired: true },
  { href: "/ranking", icon: Trophy, label: "Ranking", authRequired: true },
  { href: "/lojinha", icon: ShoppingBag, label: "Lojinha", authRequired: true },
];

// Você pode manter seus ícones customizados (LinkedIn, X, GitHub) em um arquivo separado
export const SOCIAL_LINKS = {
  GitHub: { name: "GitHub", url: "https://github.com/seu-usuario", icon: Icons.github },
  LinkedIn: { name: "LinkedIn", url: "https://linkedin.com/in/seu-perfil", icon: Icons.linkedin },
  X: { name: "X", url: "https://x.com/seu-usuario", icon: Icons.x },
};