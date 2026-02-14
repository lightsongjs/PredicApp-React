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
  cyclePlaybackRate: () => void;
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
  playbackRate: 1,
  error: null,
};

const AudioContext = createContext<AudioContextValue | null>(null);

// Check if browser supports Opus audio
function checkOpusSupport(): boolean {
  const audio = document.createElement('audio');
  // Try multiple MIME types for Opus
  const opusTypes = [
    'audio/opus',
    'audio/ogg; codecs=opus',
    'audio/webm; codecs=opus'
  ];

  for (const type of opusTypes) {
    const canPlay = audio.canPlayType(type);
    console.log(`[Audio] canPlayType('${type}'):`, canPlay || '(empty)');
    if (canPlay === 'probably' || canPlay === 'maybe') {
      return true;
    }
  }

  // Chrome should support Opus - if detection fails, assume it works
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  const isEdge = /Edge|Edg/.test(navigator.userAgent);

  console.log('[Audio] Browser detection - Chrome:', isChrome, 'Firefox:', isFirefox, 'Edge:', isEdge);

  if (isChrome || isFirefox || isEdge) {
    console.log('[Audio] Modern browser detected, assuming Opus support');
    return true;
  }

  return false;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [state, setState] = useState<AudioState>(defaultState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadingSermonIdRef = useRef<string | null>(null); // Track what's currently loading to prevent race conditions
  const opusSupportedRef = useRef<boolean>(true);

  // Create audio element once
  useEffect(() => {
    // Check Opus support
    opusSupportedRef.current = checkOpusSupport();
    if (!opusSupportedRef.current) {
      console.error('[Audio] WARNING: Browser does not support Opus format! Audio may not play correctly.');
      console.error('[Audio] Safari users: Please use Chrome, Firefox, or Edge for best experience.');
    }

    audioRef.current = new Audio();
    audioRef.current.preload = 'auto'; // Changed from 'metadata' to 'auto' for better buffering

    const audio = audioRef.current;

    const handleLoadStart = () => {
      console.log('[Audio] loadstart');
      setState(s => ({ ...s, isLoading: true }));
    };
    const handleCanPlay = () => {
      console.log('[Audio] canplay - ready to play');
      setState(s => ({ ...s, isLoading: false }));
    };
    const handlePlay = () => {
      console.log('[Audio] play event');
      setState(s => ({ ...s, isPlaying: true }));
    };
    const handlePause = () => {
      console.log('[Audio] pause event - currentTime:', audio.currentTime, 'duration:', audio.duration);
      console.log('[Audio] pause - readyState:', audio.readyState, 'ended:', audio.ended);
      // Log stack trace to see what triggered the pause
      console.trace('[Audio] pause stack trace');
      setState(s => ({ ...s, isPlaying: false }));
    };
    const handleTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }));
    const handleDurationChange = () => setState(s => ({ ...s, duration: audio.duration || 0 }));
    const handleVolumeChange = () => setState(s => ({ ...s, volume: audio.volume }));
    const handleRateChange = () => setState(s => ({ ...s, playbackRate: audio.playbackRate }));
    const handleError = () => {
      const error = audio.error;
      console.error('[Audio] ERROR:', error?.code, error?.message);
      setState(s => ({ ...s, error: `Audio error: ${error?.message || 'Unknown'}`, isLoading: false }));
    };
    const handleEnded = () => {
      console.log('[Audio] ended at currentTime:', audio.currentTime, 'duration:', audio.duration);
      console.log('[Audio] ended - readyState:', audio.readyState, 'networkState:', audio.networkState);
      console.log('[Audio] ended - paused:', audio.paused, 'ended:', audio.ended);
      setState(s => ({ ...s, isPlaying: false }));
    };
    const handleStalled = () => {
      console.log('[Audio] stalled - network issue?');
      console.log('[Audio] stalled - currentTime:', audio.currentTime, 'buffered:', audio.buffered.length > 0 ? `${audio.buffered.start(0)}-${audio.buffered.end(0)}` : 'none');
    };
    const handleWaiting = () => {
      console.log('[Audio] waiting - buffering...');
      console.log('[Audio] waiting - currentTime:', audio.currentTime, 'readyState:', audio.readyState);
    };
    const handleSuspend = () => {
      console.log('[Audio] suspend - currentTime:', audio.currentTime, 'paused:', audio.paused);
    };
    const handleAbort = () => {
      console.log('[Audio] abort - playback was aborted');
    };
    const handleEmptied = () => {
      console.log('[Audio] emptied - media resource emptied');
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('ratechange', handleRateChange);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('suspend', handleSuspend);
    audio.addEventListener('abort', handleAbort);
    audio.addEventListener('emptied', handleEmptied);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('ratechange', handleRateChange);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('suspend', handleSuspend);
      audio.removeEventListener('abort', handleAbort);
      audio.removeEventListener('emptied', handleEmptied);
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

    // Use ref for synchronous check to prevent race conditions
    // (React state updates are batched and might not be immediate)
    if (loadingSermonIdRef.current === sermon.id) {
      console.log('[AudioContext] Same sermon already loading, skipping:', sermon.id);
      return;
    }

    console.log('[AudioContext] Loading sermon:', sermon.id, sermon.title);
    console.log('[AudioContext] Audio URL:', sermon.audio_url);

    // Log warning if opus detection failed (but don't block - detection can be unreliable)
    if (!opusSupportedRef.current && sermon.audio_url.endsWith('.opus')) {
      console.warn('[AudioContext] Opus support detection failed, but attempting playback anyway...');
    }

    loadingSermonIdRef.current = sermon.id;

    const audio = audioRef.current;

    // Stop any current playback first
    audio.pause();
    audio.currentTime = 0;

    // Use sermon's known duration from metadata (more reliable than opus stream duration)
    const knownDuration = parseDuration(sermon.duration);
    setState(s => ({ ...s, currentTime: 0, duration: 0, knownDuration, error: null, isLoading: true }));
    setCurrentSermon(sermon);

    // Set new source - this triggers load automatically
    // Use encodeURI to properly encode special characters (diacritics) in filenames
    audio.src = encodeURI(sermon.audio_url);

    // Play when enough data is buffered
    const playWhenReady = () => {
      console.log('[AudioContext] canplaythrough - enough data buffered, starting playback...');
      audio.play().catch((err) => {
        console.error('[AudioContext] Play failed:', err);
      });
    };

    // Fallback: if canplaythrough doesn't fire within 5 seconds, try playing anyway
    const fallbackTimeout = setTimeout(() => {
      console.log('[AudioContext] Timeout waiting for buffer, attempting playback anyway...');
      audio.removeEventListener('canplaythrough', playWhenReady);
      audio.play().catch((err) => {
        console.error('[AudioContext] Fallback play failed:', err);
      });
    }, 5000);

    // Wait for canplaythrough event (enough data to play without buffering)
    audio.addEventListener('canplaythrough', () => {
      clearTimeout(fallbackTimeout);
      playWhenReady();
    }, { once: true });
  }, []);

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

  const cyclePlaybackRate = useCallback(() => {
    if (!audioRef.current) return;
    const rates = [1, 1.5, 2];
    const currentIdx = rates.indexOf(audioRef.current.playbackRate);
    const nextRate = rates[(currentIdx + 1) % rates.length];
    audioRef.current.playbackRate = nextRate;
  }, []);

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    loadingSermonIdRef.current = null;
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
      cyclePlaybackRate,
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
