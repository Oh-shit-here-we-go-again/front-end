// app/components/loading-page.tsx
import { GiphyFetch } from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LoadingPageProps {
  message?: string;
  emoji?: string;
  giphyTag?: string;
  fullScreen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const defaultMessages = [
  "Preparando o vaso... 🚽",
  "Aguardando a natureza chamar... 🌿",
  "Hidratando os pixels... 💧",
  "Desenrolando o papel... 🧻",
  "Calculando a pressão... 💨",
  "Verificando o nível da água... 💦",
  "Aquecendo o assento... 🔥",
];

// Função auxiliar para escolher uma mensagem aleatória
const getRandomMessage = (customMessage?: string): string => {
  if (customMessage) return customMessage;
  return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
};

export function LoadingPage({
  message,
  emoji = "💩",
  giphyTag = "poop loading",
  fullScreen = true,
  className,
  children,
}: LoadingPageProps) {
  // Calcula a mensagem uma única vez no estado inicial (sem efeito colateral)
  const [randomMessage] = useState(() => getRandomMessage(message));
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  // Busca GIF de forma assíncrona (permitido, pois não é setState síncrono)
  useEffect(() => {
    const fetchGif = async () => {
      try {
        const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");
        const { data } = await gf.search(giphyTag, {
          limit: 1,
          sort: "relevant",
        });
        if (data?.[0]?.images?.original?.url) {
          setGifUrl(data[0].images.original.url);
        }
      } catch {
        // fallback silencioso
      }
    };
    fetchGif();
  }, [giphyTag]);

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center",
        className,
      )}
    >
      <div className="max-w-md space-y-6">
        {/* Loading spinner com emoji */}
        <div className="relative">
          <div className="text-7xl animate-spin">{emoji}</div>
          <div className="absolute inset-0 animate-ping opacity-0 text-7xl">
            {emoji}
          </div>
        </div>

        {/* Mensagem dinâmica */}
        <p className="text-xl font-medium text-foreground animate-pulse">
          {randomMessage}
        </p>

        {/* GIF caricato */}
        {gifUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-poop/30">
            <img src={gifUrl} alt="Loading..." className="w-full h-auto" />
          </div>
        )}

        {/* Children customizável (ex: barra de progresso) */}
        {children}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
}

// Componentes pré-configurados
export function FullScreenLoading() {
  return <LoadingPage fullScreen emoji="🧻" giphyTag="toilet paper loading" />;
}

export function SessionLoading() {
  return (
    <LoadingPage
      message="Carregando sua cagada..."
      emoji="🚽"
      giphyTag="toilet loading"
      fullScreen={false}
    />
  );
}
