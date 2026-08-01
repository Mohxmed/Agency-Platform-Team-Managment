export default function Container({ children, className = "" }) {
  return (
    <div
      className={`
        mx-auto
        w-full
        max-w-[1600px]
        px-4
        sm:px-8
        md:px-10
        lg:px-12
        xl:px-14
        2xl:px-16
        ${className}
      `}
    >
      {children}
    </div>
  );
}
