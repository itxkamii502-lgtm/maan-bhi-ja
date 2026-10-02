import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio.ts';

interface AudioPlayerButtonProps {
  className?: string;
  enabled?: boolean;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  className = '',
  enabled = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(romanticAudio.getIsPlaying());
  }, []);

  if (!enabled) {
    // If admin disabled sound, do not render sound controls
    return null;
  }

  const handleToggle = () => {
    if (isPlaying) {
      romanticAudio.stop();
      setIsPlaying(false);
    } else {
      romanticAudio.start();
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={isPlaying ? 'Click to Mute / Stop music' : 'Play background music'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border cursor-pointer active:scale-95 ${
        isPlaying
          ? 'bg-rose-900/80 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
          : 'bg-neutral-900/70 border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-500'
      } ${className}`}
      title={isPlaying ? 'Click to Mute / Stop Audio' : 'Play Background Melody'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-300" />
          <span className="text-[11px] font-bold">Mute / بند کریں</span>
        </>
      ) : (
        <>
          <Music className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Play Melody</span>
        </>
      )}
    </button>
  );
};
