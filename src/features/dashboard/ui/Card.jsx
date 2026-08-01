import clsx from "clsx";

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx("rounded-card bg-card p-5 shadow-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}
