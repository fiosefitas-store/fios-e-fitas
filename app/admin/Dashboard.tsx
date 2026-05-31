"use client";

import { ReactNode } from "react";
import { Tab } from "./page";

interface Props {
  activeTab: Tab;
  children: ReactNode;
}

export default function Dashboard({
  activeTab,
  children,
}: Props) {
  return (
    <main className="flex-1 overflow-y-auto bg-bg p-8">
      {children}
    </main>
  );
}