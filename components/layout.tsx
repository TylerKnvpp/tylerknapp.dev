import React from "react";
import { Navigation } from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="w-screen h-screen flex flex-col">
      <Navigation />
      {children}
    </main>
  );
};
