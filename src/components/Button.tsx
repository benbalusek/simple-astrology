export default function Button({
  onClick,
  isLoading,
  disabled = false,
}: {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}) {
  const label = isLoading ? "Loading…" : "Calculate";

  return (
    <div className="mt-8 flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`border-moon rounded-2xl border px-6 py-2 ${
          disabled || isLoading
            ? "cursor-not-allowed opacity-50"
            : "bg-moon text-midnight hover:bg-midnight hover:text-moon cursor-pointer"
        } `}
      >
        {label}
      </button>
    </div>
  );
}
