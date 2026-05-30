"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-3xl border border-border shadow-lg relative z-10">
        {children}
      </div>
    </div>
  );
}
