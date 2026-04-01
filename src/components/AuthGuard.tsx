"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "client" | "agent" | "admin";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      router.push("/");
      return;
    }
  }, [session, status, router, requiredRole]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#00132e] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
