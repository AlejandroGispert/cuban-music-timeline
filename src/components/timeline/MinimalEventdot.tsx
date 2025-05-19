interface MinimalEventDotProps {
  isLeft: boolean;
  onToggleExpand: () => void;
  title: string; // year or event title
}

const MinimalEventDot = ({ isLeft, onToggleExpand, title }: MinimalEventDotProps) => {
  return (
    <div
      className={`
        relative flex items-center ${isLeft ? "justify-end mb-4" : "justify-start mt-4"}
      `}
    >
      {isLeft && <span className="mr-2 text-xs text-gray-500 whitespace-nowrap">{title}</span>}

      <button
        onClick={onToggleExpand}
        className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white hover:scale-110 transition-transform"
        aria-label={title}
        title={title}
      />

      {!isLeft && <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">{title}</span>}
    </div>
  );
};

export default MinimalEventDot;
