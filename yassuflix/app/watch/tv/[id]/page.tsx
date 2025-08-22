// Import necessary modules from Next.js
import Link from "next/link";
import { notFound } from "next/navigation";
// Import the client component that will render the video player
import WatchShowClient from "../../../components/WatchShowClient";

// Define the type for the params object to fix the TypeScript error
interface WatchPageProps {
  params: {
    id: string;
  };
}

// Define the type for the show details object
interface ShowDetails {
  name: string;
  id: number;
  seasons: {
    id: number;
    season_number: number;
    episode_count: number;
  }[];
}

// The main component for the TV show watching page.
// This is a server component, responsible for data fetching.
export default async function WatchShow({ params }: WatchPageProps) {
  const { id } = params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    // If the response is not ok, show a 404 page
    if (!response.ok) {
      notFound();
    }

    const show: ShowDetails = await response.json();

    return (
      <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
        <div className="w-full max-w-4xl mb-6 flex justify-start">
          <Link href="/" passHref>
            <div className="inline-block px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors duration-300">
              ← Back to Home
            </div>
          </Link>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">{show.name}</h1>
        {/* Pass the fetched show data to the client component */}
        <WatchShowClient show={show} />
      </div>
    );
  } catch (error) {
    // Catch any network or parsing errors and show a 404 page.
    notFound();
  }
}
