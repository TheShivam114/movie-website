import Link from "next/link";
import Image from "next/image";

export default async function MovieDetail({ params }) {
  const { id } = params;

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/popular?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const movie = await response.json();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center">{movie.title}</h1>

      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={500}
        height={750}
        className="w-full rounded-lg mt-4 h-auto"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
      />

      <p className="mt-4 text-gray-800">{movie.overview}</p>
      <p className="mt-2 font-semibold">Rating: {movie.vote_average}</p>

      <Link href={`/watch/${id}`}>
        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Watch Now
        </button>
      </Link>
    </div>
  );
}
