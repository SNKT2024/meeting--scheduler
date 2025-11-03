"use client";
import React, { useState, useEffect } from "react";
import SideNavBar from "./_components/SideNavBar";
import DashboardHeader from "./_components/DashboardHeader";
import { Toaster } from "@/components/ui/sonner";

function DashboardLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative w-64 bg-slate-50 h-full z-20 transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <SideNavBar closeMenu={() => setIsMenuOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <DashboardHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        </header>
        <Toaster />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 sm:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
