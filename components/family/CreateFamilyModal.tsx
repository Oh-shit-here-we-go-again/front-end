// components/family/CreateFamilyModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Users } from "lucide-react";
import { useState } from "react";
// Dialog importado do wrapper do projeto: components/ui/dialog

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CreateFamilyModalProps {
  onCreate: (name: string) => Promise<void>;
  isCreating: boolean;
  trigger?: React.ReactNode;
}

const NAME_SUGGESTIONS = [
  "Os Cuié Team",
  "Trono Supremo",
  "Família Barro Forte",
  "Os Fedidos",
  "Clube do Barro",
  "Privada Real",
  "Os Descarga Forte",
];

export function CreateFamilyModal({
  onCreate,
  isCreating,
  trigger,
}: CreateFamilyModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Dá um nome pra essa cagada coletiva, pô!");
      return;
    }
    if (name.length < 3) {
      setError(
        "Nome muito curto! Tem que ter pelo menos 3 letras, igual um bom peido.",
      );
      return;
    }
    setError("");
    await onCreate(name);
    setName("");
    setOpen(false);
  };

  const handleSuggestion = (suggestion: string) => {
    setName(suggestion);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-poop hover:bg-poop/90 gap-2">
            <Users className="size-4" />
            Criar Nova Família
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-poop" />
            Criar um novo Trono Coletivo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="family-name">Nome da Família 💩</Label>
            <Input
              id="family-name"
              placeholder="Ex: Os Cuié Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-medium"
              maxLength={50}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Sugestões fedorentas:
            </p>
            <div className="flex flex-wrap gap-2">
              {NAME_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleSuggestion(sug)}
                  className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
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
              disabled={isCreating}
            >
              {isCreating ? "💨 Criando..." : "💩 Criar Família"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
