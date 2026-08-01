export default function ScrollIndicator() {
  return (
    <div className="relative h-12 w-7 rounded-full border-2 border-primary-600">
      <span className="animate-scroll absolute top-1 left-4 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-500" />
    </div>
  );
}
