// components/header/NavItems.ts - Atualizado
import {
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Store,
  TrendingUp,
  User as UserIcon,
  Users,
} from "lucide-react";

import { Icons } from "./Icons";

export const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home", authRequired: false },
  {
    href: "/trono",
    icon: LayoutDashboard,
    label: "Trono",
    authRequired: true,
  },
  { href: "/ranking", icon: TrendingUp, label: "Ranking", authRequired: true },
  { href: "/store", icon: Store, label: "Loja", authRequired: true },
  { href: "/feed", icon: ImageIcon, label: "OnlyFezes", authRequired: true },
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
