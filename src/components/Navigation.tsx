"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, MessageCircle, User, Package } from "lucide-react";
import { useGame } from "@/lib/auth";
import { classNames } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: "none" | "bought" | "unread";
  /** Only show this tab to authenticated users (hides it otherwise). */
  authOnly?: boolean;
}

const LINKS: NavLink[] = [
  { href: "/", label: "Máquina", icon: Package, badge: "none" },
  { href: "/profile/me", label: "Mis cápsulas", icon: Boxes, badge: "bought", authOnly: true },
  { href: "/chats", label: "Chats", icon: MessageCircle, badge: "unread", authOnly: true },
  { href: "/profile/me", label: "Perfil", icon: User, badge: "none" },
];

export function Navigation() {
  const pathname = usePathname();
  const { chats, purchases, user, ready, status } = useGame();

  // While the session is resolving, keep all tabs visible to avoid flicker.
  const authed = ready && status === "authenticated" && !!user;
  const hideAuthOnly = ready && !authed;

  const unreadCount = Object.values(chats).reduce(
    (acc, list) =>
      acc + (list.length > 0 && !list[list.length - 1].mine ? 1 : 0),
    0,
  );
  const values: Record<string, number | null> = {
    none: null,
    bought: purchases.length > 0 ? purchases.length : null,
    unread: unreadCount > 0 ? unreadCount : null,
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 glass-strong">
      <div className="mx-auto max-w-md px-2 py-1.5 flex items-stretch justify-around">
        {LINKS.map((l) => {
          const isProfileRoute = l.href === "/profile/me";
          let active =
            l.href === "/"
              ? pathname === "/" ||
                pathname.startsWith("/machine") ||
                pathname.startsWith("/place")
              : l.href === "/chats"
                ? pathname === "/chats" || pathname.startsWith("/chat/")
                : false;
          if (isProfileRoute && l.label === "Mis cápsulas") {
            active = pathname === "/profile/me" && false;
          }
          if (isProfileRoute && l.label === "Perfil") {
            active = pathname === "/profile/me";
          }
          const badge = values[l.badge];
          const Icon = l.icon;
          return (
            <Link
              key={`${l.href}-${l.label}`}
              href={l.href}
              aria-hidden={hideAuthOnly && l.authOnly ? true : undefined}
              tabIndex={hideAuthOnly && l.authOnly ? -1 : undefined}
              className={classNames(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] transition-colors",
                hideAuthOnly && l.authOnly
                  ? "pointer-events-none opacity-30"
                  : "",
                active ? "text-cyber-neon" : "text-white/55 hover:text-white",
              )}
            >
              <span className="relative">
                <Icon className={classNames("h-5 w-5", active && "text-cyber-neon")} />
                {badge !== null && badge !== undefined && (
                  <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-cyber-neon px-1 text-[9px] font-bold text-black">
                    {badge}
                  </span>
                )}
              </span>
              <span className="font-medium tracking-wide">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}