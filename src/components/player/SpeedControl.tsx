interface SpeedControlProps {
  playbackRate: number;
  onSpeedChange: (rate: number) => void;
}

const SPEEDS = [1, 1.5, 2];

export default function SpeedControl({ playbackRate, onSpeedChange }: SpeedControlProps) {
  const cycleSpeed = () => {
    const currentIndex = SPEEDS.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    onSpeedChange(SPEEDS[nextIndex]);
  };

  return (
    <button
      onClick={cycleSpeed}
      className="px-3 py-1 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors text-white text-sm font-semibold min-w-[3.5rem]"
    >
      {playbackRate}x
    </button>
  );
}
