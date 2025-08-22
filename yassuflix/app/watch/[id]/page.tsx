import Link from "next/link";

export default async function WatchMovie({ params }) {
  const { id } = await params;
  const embedUrl = `https://vidsrc.to/embed/movie/${id}`;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = await response.json();

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
}