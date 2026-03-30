import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetWorkspaceDashboardQuery } from "../features/dashboard/dashboardApi";
import StatCard from "../features/dashboard/components/StatCard";
import BreakdownCard from "../features/dashboard/components/BreakdownCard";
import DashboardSkeleton from "../features/dashboard/components/DashboardSkeleton";
import Card from "../components/ui/Card";

export default function DashboardPage() {
  const activeWorkspaceId = useSelector(
    (state) => state.workspace.activeWorkspaceId
  );

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetWorkspaceDashboardQuery(activeWorkspaceId, {
    skip: !activeWorkspaceId,
  });

  if (!activeWorkspaceId) {
    return <Navigate to="/workspaces" replace />;
  }

  if (isLoading || isFetching) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">
          Failed to load dashboard
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {error?.data?.message || "Something went wrong while loading stats."}
        </p>
      </Card>
    );
  }

  const stats = data?.data;

  if (!stats) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-slate-900">No dashboard data</h2>
        <p className="mt-2 text-sm text-slate-600">
          Create some projects and tasks to see analytics here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Workspace overview and task analytics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.totalTasks ?? 0} />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks ?? 0} />
        <StatCard title="Projects" value={stats.totalProjects ?? 0} />
        <StatCard title="Members" value={stats.totalMembers ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreakdownCard
          title="Tasks by Status"
          items={stats.tasksByStatus || []}
          valueKey="status"
        />

        <BreakdownCard
          title="Tasks by Priority"
          items={stats.tasksByPriority || []}
          valueKey="priority"
        />
      </div>
    </div>
  );
}