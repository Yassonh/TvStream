import { notFound } from "next/navigation";
import WatchShowClient from "../../components/WatchShowClient";

interface ShowDetails {
  name: string;
  id: number;
  seasons: { id: number; season_number: number; episode_count: number }[];
}

export default async function WatchShow({ params }: { params: { id: string } }) {
  const { id } = params;
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
