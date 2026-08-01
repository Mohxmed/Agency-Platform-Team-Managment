import Header from "@/features/landing/layout/Header";

function layout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default layout;
