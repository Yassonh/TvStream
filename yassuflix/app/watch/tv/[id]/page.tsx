import Link from "next/link";
import WatchShowClient from "./WatchShowClient";

export default async function WatchShow({ params }) {
  const { id } = params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch show details");
  }

  const show = await response.json();

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
      <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Link href="/" passHref>
          <div className="inline-block px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors duration-300">
            ← Back to Home
          </div>
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-center flex-1">{show.name}</h1>
      </div>
      <WatchShowClient show={show} />
    </div>
  );
}