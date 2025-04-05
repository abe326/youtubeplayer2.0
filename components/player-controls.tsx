"use client";

import { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { usePlayerStore } from '@/lib/store';

export function PlayerControls() {
  const {
    isPlaying,
    volume,
    isMuted,
    repeatRange,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setRepeatRange,
  } = usePlayerStore();
  const playerRef = useRef<any>(null);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
    }
    setIsMuted(!isMuted);
  };

  const handleRangeChange = (value: number[]) => {
    setRepeatRange({
      ...repeatRange,
      start: Math.min(value[0], value[1]),
      end: Math.max(value[0], value[1]),
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={handlePlayPause} variant="ghost" size="icon">
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleMuteToggle} variant="ghost" size="icon">
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="w-32">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Repeat className="h-4 w-4" />
          <Switch
            checked={repeatRange.enabled}
            onCheckedChange={(checked) =>
              setRepeatRange({ ...repeatRange, enabled: checked })
            }
          />
        </div>
        {repeatRange.enabled && (
          <div className="flex-1">
            <Slider
              value={[repeatRange.start, repeatRange.end]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleRangeChange}
              className="flex-1"
            />
          </div>
        )}
      </div>
    </div>
  );
}