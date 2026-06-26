"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <main className="flex-1 overflow-y-auto bg-bg p-8">
      {children}
    </main>
  );
}