import Link from "next/link";
import { notFound } from "next/navigation";
import WatchShowClient from "../../../components/WatchShowClient";

interface WatchPageProps {
  params: {
    id: string;
  };
}

interface ShowDetails {
  name: string;
  id: number;
  seasons: {
    id: number;
    season_number: number;
    episode_count: number;
  }[];
}

export default async function WatchShow({ params }: WatchPageProps) {
  const { id } = params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!API_KEY) {
    throw new Error("Missing TMDB API key");
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      notFound();
    }

    const show: ShowDetails = await response.json();

    return (
      <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
        <div className="w-full max-w-4xl mb-6 flex justify-start">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">
          {show.name}
        </h1>
        <WatchShowClient show={show} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch show:", error);
    notFound();
  }
}
