// components/header/AuthAvatar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function AuthAvatar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const displayName = user.first_name 
    ? `${user.first_name} ${user.last_name || ""}`.trim() 
    : user.username;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="size-12 rounded-full hover:opacity-80 transition">
          <Avatar className="size-12">
            <AvatarImage src={user.avatar_url} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
            <UserIcon className="size-4" /> Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
          <LogOutIcon className="size-4 mr-2" /> Dar Descarga (Sair)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}