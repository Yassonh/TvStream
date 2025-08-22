'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define interfaces for the data we expect from the API
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}

// Union type for the content, allowing it to be either a Movie or a TVShow
type Content = Movie | TVShow;

export default function Home() {
  const [content, setContent] = useState<Content[]>([]);
  const [contentType, setContentType] = useState("movie"); // "movie" or "tv"
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state on new fetch
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      
      if (!API_KEY) {
        setError("Missing TMDB API key. Please set NEXT_PUBLIC_TMDB_API_KEY in your .env file.");
        setLoading(false);
        return;
      }

      const url = search
        ? `https://api.themoviedb.org/3/search/${contentType}?api_key=${API_KEY}&query=${search}&page=${page}`
        : `https://api.themoviedb.org/3/trending/${contentType}/week?api_key=${API_KEY}&page=${page}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent(data.results || []);
      } catch (e) {
        setError("Failed to fetch data. Please check your network connection and API key.");
        console.error("Fetch error: ", e);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType, page, search]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const isMovie = (item: Content): item is Movie => {
    return (item as Movie).title !== undefined;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gray-950 text-white font-sans">
      <div className="z-10 w-full max-w-7xl flex flex-col items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-400">Yassuflix</h1>

        <div className="w-full flex justify-center mb-6 space-x-4">
          <button
            onClick={() => { setContentType("movie"); setPage(1); }}
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${contentType === 'movie' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-purple-600'}`}
          >
            Movies
          </button>
          <button
            onClick={() => { setContentType("tv"); setPage(1); }}
            className={`px-6 py-2 rounded-full transition-colors duration-300 ${contentType === 'tv' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-purple-600'}`}
          >
            TV Shows
          </button>
        </div>

        <div className="w-full mb-6">
          <input
            type="text"
            placeholder={`Search ${contentType}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-shadow duration-300"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-400 py-10">{error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
            {content.length > 0 ? (
              content.map((item) => (
                <Link
                  key={item.id}
                  href={`/${contentType}/${item.id}`}
                  className="relative group rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
                >
                  <Image
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "https://placehold.co/500x750/0f172a/9ca3af?text=No+Image"}
                    alt={isMovie(item) ? item.title : item.name}
                    width={500}
                    height={750}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                  <div className="p-3 absolute bottom-0 left-0 right-0">
                    <h2 className="text-lg font-semibold text-white truncate">
                      {"name" in item ? item.name : item.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {"first_air_date" in item
                        ? (new Date(item.first_air_date).getFullYear() || "N/A")
                        : (new Date(item.release_date).getFullYear() || "N/A")}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full py-10">No results found.</p>
            )}
          </div>
        )}
      </div>

      <footer className="flex justify-center items-center py-6 px-4 md:px-8 border-t border-gray-700 w-full max-w-7xl mt-8">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-300 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
        >
          Previous Page
        </button>
        <span className="text-gray-400 text-sm">Page {page}</span>
        <button
          onClick={handleNextPage}
          className="bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-300 hover:bg-purple-600 ml-4"
        >
          Next Page
        </button>
      </footer>
    </main>
  );
}
