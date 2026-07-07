import React, { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import SignInForm from "@/app/components/SignInForm";
import { Loader2 } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Royal Braids account.",
  alternates: {
    canonical: "/signin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SigninPage() {
  const settings = isDatabaseConfigured()
    ? await prisma.siteSettings.findUnique({ where: { id: 1 } })
    : null;

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-200" />
      </div>
    }>
      <SignInForm logoUrl={settings?.logoUrl ?? undefined} />
    </Suspense>
  );
}
