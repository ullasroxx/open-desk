"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  title: string;
  subtitle: string;
  accentColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function Sidebar({
  items,
  title,
  subtitle,
  accentColor = "#4f8fff",
  gradientFrom = "from-accent-blue",
  gradientTo = "to-accent-purple",
}: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <aside
      className="fixed top-0 left-0 h-full z-40 flex flex-col bg-bg-secondary/95 backdrop-blur-xl border-r border-border-default"
      style={{ width: 260 }}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border-default">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shrink-0`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-text-primary truncate">{title}</h2>
          <p className="text-[10px] text-text-muted truncate">{subtitle}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
              <div className={`sidebar-item relative ${isActive ? "active" : ""}`}>
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: accentColor }}
                    layoutId="sidebar-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: accentColor + "20", color: accentColor }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border-default">
        <div className="glass-card-sm p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white text-xs font-bold`}>
              U
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">User Name</p>
              <p className="text-[10px] text-text-muted truncate">user@opendesk.edu</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 z-50 p-3">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="glass-card-sm p-2.5 rounded-xl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      <div className={`hidden md:block`}>{nav}</div>
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setMobileOpen(false)} />
          <div className="md:hidden">{nav}</div>
        </>
      )}
    </>
  );
}
