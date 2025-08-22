import Image from "next/image";
import Link from "next/link";

export default async function ShowDetails({ params }) {
  const { id } = await params;
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
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-10">
      <div className="mb-6">
        <Link href="/" passHref>
          <div className="inline-block px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition-colors duration-300">
            ← Back to Home
          </div>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="relative w-full lg:w-1/3 max-w-sm rounded-xl overflow-hidden shadow-lg">
          <Image
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            width={500}
            height={750}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
        </div>
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            {show.name}
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            {show.first_air_date ? new Date(show.first_air_date).getFullYear() : "N/A"} | ⭐{" "}
            {show.vote_average ? show.vote_average.toFixed(1) : "N/A"} / 10
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {show.overview}
          </p>
          <Link href={`/watch/tv/${id}`} passHref>
            <div className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 cursor-pointer">
              Watch Now
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}