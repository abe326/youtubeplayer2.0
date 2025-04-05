"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { usePlayerStore } from '@/lib/store';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentVideo, addToHistory } = usePlayerStore();

  useEffect(() => {
    const searchVideos = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // APIレスポンスをVideo型に変換
        const formattedResults = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle
        }));
        
        setResults(formattedResults);
      } catch (error) {
        console.error('検索中にエラーが発生しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchVideos();
  }, [query]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
    addToHistory(video);
    onClose();
  };

  return (
    <div className="relative bg-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">検索結果</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-4">検索結果がありません</div>
          ) : (
            results.map((video) => (
              <div
                key={video.id}
                className="flex gap-4 p-2 hover:bg-accent rounded-lg cursor-pointer"
                onClick={() => handleVideoSelect(video)}
              >
                <div className="relative w-40 h-24">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-2">{video.title}</h4>
                  <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}