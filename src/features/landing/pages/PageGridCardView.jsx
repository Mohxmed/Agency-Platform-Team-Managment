import React from "react";

function PageGridCardView({ children }) {
  return (
    <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 pt-10 pb-10">
      {children}
    </div>
  );
}

export default PageGridCardView;
