interface MinimalEventDotProps {
  isLeft: boolean;
  onToggleExpand: () => void;
  title: string; // year or event title
}

const MinimalEventDot = ({ isLeft, onToggleExpand, title }: MinimalEventDotProps) => {
  return (
    <div
      className={`
        relative flex items-center ${isLeft ? "justify-end" : "justify-start"}
        group cursor-pointer
      `}
    >
      {isLeft && (
        <span className="mr-2 text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {title}
        </span>
      )}

      <button
        onClick={onToggleExpand}
        className="w-2 h-2 rounded-full bg-cuba-red hover:scale-110 transition-transform"
        aria-label={title}
        title={title}
      />

      {!isLeft && (
        <span className="ml-2 text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {title}
        </span>
      )}
    </div>
  );
};

export default MinimalEventDot;
