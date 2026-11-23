
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const role = session?.user?.role;

  const isManager = ["admin", "librarian"].includes(role);

  const closeMenu = () => setMenuOpen(false);

  const publicLinks = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Features", href: "/#features" },
  ];

  const memberLinks = [
    { label: "Books", href: "/books" },
    { label: "My Borrowing", href: "/my-borrow-requests" },
  ];

  const managerLinks = [
    { label: "Books", href: "/books" },
    { label: "Categories", href: "/categories" },
    { label: "Borrow Requests", href: "/admin/borrow-requests" },
    { label: "Borrow Records", href: "/admin/borrow-records" },
  ];

  const privateLinks = isManager ? managerLinks : memberLinks;

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setError(error.message);
        return;
      }

      closeMenu();
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const linkClass =
    "text-sm font-medium text-gray-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <span className="text-3xl">📚</span>

          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              UniLibrary
            </h1>

            <p className="text-xs text-gray-500 dark:text-slate-400">
              University Library System
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 xl:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass}
            >
              {link.label}
            </Link>
          ))}

          {!isPending &&
            session &&
            privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass}
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 xl:flex">

          <ThemeToggle />

          {isPending ? (
            <span className="text-sm text-gray-400">
              Loading...
            </span>
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                className={linkClass}
              >
                Dashboard
              </Link>

              <span className="max-w-32 truncate text-sm font-medium text-gray-700 dark:text-slate-300">
                {session.user.name}
              </span>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-lg dark:border-slate-700"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5 xl:hidden">

          <div className="flex flex-col gap-4">

            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={linkClass}
              >
                {link.label}
              </Link>
            ))}

            {!isPending &&
              session &&
              privateLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              ))}

            {isPending ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Dashboard
                </Link>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {session.user.name} ({role})
                </p>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="rounded-lg bg-red-600 px-4 py-3 font-semibold text-white"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={linkClass}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}

          </div>

        </div>
      )}

      {error && (
        <p className="mx-auto max-w-7xl px-6 pb-2 text-sm text-red-500">
          {error}
        </p>
      )}

    </header>
  );
}
