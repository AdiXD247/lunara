import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <LogoMark className="h-12 w-12 animate-float" />
      <p className="eyebrow mt-8">404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">This page took a day off</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-plum-500">
        We couldn&apos;t find what you were looking for. Your cycle data is safe — let&apos;s get you back to it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className="btn-primary">
          Go to dashboard
        </Link>
        <Link href="/" className="btn-secondary">
          Back home
        </Link>
      </div>
    </div>
  );
}
