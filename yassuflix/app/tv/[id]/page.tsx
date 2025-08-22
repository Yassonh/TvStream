// app/tv/[id]/page.tsx
import { notFound } from "next/navigation";
import WatchShowClient from "../../components/WatchShowClient"; // fixed relative path

interface ShowDetails {
  name: string;
  id: number;
  seasons: {
    id: number;
    season_number: number;
    episode_count: number;
  }[];
}

// params is now a promise
interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchShow({ params }: WatchPageProps) {
  const { id } = await params; // ✅ await params
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!API_KEY) throw new Error("Missing TMDB API key");

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) notFound();

    const show: ShowDetails = await response.json();

    return <WatchShowClient show={show} />;
  } catch {
    notFound();
  }
}
