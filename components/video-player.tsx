"use client";

import { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { usePlayerStore } from '@/lib/store';
import { Card } from './ui/card';

export function VideoPlayer() {
  const playerRef = useRef<any>(null);
  const { currentVideo, isPlaying, volume, isMuted, repeatRange, setIsPlaying } = usePlayerStore();

  useEffect(() => {
    if (playerRef.current && repeatRange.enabled) {
      const checkTime = () => {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= repeatRange.end) {
          playerRef.current.seekTo(repeatRange.start);
        }
      };
      const interval = setInterval(checkTime, 1000);
      return () => clearInterval(interval);
    }
  }, [repeatRange]);

  const onReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume * 100);
    event.target.setPlaybackRate(1);
    if (isMuted) event.target.mute();
  };

  const onStateChange = (event: any) => {
    setIsPlaying(event.data === YouTube.PlayerState.PLAYING);
  };

  if (!currentVideo) {
    return (
      <Card className="aspect-video flex items-center justify-center text-muted-foreground">
        No video selected
      </Card>
    );
  }

  return (
    <div className="aspect-video">
      <YouTube
        videoId={currentVideo.id}
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full h-full"
      />
    </div>
  );
}