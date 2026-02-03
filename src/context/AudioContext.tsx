import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import type { Sermon } from '../data/types';
import type { AudioState } from '../data/types';

interface AudioContextValue {
  currentSermon: Sermon | null;
  state: AudioState;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  loadSermon: (sermon: Sermon) => void;
  closePlayer: () => void;
}

const defaultState: AudioState = {
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  knownDuration: 0, // Duration from sermon metadata (reliable)
  volume: 1,
  error: null,
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [state, setState] = useState<AudioState>(defaultState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';

    const audio = audioRef.current;

    const handleLoadStart = () => setState(s => ({ ...s, isLoading: true }));
    const handleCanPlay = () => setState(s => ({ ...s, isLoading: false }));
    const handlePlay = () => setState(s => ({ ...s, isPlaying: true }));
    const handlePause = () => setState(s => ({ ...s, isPlaying: false }));
    const handleTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }));
    const handleDurationChange = () => setState(s => ({ ...s, duration: audio.duration || 0 }));
    const handleVolumeChange = () => setState(s => ({ ...s, volume: audio.volume }));
    const handleError = () => setState(s => ({ ...s, error: 'Failed to load audio', isLoading: false }));
    const handleEnded = () => setState(s => ({ ...s, isPlaying: false }));

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Parse duration string like "24:00" to seconds
  const parseDuration = (durationStr?: string): number => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const loadSermon = useCallback((sermon: Sermon) => {
    if (!audioRef.current) return;

    // If same sermon, don't reload
    if (currentSermon?.id === sermon.id) return;

    const audio = audioRef.current;
    audio.src = sermon.audio_url;
    audio.load();
    setCurrentSermon(sermon);

    // Use sermon's known duration from metadata (more reliable than opus stream duration)
    const knownDuration = parseDuration(sermon.duration);
    setState(s => ({ ...s, currentTime: 0, duration: 0, knownDuration, error: null }));

    // Auto-play
    audio.play().catch(() => {
      // Autoplay might be blocked
    });
  }, [currentSermon?.id]);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentSermon(null);
    setState(defaultState);
  }, []);

  return (
    <AudioContext.Provider value={{
      currentSermon,
      state,
      play,
      pause,
      seek,
      setVolume,
      loadSermon,
      closePlayer,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider');
  }
  return context;
}
