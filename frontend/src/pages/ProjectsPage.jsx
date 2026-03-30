import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/ui/Card";
import ProjectForm from "../features/project/components/ProjectForm";
import ProjectCard from "../features/project/components/ProjectCard";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../features/project/projectApi";
import toast from "react-hot-toast";
import { useConfirmAction } from "../hooks/useConfirmAction";

export default function ProjectsPage() {
  const activeWorkspaceId = useSelector(
    (state) => state.workspace.activeWorkspaceId,
  );
  const { confirmAction } = useConfirmAction();
  const [editingProjectId, setEditingProjectId] = useState(null);

  const { data, isLoading, isFetching, error } = useGetProjectsQuery(
    activeWorkspaceId,
    {
      skip: !activeWorkspaceId,
    },
  );

  const [createProject, { isLoading: isCreating, error: createError }] =
    useCreateProjectMutation();

  const [updateProject, { isLoading: isUpdating, error: updateError }] =
    useUpdateProjectMutation();

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  if (!activeWorkspaceId) {
    return <Navigate to="/workspaces" replace />;
  }

  const projects = data?.data || [];

  const handleCreateProject = async (values) => {
    try {
      await createProject({
        workspaceId: activeWorkspaceId,
        body: values,
      }).unwrap();
      toast.success("Project created successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Project creation failed");
    }
  };

  const handleUpdateProject = async (projectId, values) => {
    try {
      await updateProject({
        workspaceId: activeWorkspaceId,
        projectId,
        body: values,
      }).unwrap();
      toast.success("Project updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Project update failed");
    }

    setEditingProjectId(null);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = confirmAction(
      "Are you sure you want to delete this Project?",
    );

    if (!confirmed) return;

    try {
      await deleteProject({
        workspaceId: activeWorkspaceId,
        projectId,
      }).unwrap();
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Project deletion failed");
    }
  };

  if (isLoading || isFetching) {
    return (
      <Card>
        <p className="text-sm text-slate-600">Loading projects...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Failed to load projects
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {error?.data?.message ||
            "Something went wrong while loading projects."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage projects inside the active workspace.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Create project
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Add a new project for this workspace.
          </p>
        </div>

        <ProjectForm
          mode="create"
          onSubmit={handleCreateProject}
          isLoading={isCreating}
          serverError={createError}
        />
      </Card>

      {projects.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            No projects yet. Create your first project above.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isEditing={editingProjectId === project.id}
              onEdit={() => setEditingProjectId(project.id)}
              onDelete={() => handleDeleteProject(project.id)}
            >
              <ProjectForm
                mode="edit"
                initialValues={project}
                onSubmit={(values) => handleUpdateProject(project.id, values)}
                isLoading={isUpdating}
                serverError={updateError}
                onCancel={() => setEditingProjectId(null)}
              />
            </ProjectCard>
          ))}
        </div>
      )}

      {isDeleting ? (
        <p className="text-sm text-slate-500">Deleting project...</p>
      ) : null}
    </div>
  );
}
