import Input from "../../../components/ui/Input";

export default function TaskFilters({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <div className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-6">
      <Input
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
      />

      <select
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={filters.status}
        onChange={(e) => updateFilter("status", e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={filters.priority}
        onChange={(e) => updateFilter("priority", e.target.value)}
      >
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <select
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={filters.sortBy}
        onChange={(e) => updateFilter("sortBy", e.target.value)}
      >
        <option value="createdAt">Created At</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      <select
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={filters.sortOrder}
        onChange={(e) => updateFilter("sortOrder", e.target.value)}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>

      <select
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        value={filters.limit}
        onChange={(e) => updateFilter("limit", e.target.value)}
      >
        <option value="5">5 / page</option>
        <option value="10">10 / page</option>
        <option value="20">20 / page</option>
      </select>
    </div>
  );
}