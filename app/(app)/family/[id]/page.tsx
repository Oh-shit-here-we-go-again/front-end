"use client";

import React, { use } from "react";

interface FamilyPageProps {
  params: Promise<{ id: string }>;
}

export default function FamilyPage({ params }: FamilyPageProps) {
  const { id } = use(params);

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Família</h1>
      <p className="text-muted-foreground">ID da Família: {id}</p>
      <div className="bg-card p-6 rounded-2xl border shadow-sm">
        <p className="text-sm">Em breve, você poderá visualizar o ranking e membros da sua família aqui.</p>
      </div>
    </div>
  );
}
