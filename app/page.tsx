"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video-player';
import { PlaylistManager } from '@/components/playlist-manager';
import { SearchResults } from '@/components/search-results';
import { PlayerControls } from '@/components/player-controls';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search YouTube videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer />
              <PlayerControls />
              {showSearchResults && (
                <SearchResults
                  query={searchQuery}
                  onClose={() => setShowSearchResults(false)}
                />
              )}
            </div>

            {/* Playlist Section */}
            <div className="space-y-4">
              <PlaylistManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}