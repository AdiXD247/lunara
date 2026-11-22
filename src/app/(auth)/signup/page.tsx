"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { signup, user, ready } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = signup(name, email, password);
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

      <h1 className="mt-8 text-3xl lg:mt-0">Create your account</h1>
      <p className="mt-3 text-sm leading-relaxed text-plum-500">
        Twenty seconds now, then Lunara maps your next six cycles.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {error && (
          <p className="rounded-2xl border border-blush-200 bg-blush-50 px-4 py-3 text-sm text-blush-700">{error}</p>
        )}

        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="field"
            placeholder="Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
          />
        </div>

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="mt-2 text-xs text-plum-300">Stored locally on this device — pick anything you&apos;ll remember.</p>
        </div>

        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-plum-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blush-600 hover:text-blush-700">
          Sign in
        </Link>
      </p>

      <p className="mt-8 text-xs leading-relaxed text-plum-300">
        By continuing you agree that Lunara is a tracking tool, not a medical device, and not a form of contraception.
      </p>
    </div>
  );
}
