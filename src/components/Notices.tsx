export default function Notices({
  error,
  block,
}: {
  error?: string | null;
  block?: string | null;
}) {
  if (!error && !block) return null;
  return <p className="text-rose mt-4 text-center text-sm">{error ?? block}</p>;
}
