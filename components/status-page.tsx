"use client";

// app/components/status-page.tsx
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Tipo para os códigos de status HTTP
export type StatusCode =
  | 400
  | 401
  | 403
  | 404
  | 408
  | 429
  | 500
  | 502
  | 503
  | 504;

// Interface para as props do componente
export interface StatusPageProps {
  code: StatusCode;
  title?: string;
  message?: string;
  emoji?: string;
  imageUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

// Dicionário de mensagens padrão com GIFs próprios
const statusMessages: Record<
  StatusCode,
  { title: string; message: string; emoji: string; imageUrl: string }
> = {
  400: {
    title: "Cagada Mal Informada",
    message: "A requisição está com problema, como uma descarga entupida.",
    emoji: "🚽💩",
    imageUrl: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  },
  401: {
    title: "Vc Não Fez o Número 2",
    message: "Autenticação necessária. Faça login antes de continuar.",
    emoji: "🔐💩",
    imageUrl: "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
  },
  403: {
    title: "Cagada Proibida",
    message: "Você não tem permissão para cagar aqui.",
    emoji: "🚫🧻",
    imageUrl: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  },
  404: {
    title: "Cagada Não Encontrada",
    message:
      "A página que você procura evaporou no ar. Talvez alguém tenha dado descarga.",
    emoji: "💨🚽",
    imageUrl: "https://media.giphy.com/media/3o7abKhOpu0N9H8lXm/giphy.gif",
  },
  408: {
    title: "Cagada Demorou Demais",
    message: "O servidor cansou de esperar sua cagada. Time-out!",
    emoji: "⏰💩",
    imageUrl: "https://media.giphy.com/media/3o6Zt6MLxBgY8oYviE/giphy.gif",
  },
  429: {
    title: "Muitas Cagadas",
    message: "Você está cagando demais! Dê um tempo pro vaso respirar.",
    emoji: "🔄🚽",
    imageUrl: "https://media.giphy.com/media/3o7abKhOpu0N9H8lXm/giphy.gif",
  },
  500: {
    title: "Cagada no Servidor",
    message: "O servidor fez cocô nas calças. Tente novamente mais tarde.",
    emoji: "💻💩",
    imageUrl: "https://media.giphy.com/media/3o7aCTPPB4Hx6FpHna/giphy.gif",
  },
  502: {
    title: "Cagada na Rede",
    message: "A conexão falhou. Alguém entupiu o cano da internet.",
    emoji: "🌐💩",
    imageUrl: "https://media.giphy.com/media/3o7abKhOpu0N9H8lXm/giphy.gif",
  },
  503: {
    title: "Vaso em Manutenção",
    message: "O serviço está indisponível. O encanador foi chamado.",
    emoji: "🔧🚽",
    imageUrl: "https://media.giphy.com/media/3o6Zt6MLxBgY8oYviE/giphy.gif",
  },
  504: {
    title: "Cagada Perdida",
    message: "O gateway não conseguiu conectar. Sua cagada se perdeu no limbo.",
    emoji: "🌀💩",
    imageUrl: "https://media.giphy.com/media/3o7abKhOpu0N9H8lXm/giphy.gif",
  },
};

// Componente base para qualquer status
export function StatusPage({
  code,
  title,
  message,
  emoji,
  imageUrl,
  children,
  className,
}: StatusPageProps) {
  const defaultData = statusMessages[code];
  const finalTitle = title || defaultData.title;
  const finalMessage = message || defaultData.message;
  const finalEmoji = emoji || defaultData.emoji;
  const finalImageUrl = imageUrl || defaultData.imageUrl;

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background",
        className,
      )}
    >
      <div className="max-w-md space-y-6">
        {/* Emoji animado */}
        <div className="text-8xl animate-bounce">{finalEmoji}</div>

        {/* Código e título */}
        <div>
          <h1 className="text-8xl font-black tracking-tighter text-poop">
            {code}
          </h1>
          <h2 className="text-2xl font-bold mt-2 text-foreground">
            {finalTitle}
          </h2>
        </div>

        {/* GIF próprio do status */}
        <div className="rounded-2xl overflow-hidden border-4 border-poop/20 shadow-xl bg-muted/20">
          <Image
            src={finalImageUrl}
            alt={`GIF ilustrando: ${finalTitle}`}
            width={400}
            height={300}
            className="w-full h-auto object-cover"
            unoptimized // GIPHY URLs já são otimizadas
          />
        </div>

        {/* Mensagem */}
        <p className="text-muted-foreground text-lg">{finalMessage}</p>

        {/* Botões de ação ou conteúdo customizado */}
        {children || (
          <div className="pt-4 flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="bg-poop hover:bg-poop-dark text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Voltar para o 🚽
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Dar descarga 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componentes específicos para usar diretamente nas rotas
export function BadRequest() {
  return <StatusPage code={400} />;
}
export function Unauthorized() {
  return <StatusPage code={401} />;
}
export function Forbidden() {
  return <StatusPage code={403} />;
}
export function NotFound() {
  return <StatusPage code={404} />;
}
export function RequestTimeout() {
  return <StatusPage code={408} />;
}
export function TooManyRequests() {
  return <StatusPage code={429} />;
}
export function InternalServerError() {
  return <StatusPage code={500} />;
}
export function BadGateway() {
  return <StatusPage code={502} />;
}
export function ServiceUnavailable() {
  return <StatusPage code={503} />;
}
export function GatewayTimeout() {
  return <StatusPage code={504} />;
}
