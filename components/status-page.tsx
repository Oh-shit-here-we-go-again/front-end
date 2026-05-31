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
    title: "💩 CAGADA MAL INFORMADA 💩",
    message:
      "Sua requisição está tão confusa quanto papel higiênico molhado. O servidor não entendeu nada, nem eu. Revisa esses dados, criatura!",
    emoji: "🚽💩🤯",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHlwdWt3ZGVpdDF2bzRsajh1MmI5ODBuMTVkdHgzMjk2ejFmenpxZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6MKRbRtrKiDaT29CJV/giphy.gif",
  },
  401: {
    title: "🔐 VOCÊ NÃO FEZ O NÚMERO 2 🔐",
    message:
      "Calma, calabreso! Você não está logado. Como vai cagar de luxo sem identificação? Faz o login antes de tentar sentar no trono VIP.",
    emoji: "🔐💩🧻",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHlwdWt3ZGVpdDF2bzRsajh1MmI5ODBuMTVkdHgzMjk2ejFmenpxZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tRDsicNAWnLHO/giphy.gif",
  },
  403: {
    title: "🚫 CAGADA PROIBIDA 🚫",
    message:
      "Nem ousa! Você não tem permissão para cagar aqui. É área restrita, só para os fortes. Volta pra sua privada comum, plebeu.",
    emoji: "🚫🧻👑",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZWN4a3NqMWh0eGM4aThyeWZlcXB1czJ1Z2NhbGhhc2Rjczdwc2kyZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lz97hLzvhgL0hVni2H/giphy.gif",
  },
  404: {
    title: "💨 CAGADA FANTASMA 💨",
    message:
      "A página que você procura evaporou no ar, igual peido depois do almoço. Alguém deu descarga e levou tudo embora. Tenta de novo, se tiver coragem.",
    emoji: "💨🚽👻",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OW92MTg0NGlkNzl2NTM4MHBybnJvcXR6YnIyYzZtampkYnhhMzhubSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UOgF1gfbgO7NS/giphy.gif",
  },
  408: {
    title: "⏰ A CAGADA DEMOROU DEMAIS ⏰",
    message:
      "O servidor ficou esperando, esperando... e nada. Deu até câimbra no cano. Time‑out! Seu cocô digital não resistiu à ansiedade.",
    emoji: "⏰💩😫",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OW92MTg0NGlkNzl2NTM4MHBybnJvcXR6YnIyYzZtampkYnhhMzhubSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/mQnOJCzWZtKr7j4oyD/giphy.gif",
  },
  429: {
    title: "🔄 MUITAS CAGADAS, MEU FILHO 🔄",
    message:
      "Você está cagando mais do que o sistema aguenta! Dá um tempo pro vaso respirar, senão vai entupir o servidor inteiro. Respeita o limite dos canos.",
    emoji: "🔄🚽💢",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGtqdWw3d2hjaHQwYzQ1eHRtZHBhM2ZraWJzdGx4M3dwYnNlNXc1YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ocqQDjdhv3Fm6Bq5jO/giphy.gif",
  },
  500: {
    title: "💻 CAGADA NO SERVIDOR 💻",
    message:
      "O servidor fez cocô nas calças, literalmente. Um erro interno catastrófico. Não é culpa sua, é o backend que se borrou todo. Tenta de novo mais tarde (e reza).",
    emoji: "💻💩🔥",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cDU5cXNkYmU3NWp3NmZ6ZDJ3bW1vbGI4OTUwZXBpOHR3YTZwbzVrbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NXaN3vzOd5vbO/giphy.gif",
  },
  502: {
    title: "🌐 CAGADA NA REDE 🌐",
    message:
      "A conexão falhou feio. Alguém entupiu o cano da internet com um barro monstruoso. O gateway não aguentou e bateu em retirada. Chama o provedor, amigo.",
    emoji: "🌐💩💥",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cDU5cXNkYmU3NWp3NmZ6ZDJ3bW1vbGI4OTUwZXBpOHR3YTZwbzVrbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9rjYBGxaLsKKycVUxV/giphy.gif",
  },
  503: {
    title: "🔧 VASO EM MANUTENÇÃO 🔧",
    message:
      "O serviço está indisponível. O encanador foi chamado, mas ele tá almoçando. Volta daqui a pouco, quando o trono estiver desentupido.",
    emoji: "🔧🚽🛠️",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGtqdWw3d2hjaHQwYzQ1eHRtZHBhM2ZraWJzdGx4M3dwYnNlNXc1YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ocqQDjdhv3Fm6Bq5jO/giphy.gif",
  },
  504: {
    title: "🌀 CAGADA PERDIDA NO LIMBO 🌀",
    message:
      "O gateway não conseguiu conectar. Sua cagada entrou em um portal interdimensional e se perdeu no além. Nem Freud explica. Tenta de novo, se o destino permitir.",
    emoji: "🌀💩🌌",
    imageUrl:
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cDU5cXNkYmU3NWp3NmZ6ZDJ3bW1vbGI4OTUwZXBpOHR3YTZwbzVrbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NXaN3vzOd5vbO/giphy.gif",
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
