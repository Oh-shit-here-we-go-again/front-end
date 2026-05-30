"use client";

import React from "react";
import { Header } from "@/components/header/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex-1 pb-24">
        {children}
      </main>
      <Header />
    </>
  );
}
