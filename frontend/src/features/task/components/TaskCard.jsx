import Button from "../../../components/ui/Button";

export default function TaskCard({
  task,
  isEditing,
  onEdit,
  onDelete,
  children,
}) {
  const priorityClassMap = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HIGH: "bg-red-100 text-red-700",
  };

  const statusLabelMap = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  if (isEditing) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        {children}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {statusLabelMap[task.status] || task.status}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              priorityClassMap[task.priority] || "bg-slate-100 text-slate-700"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
        <p>Project: {task.projectId || "No project"}</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={onEdit}>Edit</Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}