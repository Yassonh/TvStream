'use client';

import { useState } from "react";

interface ShowDetails {
  id: number;
  name: string;
  seasons: {
    id: number;
    season_number: number;
    episode_count: number;
  }[];
}

interface WatchShowClientProps {
  show: ShowDetails;
}

export default function WatchShowClient({ show }: WatchShowClientProps) {
  // Find the last season that has a season number greater than 0
  const lastSeason = show.seasons?.slice()?.reverse()?.find(s => s.season_number > 0);
  const initialSeason = lastSeason?.season_number || 1;
  const initialEpisodes = lastSeason?.episode_count || 1;

  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const embedUrl = `https://vidsrc.to/embed/tv/${show.id}/${selectedSeason}/${selectedEpisode}`;

  const seasons = show.seasons || [];
  const selectedSeasonData = seasons.find(s => s.season_number === selectedSeason);
  const totalEpisodes = selectedSeasonData?.episode_count || 0;
  const episodes = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <>
      <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg mb-6">
        <div className="relative" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full border-none"
            allowFullScreen
          />
        </div>
      </div>

      <div className="w-full max-w-4xl mb-6">
        <h2 className="text-xl font-bold mb-2">Select Season</h2>
        <div className="flex flex-wrap gap-2">
          {seasons
            .filter(season => season.season_number > 0)
            .map(season => (
              <button
                key={season.id}
                onClick={() => {
                  setSelectedSeason(season.season_number);
                  setSelectedEpisode(1);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                  selectedSeason === season.season_number ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {`S${season.season_number}`}
              </button>
            ))}
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-2">Select Episode</h2>
        <div className="flex flex-wrap gap-2">
          {episodes.length > 0 ? (
            episodes.map(episode => (
              <button
                key={episode}
                onClick={() => setSelectedEpisode(episode)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                  selectedEpisode === episode ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {`E${episode}`}
              </button>
            ))
          ) : (
            <p className="text-gray-400">No episodes available for this season.</p>
          )}
        </div>
      </div>
    </>
  );
}
