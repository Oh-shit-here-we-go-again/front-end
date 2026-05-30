// components/header/NavItems.ts
import {
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Store,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";

import { Icons } from "./Icons";

export const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home", authRequired: false },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard de Merda",
    authRequired: true,
  },
  { href: "/ranking", icon: TrendingUp, label: "Ranking", authRequired: true },
  { href: "/lojinha", icon: Store, label: "shoPum", authRequired: true },
  { href: "/feed", icon: ImageIcon, label: "OnlyFezes", authRequired: true },
  { href: "/profile", icon: UserIcon, label: "Perfil", authRequired: true },
];

// Você pode manter seus ícones customizados (LinkedIn, X, GitHub) em um arquivo separado
export const SOCIAL_LINKS = {
  GitHub: {
    name: "GitHub",
    url: "https://github.com/seu-usuario",
    icon: Icons.github,
  },
};
