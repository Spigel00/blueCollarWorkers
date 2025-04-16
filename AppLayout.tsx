
import React from "react";
import { AppNav } from "./AppNav";
import { AppFooter } from "./AppFooter";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNav />
      <main className="flex-grow">{children}</main>
      <AppFooter />
    </div>
  );
};
