// components/feed/BlurRevealDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { proxyImage } from "@/lib/proxy-image";

interface BlurRevealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  photoUrl: string | null;
}

const JOKES = [
  "🚽 Tem certeza que quer ver essa obra-prima? Seu terapeuta aprovaria?",
  "💩 Olha... você pode ver, mas depois não diga que não avisei. O fedor é virtual, mas a vergonha alheia é real.",
  "🧻 Essa foto pode conter cenas fortes para estômagos sensíveis. Quer prosseguir?",
  "⚠️ Ao revelar, você concorda em não julgar a cor, a textura ou a audácia do autor.",
  "👑 Você está prestes a ver um momento de glória fecal. Prepare-se.",
];

export function BlurRevealDialog({
  open,
  onOpenChange,
  onConfirm,
  photoUrl,
}: BlurRevealDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [randomJoke] = useState(
    () => JOKES[Math.floor(Math.random() * JOKES.length)],
  );

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirm();
    setStep(1);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setStep(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 ? (
              <AlertCircle className="size-5 text-poop" />
            ) : (
              <Sparkles className="size-5 text-poop" />
            )}
            {step === 1
              ? "Tem certeza, cagão?"
              : "Última chance antes do trauma"}
          </DialogTitle>
          <DialogDescription>
            Confirme se deseja remover a censura desta obra de arte.
          </DialogDescription>
        </DialogHeader>

        {/* Preview blurred */}
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img
            src={proxyImage(photoUrl) || "/placeholder-poop.jpg"}
            alt="Sessão no trono"
            className={cn(
              "w-full h-64 object-cover transition-all duration-300",
              step === 1 ? "blur-2xl scale-105" : "blur-md",
            )}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/10 pointer-events-none">
            <p className="text-white text-xs sm:text-sm font-black px-4 py-3.5 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl max-w-[85%] text-center leading-relaxed animate-fade-in">
              {step === 1
                ? randomJoke
                : "⚠️ Você está prestes a revelar uma foto de trono. Não diga que não avisamos!"}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Não, quero me preservar
          </Button>
          {step === 1 ? (
            <Button
              onClick={handleFirstConfirm}
              className="bg-poop hover:bg-poop/90"
            >
              Sim, mostre essa cagada!
            </Button>
          ) : (
            <Button onClick={handleFinalConfirm} variant="destructive">
              Revelar de uma vez! 💨
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
