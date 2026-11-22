"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.replace("/dashboard");
  }

  return (
    <div className="animate-fade-up">
      <div className="lg:hidden">
        <Logo />
      </div>

      <h1 className="mt-8 text-3xl lg:mt-0">Welcome back</h1>
      <p className="mt-3 text-sm leading-relaxed text-plum-500">
        Sign in to see your cycle, your predictions and your logs.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {error && (
          <p className="rounded-2xl border border-blush-200 bg-blush-50 px-4 py-3 text-sm text-blush-700">{error}</p>
        )}

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="field"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-plum-500">
        New to Lunara?{" "}
        <Link href="/signup" className="font-semibold text-blush-600 hover:text-blush-700">
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-3xl border border-blush-100 bg-white p-5">
        <p className="text-xs leading-relaxed text-plum-500">
          <span className="font-semibold text-plum-900">Where does this live?</span> Accounts and logs are stored in
          this browser only. Nothing is sent to a server, so no one else can see your data.
        </p>
      </div>
    </div>
  );
}
