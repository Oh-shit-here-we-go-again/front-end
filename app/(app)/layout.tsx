"use client";

import React from "react";
import { Header } from "@/components/header/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen bg-background pb-20">{children}</main>
      <Header />
    </>
  );
}
