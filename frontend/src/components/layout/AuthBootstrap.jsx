import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "../../features/auth/authApi";
import { logout, setUser } from "../../features/auth/authSlice";

export default function AuthBootstrap({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error?.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  if (isAuthenticated && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">
        Loading session...
      </div>
    );
  }

  return children;
}