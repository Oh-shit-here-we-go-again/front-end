import { RankingSnapshot } from "@/types/api";
import { Table, Trophy } from "lucide-react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface RankingCardProps {
  ranking: RankingSnapshot[];
  loading: boolean;
}

export function RankingCard({ ranking, loading }: RankingCardProps) {
  if (loading)
    return <div className="p-8 text-center">Carregando ranking...</div>;
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2">
        <Trophy className="h-5 w-5 text-gold" />
        <h3 className="font-bold">Ranking Global</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pos</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead className="text-right">Ganhos (R$)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranking.slice(0, 10).map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono">
                #{entry.rank_position}
              </TableCell>
              <TableCell>{entry.user}</TableCell>
              <TableCell className="text-right font-medium">
                {parseFloat(entry.total_earnings).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
