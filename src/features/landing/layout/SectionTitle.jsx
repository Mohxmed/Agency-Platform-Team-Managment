function SectionTitle({ children, title, redTitle, variant = "dark" }) {
  return (
    <>
      <h2
        className={`mt-6 text-4xl font-bold leading-tight lg:text-6xl
          ${variant === "light" ? "text-white" : "text-neutral-900 dark:text-white"}`}
      >
        {title}
        <span
          className={`
            ${variant === "light" ? "text-white" : "text-primary-600"}
          `}
        >
          {" "}
          {redTitle}
        </span>
      </h2>

      <p
        className={`mt-6 text-lg leading-8
          ${variant === "light" ? "text-white/70" : "text-gray-500 dark:text-neutral-400"}
        `}
      >
        {children}
      </p>
    </>
  );
}

export default SectionTitle;
