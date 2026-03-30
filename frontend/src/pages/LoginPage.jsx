import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useLoginMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FormField from "../components/form/FormField";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginUser, { isLoading, isSuccess, data, error }] =
    useLoginMutation();

  const onSubmit = async (values) => {
    try {
      await loginUser(values).unwrap();
    } catch (err) {
      // error toast here
      toast.error(err?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(
        setCredentials({
          accessToken: data.data.tokens.accessToken,
          user: data.data.user,
        })
      );

      toast.success("Logged in successfully");
      navigate("/", { replace: true });
    }
  }, [isSuccess, data, dispatch, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">
            Login to continue to your workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </FormField>

          {error?.data?.message ? (
            <p className="text-sm text-red-600">{error.data.message}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-slate-900 underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}