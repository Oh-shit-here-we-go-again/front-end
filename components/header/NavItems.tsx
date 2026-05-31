// components/header/NavItems.ts - Atualizado
import {
  Home,
  LayoutDashboard,
  RefreshCw,
  Store,
  TrendingUp,
  User as UserIcon,
  Users,
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
  // Ícone referenciando o feed (app/(app)/feed/page.tsx)
  { href: "/feed", icon: RefreshCw, label: "OnlyFezes", authRequired: true },
  { href: "/families", icon: Users, label: "Famílias", authRequired: true }, // NOVO
  { href: "/profile", icon: UserIcon, label: "Perfil", authRequired: true },
];

export const SOCIAL_LINKS = {
  GitHub: {
    name: "GitHub",
    url: "https://github.com/seu-usuario",
    icon: Icons.github,
  },
};
