import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

export default function PlaygroundLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
