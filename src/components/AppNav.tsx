"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "./Logo";
import { useAuth } from "@/lib/auth";

const NAV = [
  {
    href: "/dashboard",
    label: "Today",
    icon: <path d="M4 11.5 12 5l8 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20z" />,
  },
  {
    href: "/dashboard/calendar",
    label: "Calendar",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    href: "/dashboard/log",
    label: "Log day",
    icon: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
  },
  {
    href: "/dashboard/insights",
    label: "Insights",
    icon: <path d="M5 20V11M12 20V4M19 20v-6" />,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.3M17.6 15.2l2.2 1.3M4.2 16.5l2.2-1.3M17.6 8.8l2.2-1.3" />
      </>
    ),
  },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-blush-100 bg-cream/90 backdrop-blur-md">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <span className="font-display text-lg font-semibold text-plum-900">Lunara</span>
        </Link>

        <nav className="-order-1 flex w-full gap-1 overflow-x-auto pb-1 sm:order-none sm:w-auto sm:pb-0">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  active ? "bg-blush-500 text-white shadow-soft" : "text-plum-700 hover:bg-blush-100"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-plum-500 sm:inline">{user?.name}</span>
          <button type="button" onClick={handleLogout} className="btn-ghost px-4 py-2 text-sm">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
