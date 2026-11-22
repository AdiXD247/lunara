"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppNav } from "@/components/AppNav";
import { LogoMark } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
      <LogoMark className="h-12 w-12 animate-float" />
      <p className="text-sm text-plum-500">Opening your cycle…</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-cream">
      <AppNav />
      <main className="container-page py-8 sm:py-10">{children}</main>
    </div>
  );
}
