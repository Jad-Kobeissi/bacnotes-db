export default function Error({
  error,
  className,
}: {
  error: string;
  className?: string;
}) {
  return <h1 className={`text-center text-red-500 ${className}`}>{error}</h1>;
}
