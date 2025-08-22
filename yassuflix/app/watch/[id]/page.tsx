// Import necessary modules from Next.js
import Link from "next/link";
import { notFound } from "next/navigation";

// Define the type for the params object to fix the TypeScript error
interface WatchPageProps {
  params: {
    id: string;
  };
}

// Define the type for the movie details object
interface MovieDetails {
  title: string;
}

// The main component for the movie watching page.
export default async function WatchMovie({ params }: WatchPageProps) {
  // Destructure the id from the typed params object.
  const { id } = params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const embedUrl = `https://vidsrc.to/embed/movie/${id}`;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    // If the response is not ok, show a 404 page
    if (!response.ok) {
      notFound();
    }

    const movie: MovieDetails = await response.json();

    return (
      <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
        <div className="w-full max-w-4xl mb-6 flex justify-start">
          <Link href="/" passHref>
            <div className="inline-block px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors duration-300">
              ← Back to Home
            </div>
          </Link>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">{movie.title}</h1>
        <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
          <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Catch any network or parsing errors and show a 404 page.
    notFound();
  }
}
