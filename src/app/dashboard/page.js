
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

import AdminDashboard from "@/components/dashboard/admin-dashboard";
import MemberDashboard from "@/components/dashboard/member-dashboard";

export default function DashboardPage() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const role = session?.user?.role?.trim().toLowerCase();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <p className="text-gray-600 dark:text-slate-300">
          Checking authentication...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <p className="text-gray-600 dark:text-slate-300">
          Redirecting to login...
        </p>
      </main>
    );
  }

  if (!["admin", "librarian", "member"].includes(role)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-4 dark:bg-slate-950 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mt-2 text-gray-600 dark:text-slate-300">
            Your account does not have a valid library role.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {role === "admin" && (
        <AdminDashboard role="admin" />
      )}

      {role === "librarian" && (
        <AdminDashboard role="librarian" />
      )}

      {role === "member" && (
        <MemberDashboard />
      )}
    </>
  );
}
