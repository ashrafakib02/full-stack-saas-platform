import Button from "../../../components/ui/Button";

export default function TaskPagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">
        Page {meta.page} of {meta.totalPages} · Total {meta.total}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          className="bg-slate-200 text-slate-900 hover:bg-slate-300"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>

        <Button
          type="button"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}