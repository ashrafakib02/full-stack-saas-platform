import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../../../components/form/FormField";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function TaskForm({
  mode = "create",
  initialValues,
  onSubmit,
  isLoading,
  serverError,
  onCancel,
  projects = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      dueDate: "",
      projectId: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title || "",
        description: initialValues.description || "",
        priority: initialValues.priority || "MEDIUM",
        status: initialValues.status || "TODO",
        dueDate: initialValues.dueDate
          ? new Date(initialValues.dueDate).toISOString().slice(0, 10)
          : "",
        projectId: initialValues.projectId || "",
      });
    }
  }, [initialValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Task title" error={errors.title?.message}>
        <Input
          type="text"
          placeholder="Enter task title"
          {...register("title", {
            required: "Task title is required",
            minLength: {
              value: 2,
              message: "Task title must be at least 2 characters",
            },
          })}
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder="Enter task description"
          {...register("description")}
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Priority" error={errors.priority?.message}>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("priority")}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("status")}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Due date" error={errors.dueDate?.message}>
          <Input type="date" {...register("dueDate")} />
        </FormField>

        <FormField label="Project" error={errors.projectId?.message}>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("projectId")}
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {serverError?.data?.message ? (
        <p className="text-sm text-red-600">{serverError.data.message}</p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create task"
            : "Update task"}
        </Button>

        {onCancel ? (
          <Button
            type="button"
            className="bg-slate-200 text-slate-900 hover:bg-slate-300"
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}