import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutApiMutation } from "../../features/auth/authApi";
import { logout } from "../../features/auth/authSlice";
import Button from "../ui/Button";

export default function AppShell() {
  const dispatch = useDispatch();
  const [logoutApi, { isLoading }] = useLogoutApiMutation();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore logout API failure for now
    } finally {
      dispatch(logout());
    }
  };

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              SaaS Task Platform
            </h1>
            <p className="text-sm text-slate-600">
              {user?.email || "Authenticated user"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <NavLink to="/" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/workspaces" className={navClass}>
              Workspaces
            </NavLink>
            <NavLink to="/projects" className={navClass}>
              Projects
            </NavLink>
            <Button onClick={handleLogout} disabled={isLoading}>
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
