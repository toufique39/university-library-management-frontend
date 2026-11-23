
export default function StatCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-5">

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:mt-3 sm:text-3xl">
            {value ?? 0}
          </h3>

          {description && (
            <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-slate-800 sm:h-12 sm:w-12 sm:text-2xl">
          {icon}
        </div>
      </div>

    </div>
  );
}
