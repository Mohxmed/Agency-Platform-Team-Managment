import HighlightText from "@/shared/ui/typography/HighlightText";

function PageCenterTitles({ Icon, title, description }) {
  return (
    <div className="flex-col flex items-center text-center justify-center gap-4">
      <div className="w-12 h-12 rounded-sm bg-linear-to-r from-primary-600 to-orange-500 flex justify-center items-center text-2xl text-white">
        <Icon />
      </div>
      <HighlightText>
        <h1 className="text-5xl font-bold mb-2">{title}</h1>
      </HighlightText>
      <p className="">{description}</p>
    </div>
  );
}

export default PageCenterTitles;
