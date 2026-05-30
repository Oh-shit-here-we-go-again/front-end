// components/header/NavItems.ts
import { HomeIcon, PencilIcon, MailIcon, LayoutDashboardIcon } from "lucide-react";
import { Icons } from "./Icons";

export const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, label: "Home", authRequired: false },
  { href: "/blog", icon: PencilIcon, label: "Blog", authRequired: false },
  { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard", authRequired: true },
  { href: "/contact", icon: MailIcon, label: "Contato", authRequired: false },
];

// Você pode manter seus ícones customizados (LinkedIn, X, GitHub) em um arquivo separado
export const SOCIAL_LINKS = {
  GitHub: { name: "GitHub", url: "https://github.com/seu-usuario", icon: Icons.github },
  LinkedIn: { name: "LinkedIn", url: "https://linkedin.com/in/seu-perfil", icon: Icons.linkedin },
  X: { name: "X", url: "https://x.com/seu-usuario", icon: Icons.x },
};