export default function HighlightText({ children, varient = "landing" }) {
  const style =
    varient == "page"
      ? "bg-linear-to-l from-primary-500 to-primary-700 h-3"
      : "bg-linear-to-l from-primary-700/10 to-primary-500/20 h-2";
  return (
    <span className="relative inline-block">
      {children}
      <span
        className={`absolute bottom-1 left-0 -z-10 w-full rounded-full ${style}`}
      />
    </span>
  );
}
