
interface MinimalEventDotProps {
    isLeft: boolean;
    onToggleExpand: () => void;
    title: string;
  }
  
  const MinimalEventDot = ({ isLeft, onToggleExpand, title }: MinimalEventDotProps) => {
    return (
      <div
      className={`timeline-card zoomed-out ${
        isLeft ? 'timeline-card-above' : 'timeline-card-below'
      } transition-all duration-300 ease-in-out h-3 w-3 rounded-full bg-cuba-red cursor-pointer border border-white`}
      onClick={onToggleExpand}
      title={title}
    />
    );
  };
  
  export default MinimalEventDot;
  