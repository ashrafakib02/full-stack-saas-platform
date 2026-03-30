import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreateWorkspaceMutation,
  useGetWorkspacesQuery,
} from "../features/workspace/workspaceApi";
import { setActiveWorkspace } from "../features/workspace/workspaceSlice";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FormField from "../components/form/FormField";

export default function WorkspacesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeWorkspaceId = useSelector(
    (state) => state.workspace.activeWorkspaceId
  );

  const { data, isLoading, isFetching } = useGetWorkspacesQuery();
  const [createWorkspace, { isLoading: isCreating, error: createError }] =
    useCreateWorkspaceMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const workspaces = data?.data || [];

  useEffect(() => {
    if (!activeWorkspaceId && workspaces.length > 0) {
      const firstWorkspaceId = workspaces[0]?.workspace?.id;
      if (firstWorkspaceId) {
        dispatch(setActiveWorkspace(firstWorkspaceId));
      }
    }
  }, [activeWorkspaceId, workspaces, dispatch]);

  const onSubmit = async (values) => {
    const response = await createWorkspace(values).unwrap();

    const newWorkspaceId = response?.data?.id;

    if (newWorkspaceId) {
      dispatch(setActiveWorkspace(newWorkspaceId));
      reset();
      navigate("/", { replace: true });
    }
  };

  const handleSelectWorkspace = (workspaceId) => {
    dispatch(setActiveWorkspace(workspaceId));
    navigate("/", { replace: true });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Your workspaces</h2>
          <p className="mt-1 text-sm text-slate-600">
            Select a workspace to continue.
          </p>
        </div>

        {isLoading || isFetching ? (
          <p className="text-sm text-slate-600">Loading workspaces...</p>
        ) : workspaces.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            No workspaces yet. Create your first workspace from the form.
          </div>
        ) : (
          <div className="space-y-3">
            {workspaces.map((item) => {
              const workspace = item.workspace;
              const isActive = workspace?.id === activeWorkspaceId;

              return (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => handleSelectWorkspace(workspace.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{workspace.name}</h3>
                      <p
                        className={`mt-1 text-sm ${
                          isActive ? "text-slate-200" : "text-slate-600"
                        }`}
                      >
                        Slug: {workspace.slug}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Create workspace</h2>
          <p className="mt-1 text-sm text-slate-600">
            Start a new team workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Workspace name" error={errors.name?.message}>
            <Input
              type="text"
              placeholder="Enter workspace name"
              {...register("name", {
                required: "Workspace name is required",
                minLength: {
                  value: 2,
                  message: "Workspace name must be at least 2 characters",
                },
              })}
            />
          </FormField>

          {createError?.data?.message ? (
            <p className="text-sm text-red-600">{createError.data.message}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create workspace"}
          </Button>
        </form>
      </Card>
    </div>
  );
}