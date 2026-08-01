"use client";

const cardStyle = "rounded-2xl border bg-card p-6 shadow-sm";

export default function ProjectsStats({
  total,
  completed,
  progress,
  planning,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <div className={cardStyle}>
        <p className="text-sm text-gray-500">Total Projects</p>

        <h2 className="mt-3 text-3xl font-bold">{total}</h2>
      </div>

      <div className={cardStyle}>
        <p className="text-sm text-gray-500">Completed</p>

        <h2 className="mt-3 text-3xl font-bold text-green-600">{completed}</h2>
      </div>

      <div className={cardStyle}>
        <p className="text-sm text-gray-500">In Progress</p>

        <h2 className="mt-3 text-3xl font-bold text-orange-500">{progress}</h2>
      </div>

      <div className={cardStyle}>
        <p className="text-sm text-gray-500">Planning</p>

        <h2 className="mt-3 text-3xl font-bold text-blue-600">{planning}</h2>
      </div>
    </div>
  );
}
