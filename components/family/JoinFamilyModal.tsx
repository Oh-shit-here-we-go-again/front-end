// components/family/JoinFamilyModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, LogIn } from "lucide-react";
import { useState } from "react";

interface JoinFamilyModalProps {
  onJoin: (code: string) => Promise<void>;
  isJoining: boolean;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export function JoinFamilyModal({
  onJoin,
  isJoining,
  trigger,
  disabled = false,
}: JoinFamilyModalProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Cola o código de convite aí, fio!");
      return;
    }
    const cleanCode = code.trim();
    if (cleanCode.length < 6) {
      setError("Código muito curto! Tá tentando entrar de fininho?");
      return;
    }
    setError("");
    await onJoin(cleanCode);
    setCode("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            title={disabled ? "Você já possui um grupo. Crie um novo grupo para poder trocar de equipe!" : undefined}
          >
            <LogIn className="size-4" />
            Entrar com Código
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-poop" />
            Entrar em uma Família
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Código de Convite 🔑</Label>
            <Input
              id="invite-code"
              placeholder="Ex: SHITGO2024"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-center tracking-wider text-lg"
              maxLength={12}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Pede o código pro responsável pela família. É tipo a senha da
              privada VIP!
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-poop hover:bg-poop/90"
              disabled={isJoining}
            >
              {isJoining ? "🚽 Entrando..." : "💩 Sentar no Trono"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
