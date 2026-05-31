"use client";

import React from "react";
import { Header } from "@/components/header/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen bg-background pt-20 pb-20">{children}</main>
      <Header />
    </>
  );
}
