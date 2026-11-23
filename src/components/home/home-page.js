
import Link from "next/link";

const features = [
  {
    icon: "📚",
    title: "Explore Books",
    description:
      "Discover a wide range of academic books, programming resources, and learning materials.",
  },
  {
    icon: "📖",
    title: "Easy Borrowing",
    description:
      "Submit book borrowing requests online and track their approval status easily.",
  },
  {
    icon: "🕒",
    title: "Borrowing History",
    description:
      "Keep track of your borrowed books, issue dates, and return deadlines.",
  },
  {
    icon: "🔐",
    title: "Secure Access",
    description:
      "Access personalized library services with secure role-based accounts.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Account",
    description:
      "Register for your university library account.",
  },
  {
    number: "02",
    title: "Find Your Books",
    description:
      "Search books by title, author, or category.",
  },
  {
    number: "03",
    title: "Request Borrowing",
    description:
      "Send a borrowing request for an available book.",
  },
  {
    number: "04",
    title: "Enjoy Reading",
    description:
      "Collect your approved book and return it on time.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100">

      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:py-32">

          <div>
            <span className="inline-block rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-xs font-medium text-blue-200 sm:text-sm">
              🎓 University Library Management System
            </span>

            <h1 className="mt-7 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-6xl">
              Discover Knowledge.
              <span className="block text-blue-300">
                Explore Possibilities.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/80 md:text-lg">
              Your digital gateway to academic knowledge.
              Discover books, request borrowing, and manage
              your library experience in one place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-white px-7 py-4 font-bold text-blue-900 transition hover:bg-blue-100"
              >
                Get Started →
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Member Login
              </Link>
            </div>

            <p className="mt-6 text-sm text-blue-200/70">
              Learn · Explore · Borrow · Grow
            </p>
          </div>

          {/* Hero Illustration */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-blue-400/10 shadow-2xl shadow-blue-500/20 sm:h-80 sm:w-80 md:h-96 md:w-96">

              <div className="absolute h-48 w-48 rounded-full bg-blue-400/10 blur-2xl sm:h-64 sm:w-64" />

              <div className="relative px-4 text-center">
                <div className="text-7xl sm:text-8xl md:text-9xl">📚</div>

                <p className="mt-5 text-xl font-bold text-white">
                  Your Knowledge Hub
                </p>

                <p className="mt-2 text-sm text-blue-200">
                  One Library. Endless Learning.
                </p>
              </div>

              <span className="absolute right-8 top-8 hidden text-4xl sm:block">
                ✨
              </span>

              <span className="absolute bottom-12 left-5 hidden text-4xl sm:block">
                📖
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-white px-4 py-16 sm:px-6 sm:py-24 dark:bg-slate-950"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          <div>
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              About Our Library
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
              Making University Learning Easier and Smarter
            </h2>

            <p className="mt-6 leading-8 text-gray-600 dark:text-slate-300">
              UniLibrary is a digital university library management
              platform designed to make accessing academic resources
              simple and convenient.
            </p>

            <p className="mt-4 leading-8 text-gray-600 dark:text-slate-300">
              Students can explore books and submit borrowing requests,
              while librarians can efficiently manage books, borrowing
              requests, and returns.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Join Our Library →
            </Link>
          </div>

          <div className="flex min-h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900">
            <div className="text-center">
              <div className="text-8xl">🏛️</div>

              <h3 className="mt-5 text-2xl font-bold text-blue-950 dark:text-white">
                A Smarter Library Experience
              </h3>

              <p className="mt-3 text-gray-600 dark:text-slate-300">
                Designed for university students and librarians.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 dark:bg-slate-900"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Our Features
            </span>

            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Everything You Need in One Library
            </h2>

            <p className="mt-4 leading-7 text-gray-600 dark:text-slate-300">
              Simple tools to make managing and accessing library
              resources easier.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-3xl dark:bg-slate-700">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-white px-4 py-16 sm:px-6 sm:py-24 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Simple Process
            </span>

            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              How Our Library Works
            </h2>

            <p className="mt-4 text-gray-600 dark:text-slate-300">
              Get access to your academic resources in four simple steps.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-200 dark:shadow-none">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="bg-white px-4 pb-16 sm:px-6 sm:pb-24 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-700 px-6 py-12 text-center sm:px-8 sm:py-16 md:px-16">

          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Start Your Learning Journey Today
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-blue-100">
            Create your university library account and explore
            academic resources with a simpler library experience.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-900 transition hover:bg-blue-100"
          >
            Create Your Account →
          </Link>

        </div>
      </section>

    </main>
  );
}
