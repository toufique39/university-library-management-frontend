
import Link from "next/link";

// Computed once at module load so it is stable during prerendering.
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">

        {/* Brand */}
        <div>
          <Link href="/" className="text-2xl font-bold">
            📚 UniLibrary
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
            A digital university library platform built to
            make academic resources more accessible.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>

            <Link href="/#about" className="hover:text-white">
              About
            </Link>

            <Link href="/#features" className="hover:text-white">
              Features
            </Link>

            <Link href="/#how-it-works" className="hover:text-white">
              How It Works
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-bold">Library Access</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
            <Link href="/login" className="hover:text-white">
              Login
            </Link>

            <Link href="/register" className="hover:text-white">
              Register
            </Link>

            <Link href="/books" className="hover:text-white">
              Explore Books
            </Link>
          </div>
        </div>

      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-6 text-center text-sm text-gray-500 sm:mt-10">
        © {currentYear} UniLibrary. All rights reserved.
      </div>
    </footer>
  );
}
