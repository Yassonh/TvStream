// app/movie/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

interface MoviePageProps {
  params: Promise<{ id: string }>; // ✅ params is a promise
}

interface MovieDetails {
  title: string;
}

export default async function MovieDetails({ params }: MoviePageProps) {
  const { id } = await params; // ✅ await params
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!API_KEY) throw new Error("Missing TMDB API key");

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) notFound();

    const movie: MovieDetails = await response.json();
    const embedUrl = `https://vidsrc.to/embed/movie/${id}`;

    return (
      <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white">
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 mb-6"
        >
          ← Back to Home
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">{movie.title}</h1>
        <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full border-none"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
