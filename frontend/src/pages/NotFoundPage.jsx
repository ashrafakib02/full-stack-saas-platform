import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you are looking for does not exist.
        </p>

        <div className="mt-6">
          <Link to="/">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}