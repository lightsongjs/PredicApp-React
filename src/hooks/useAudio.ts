import { useState, useEffect, useRef } from 'react';
import type { AudioState } from '../data/types';

interface UseAudioReturn {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (level: number) => void;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
  state: AudioState;
}

export function useAudio(src: string): UseAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 0.6,
    error: null,
  });

  useEffect(() => {
    console.log('🎵 [useAudio] Creating audio element for:', src);
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.volume = state.volume;
    audio.preload = 'auto';

    // Add to DOM (hidden) to ensure browser allows playback
    audio.style.display = 'none';
    document.body.appendChild(audio);
    console.log('🎵 [useAudio] Audio element added to DOM');

    const handleLoadedMetadata = () => {
      console.log('✅ [useAudio] Metadata loaded, duration:', audio.duration);
      setState(prev => ({
        ...prev,
        duration: audio.duration,
        isLoading: false,
      }));
    };

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const handleEnded = () => {
      console.log('⏹️ [useAudio] Audio ended');
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
      audio.currentTime = 0;
    };

    const handleError = (e: Event) => {
      console.error('❌ [useAudio] Audio error:', e);
      console.error('❌ [useAudio] Error details:', audio.error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load audio',
        isLoading: false,
        isPlaying: false,
      }));
    };

    const handleCanPlay = () => {
      console.log('✅ [useAudio] Can play - audio ready, readyState:', audio.readyState);
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleWaiting = () => {
      console.log('⏳ [useAudio] Waiting - buffering...');
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const handleLoadStart = () => {
      console.log('🔄 [useAudio] Load started');
    };

    const handleLoadedData = () => {
      console.log('✅ [useAudio] Data loaded, readyState:', audio.readyState);
    };

    const handlePlaying = () => {
      console.log('▶️ [useAudio] Playing event fired');
    };

    const handlePause = () => {
      console.log('⏸️ [useAudio] Pause event fired');
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('pause', handlePause);

    return () => {
      console.log('🧹 [useAudio] Cleaning up audio element');
      audio.pause();
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('pause', handlePause);

      // Remove from DOM
      if (audio.parentNode) {
        audio.parentNode.removeChild(audio);
      }

      audioRef.current = null;
    };
  }, [src]);

  const play = async () => {
    console.log('▶️ [useAudio] Play function called');
    if (!audioRef.current) {
      console.error('❌ [useAudio] No audio ref!');
      return;
    }

    try {
      console.log('🔄 [useAudio] Setting loading state...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const readyState = audioRef.current.readyState;
      console.log('📊 [useAudio] Current readyState:', readyState, '(0=nothing, 1=metadata, 2=current, 3=future, 4=enough)');

      // Load the audio if not already loaded
      if (readyState < 2) {
        console.log('🔄 [useAudio] ReadyState < 2, calling load()...');
        audioRef.current.load();
      } else {
        console.log('✅ [useAudio] Audio already loaded, readyState:', readyState);
      }

      console.log('🎵 [useAudio] Calling audio.play()...');
      const playPromise = audioRef.current.play();

      console.log('⏳ [useAudio] Waiting for play() promise...');
      await playPromise;

      console.log('✅ [useAudio] Play() promise resolved! Audio should be playing');
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    } catch (err) {
      console.error('❌ [useAudio] Play error:', err);
      console.error('❌ [useAudio] Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('❌ [useAudio] Error message:', err instanceof Error ? err.message : String(err));
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Nu s-a putut reda audio',
        isPlaying: false,
        isLoading: false,
      }));
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState(prev => ({ ...prev, currentTime: time }));
  };

  const setVolume = (level: number) => {
    if (!audioRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, level));
    audioRef.current.volume = clampedVolume;
    setState(prev => ({ ...prev, volume: clampedVolume }));
  };

  const skipForward = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds);
    seek(newTime);
  };

  const skipBackward = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, audioRef.current.currentTime - seconds);
    seek(newTime);
  };

  return {
    play,
    pause,
    seek,
    setVolume,
    skipForward,
    skipBackward,
    state,
  };
}
