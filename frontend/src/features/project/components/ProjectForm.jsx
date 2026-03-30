import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../../../components/form/FormField";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function ProjectForm({
  mode = "create",
  initialValues,
  onSubmit,
  isLoading,
  serverError,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || "",
        description: initialValues.description || "",
      });
    }
  }, [initialValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Project name" error={errors.name?.message}>
        <Input
          type="text"
          placeholder="Enter project name"
          {...register("name", {
            required: "Project name is required",
            minLength: {
              value: 2,
              message: "Project name must be at least 2 characters",
            },
          })}
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder="Enter project description"
          {...register("description")}
        />
      </FormField>

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
            ? "Create project"
            : "Update project"}
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