'use client';

import { useState } from 'react';

// Define the props for this client component
interface WatchShowClientProps {
  show: {
    id: number;
    name: string;
    seasons: {
      id: number;
      season_number: number;
      episode_count: number;
    }[];
  };
}

const WatchShowClient = ({ show }: WatchShowClientProps) => {
  const [selectedSeason, setSelectedSeason] = useState(show.seasons.find(s => s.season_number > 0)?.season_number || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  
  // Create an array of episodes for the selected season
  const episodes = Array.from({ length: show.seasons.find(s => s.season_number === selectedSeason)?.episode_count || 0 }, (_, i) => i + 1);

  const embedUrl = `https://vidsrc.to/embed/tv/${show.id}/${selectedSeason}/${selectedEpisode}`;

  return (
    <div className="w-full max-w-4xl">
      {/* Episode Player */}
      <div className="w-full rounded-lg overflow-hidden shadow-lg mb-6">
        <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full border-none"
            allowFullScreen
          />
        </div>
      </div>
      
      {/* Season and Episode Selectors */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
        {/* Season Selector */}
        <div className="flex-1">
          <label htmlFor="season-select" className="block text-gray-400 text-sm font-medium mb-2">
            Select Season
          </label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => {
              setSelectedSeason(parseInt(e.target.value, 10));
              setSelectedEpisode(1); // Reset episode to 1 when season changes
            }}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {show.seasons
              .filter(s => s.season_number > 0)
              .sort((a, b) => a.season_number - b.season_number)
              .map((season) => (
                <option key={season.id} value={season.season_number}>
                  Season {season.season_number}
                </option>
              ))}
          </select>
        </div>

        {/* Episode Selector */}
        <div className="flex-1">
          <label htmlFor="episode-select" className="block text-gray-400 text-sm font-medium mb-2">
            Select Episode
          </label>
          <select
            id="episode-select"
            value={selectedEpisode}
            onChange={(e) => setSelectedEpisode(parseInt(e.target.value, 10))}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            {episodes.map((episode) => (
              <option key={episode} value={episode}>
                Episode {episode}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WatchShowClient;
