import Header from "@/features/landing/layout/Header";

function layout({ children }) {
  return (
    <div className="landing-shell min-h-full bg-background text-ink">
      <Header />
      {children}
    </div>
  );
}

export default layout;
