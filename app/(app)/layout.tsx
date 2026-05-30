"use client";

import React from "react";
import { Header } from "@/components/header/header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 pt-20 pb-10">
        {children}
      </main>
      <Header />
    </>
  );
}
