'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [content, setContent] = useState([]);
  const [contentType, setContentType] = useState("movie"); // "movie" or "tv"
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const url = search
        ? `https://api.themoviedb.org/3/search/${contentType}?api_key=${API_KEY}&query=${search}&page=${page}`
        : `https://api.themoviedb.org/3/${contentType}/popular?api_key=${API_KEY}&page=${page}`;

      const response = await fetch(url, { next: { revalidate: 3600 } });
      const data = await response.json();
      setContent(data.results);
      setLoading(false);
    };

    const handler = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [page, search, contentType]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setPage(1);
    setSearch("");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="py-6 px-4 md:px-8 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 md:mb-0">Yassuflix</h1>
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => handleContentTypeChange("movie")}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
              contentType === "movie" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => handleContentTypeChange("tv")}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
              contentType === "tv" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            TV Shows
          </button>
        </div>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={`Search for a ${contentType === "movie" ? "movie" : "TV show"}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 px-6 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      <main className="p-4 md:p-8">
        {loading ? (
          <div className="text-center py-20">
            <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {content.length > 0 ? (
              content.map((item) => (
                <Link href={`/${contentType}/${item.id}`} key={item.id} className="block group rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl relative">
                  <div className="aspect-[2/3] w-full">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name}
                      width={500}
                      height={750}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                  <div className="p-3 absolute bottom-0 left-0 right-0">
                    <h2 className="text-lg font-semibold text-white truncate">{item.title || item.name}</h2>
                    <p className="text-sm text-gray-400">
                      {item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date).getFullYear() : "N/A"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full py-10">No results found.</p>
            )}
          </div>
        )}
      </main>

      <footer className="flex justify-center items-center py-6 px-4 md:px-8 border-t border-gray-700">
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
    </div>
  );
}