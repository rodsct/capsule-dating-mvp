"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, MessageCircle, User, Boxes } from "lucide-react";
import { useGame } from "@/lib/auth";
import { classNames } from "@/lib/utils";

const LINKS = [
  { href: "/lobby", label: "Sala", icon: Gamepad2, badge: "none" as const },
  { href: "/profile/me", label: "Cápsulas", icon: Boxes, badge: "bought" as const },
  { href: "/chats", label: "Chats", icon: MessageCircle, badge: "unread" as const },
  { href: "/profile/me", label: "Perfil", icon: User, badge: "none" as const },
];

export function Navigation() {
  const pathname = usePathname();
  const { chats, purchases } = useGame();

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
            l.href === "/lobby"
              ? pathname === "/lobby" ||
                pathname.startsWith("/machine") ||
                pathname.startsWith("/place")
              : l.href === "/chats"
                ? pathname === "/chats" || pathname.startsWith("/chat/")
                : false;
          if (isProfileRoute && l.label === "Cápsulas") {
            active = pathname === "/profile/me";
          }
          const badge = values[l.badge];
          const Icon = l.icon;
          return (
            <Link
              key={`${l.href}-${l.label}`}
              href={l.href}
              className={classNames(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] transition-colors",
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