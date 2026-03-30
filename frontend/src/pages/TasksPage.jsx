import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/ui/Card";
import { useGetProjectsQuery } from "../features/project/projectApi";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "../features/task/taskApi";
import TaskForm from "../features/task/components/TaskForm";
import TaskFilters from "../features/task/components/TaskFilters";
import TaskCard from "../features/task/components/TaskCard";
import TaskPagination from "../features/task/components/TaskPagination";

export default function TasksPage() {
  const activeWorkspaceId = useSelector(
    (state) => state.workspace.activeWorkspaceId
  );

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const taskQueryParams = useMemo(
    () => ({
      page: String(filters.page),
      limit: String(filters.limit),
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [filters]
  );

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetTasksQuery(
    {
      workspaceId: activeWorkspaceId,
      params: taskQueryParams,
    },
    {
      skip: !activeWorkspaceId,
    }
  );

  const { data: projectsResponse } = useGetProjectsQuery(activeWorkspaceId, {
    skip: !activeWorkspaceId,
  });

  const projects = projectsResponse?.data || [];
  const taskResult = data?.data;
  const tasks = taskResult?.data || [];
  const meta = taskResult?.meta;

  const [createTask, { isLoading: isCreating, error: createError }] =
    useCreateTaskMutation();

  const [updateTask, { isLoading: isUpdating, error: updateError }] =
    useUpdateTaskMutation();

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  if (!activeWorkspaceId) {
    return <Navigate to="/workspaces" replace />;
  }

  const handleCreateTask = async (values) => {
    await createTask({
      workspaceId: activeWorkspaceId,
      body: {
        ...values,
        projectId: values.projectId || undefined,
        dueDate: values.dueDate || undefined,
      },
    }).unwrap();
  };

  const handleUpdateTask = async (taskId, values) => {
    await updateTask({
      workspaceId: activeWorkspaceId,
      taskId,
      body: {
        ...values,
        projectId: values.projectId || undefined,
        dueDate: values.dueDate || undefined,
      },
    }).unwrap();

    setEditingTaskId(null);
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    await deleteTask({
      workspaceId: activeWorkspaceId,
      taskId,
    }).unwrap();
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  if (isLoading || isFetching) {
    return (
      <Card>
        <p className="text-sm text-slate-600">Loading tasks...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Failed to load tasks
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {error?.data?.message || "Something went wrong while loading tasks."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Tasks</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage tasks inside the active workspace.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Create task</h3>
          <p className="mt-1 text-sm text-slate-600">
            Add a new task to the active workspace.
          </p>
        </div>

        <TaskForm
          mode="create"
          onSubmit={handleCreateTask}
          isLoading={isCreating}
          serverError={createError}
          projects={projects}
        />
      </Card>

      <TaskFilters filters={filters} setFilters={setFilters} />

      {tasks.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            No tasks found. Create a task or change filters.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isEditing={editingTaskId === task.id}
              onEdit={() => setEditingTaskId(task.id)}
              onDelete={() => handleDeleteTask(task.id)}
            >
              <TaskForm
                mode="edit"
                initialValues={task}
                onSubmit={(values) => handleUpdateTask(task.id, values)}
                isLoading={isUpdating}
                serverError={updateError}
                onCancel={() => setEditingTaskId(null)}
                projects={projects}
              />
            </TaskCard>
          ))}
        </div>
      )}

      <TaskPagination meta={meta} onPageChange={handlePageChange} />

      {isDeleting ? (
        <p className="text-sm text-slate-500">Deleting task...</p>
      ) : null}
    </div>
  );
}