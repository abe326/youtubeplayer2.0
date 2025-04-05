"use client";

import { Plus, Trash2, Repeat, Shuffle } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { usePlayerStore } from '@/lib/store';

export function PlaylistManager() {
  const { 
    currentVideo, 
    playlist, 
    playlistSettings,
    addToPlaylist, 
    removeFromPlaylist,
    setPlaylistSettings 
  } = usePlayerStore();

  const handleAddToPlaylist = () => {
    if (currentVideo) {
      addToPlaylist(currentVideo);
    }
  };

  return (
    <div className="bg-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Playlist</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={playlistSettings.repeat}
              onCheckedChange={(checked) =>
                setPlaylistSettings({ ...playlistSettings, repeat: checked })
              }
            />
            <Repeat className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={playlistSettings.shuffle}
              onCheckedChange={(checked) =>
                setPlaylistSettings({ ...playlistSettings, shuffle: checked })
              }
            />
            <Shuffle className="h-4 w-4" />
          </div>
          <Button onClick={handleAddToPlaylist} size="icon" disabled={!currentVideo}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          {playlist.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-2 p-2 hover:bg-accent rounded group"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-16 h-9 object-cover rounded"
              />
              <span className="flex-1 truncate text-sm">{video.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => removeFromPlaylist(video.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}