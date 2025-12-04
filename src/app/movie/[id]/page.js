import Link from "next/link";

export default async function MovieDetail({ params }) {
  const { id } = params;

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    console.error("TMDB API error:", response.status, response.statusText);
    return <h1>Error loading movie</h1>;
  }

  const movie = await response.json();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="mb-4"
      />

      <p>{movie.overview}</p>
      <p className="mt-2 font-semibold">Rating: {movie.vote_average}</p>

      <Link href={`/watch/${id}`}>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Watch Now
        </button>
      </Link>
    </div>
  );
}
