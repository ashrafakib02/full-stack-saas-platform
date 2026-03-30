import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/ui/Card";

export default function DashboardPage() {
  const activeWorkspaceId = useSelector(
    (state) => state.workspace.activeWorkspaceId
  );

  if (!activeWorkspaceId) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">
        Active workspace: {activeWorkspaceId}
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Day 17: dashboard analytics widgets go here.
      </p>
    </Card>
  );
}