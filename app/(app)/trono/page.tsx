"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { UserHeader } from "@/components/trono/UserHeader";
import { StatsCards } from "@/components/trono/StatsCards";
import { RecentSessions } from "@/components/trono/RecentSessions";
import { User as ApiUser } from "@/types/api";

export default function TronoPage() {
  const { user, recentSessions, totalEarnings, totalSessions, totalPoints, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Carregando painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Painel do Trono</h1>
      {user && <UserHeader user={user as unknown as ApiUser} />}
      <StatsCards
        totalEarnings={totalEarnings}
        totalSessions={totalSessions}
        totalPoints={totalPoints}
      />
      <RecentSessions sessions={recentSessions} />
    </div>
  );
}
