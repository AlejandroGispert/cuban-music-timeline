interface MinimalEventDotProps {
  isLeft: boolean;
  onToggleExpand: () => void;
  title: string;
}

const MinimalEventDot = ({ isLeft, onToggleExpand, title }: MinimalEventDotProps) => {
  return (
    <div
      className={`
          w-3 h-3 rounded-full bg-cuba-red border-2 border-white cursor-pointer 
          ${isLeft ? "mb-[80px]" : "mt-[80px]"} 
          transition-all
        `}
      onClick={onToggleExpand}
      title={title}
    />
  );
};

export default MinimalEventDot;
