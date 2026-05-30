import { BathroomSession } from "@/types/api";
import { Clock } from "lucide-react";

export function RecentSessions({ sessions }: { sessions: BathroomSession[] }) {
  if (!sessions.length)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhuma sessão ainda
      </div>
    );
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-bold">Últimas sessões</h3>
      </div>
      <div className="divide-y">
        {sessions.map((s) => (
          <div key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">
                {new Date(s.started_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />{" "}
                {s.duration_seconds
                  ? `${Math.floor(s.duration_seconds / 60)}min`
                  : "Em andamento"}
              </p>
            </div>
            <p className="font-bold text-gold">
              R$ {parseFloat(s.earnings || "0").toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
