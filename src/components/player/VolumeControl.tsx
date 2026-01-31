import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="flex items-center gap-3 w-full max-w-xs">
      <button
        onClick={() => onVolumeChange(volume > 0 ? 0 : 0.6)}
        className="flex-shrink-0 hover:scale-110 transition-transform"
      >
        <VolumeIcon className="w-5 h-5 text-white opacity-80 hover:opacity-100 transition-opacity" />
      </button>
      <div className="flex-1 relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleChange}
          className="volume-slider w-full h-1 bg-white bg-opacity-20 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
      </div>
    </div>
  );
}
