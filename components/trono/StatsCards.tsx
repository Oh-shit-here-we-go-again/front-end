import { Coins, Calendar, Star } from "lucide-react";

interface StatsCardsProps {
  totalEarnings: number;
  totalSessions: number;
  totalPoints: number;
}

export function StatsCards({
  totalEarnings,
  totalSessions,
  totalPoints,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card p-4 rounded-2xl border shadow-sm flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Coins className="h-5 w-5 text-gold" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total ganho</p>
          <p className="text-2xl font-bold">R$ {totalEarnings.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-card p-4 rounded-2xl border shadow-sm flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Sessões</p>
          <p className="text-2xl font-bold">{totalSessions}</p>
        </div>
      </div>
      <div className="bg-card p-4 rounded-2xl border shadow-sm flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Pontos</p>
          <p className="text-2xl font-bold">{totalPoints}</p>
        </div>
      </div>
    </div>
  );
}
