import Button from "../../../components/ui/Button";

export default function ProjectCard({
  project,
  isEditing,
  onEdit,
  onDelete,
  children,
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      {isEditing ? (
        children
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {project.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {project.description || "No description provided"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button onClick={onEdit}>Edit</Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}