import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

interface PlayerState {
  currentVideo: Video | null;
  playlist: Video[];
  history: Video[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  repeatRange: {
    start: number;
    end: number;
    enabled: boolean;
  };
  playlistSettings: {
    repeat: boolean;
    shuffle: boolean;
  };
  setCurrentVideo: (video: Video | null) => void;
  addToHistory: (video: Video) => void;
  addToPlaylist: (video: Video) => void;
  removeFromPlaylist: (videoId: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setRepeatRange: (range: { start: number; end: number; enabled: boolean }) => void;
  setPlaylistSettings: (settings: { repeat: boolean; shuffle: boolean }) => void;
  reorderPlaylist: (oldIndex: number, newIndex: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentVideo: null,
      playlist: [],
      history: [],
      isPlaying: false,
      volume: 1,
      isMuted: false,
      repeatRange: {
        start: 0,
        end: 100,
        enabled: false,
      },
      playlistSettings: {
        repeat: false,
        shuffle: false,
      },
      setCurrentVideo: (video) => set({ currentVideo: video }),
      addToHistory: (video) =>
        set((state) => ({
          history: [video, ...state.history.filter((v) => v.id !== video.id)].slice(0, 50),
        })),
      addToPlaylist: (video) =>
        set((state) => ({
          playlist: [...state.playlist, video],
        })),
      removeFromPlaylist: (videoId) =>
        set((state) => ({
          playlist: state.playlist.filter((v) => v.id !== videoId),
        })),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setIsMuted: (isMuted) => set({ isMuted }),
      setRepeatRange: (range) => set({ repeatRange: range }),
      setPlaylistSettings: (settings) => set({ playlistSettings: settings }),
      reorderPlaylist: (oldIndex, newIndex) =>
        set((state) => {
          const playlist = [...state.playlist];
          const [removed] = playlist.splice(oldIndex, 1);
          playlist.splice(newIndex, 0, removed);
          return { playlist };
        }),
    }),
    {
      name: 'player-storage',
    }
  )
);