import Link from "next/link";
import Image from "next/image";
// import Link from "next/navigation";

export default async function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const data = await response.json();
  const movies = data.results ?? [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center p-2">Popular Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <div className="border rounded-lg overflow-hidden">
              <Image
                src={
                  movie?.poster_path && movie.poster_path !== "null"
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/vercel.svg"
                }
                alt={movie?.title ?? "Untitled"}
                width={500}
                height={750}
                className="w-full h-auto"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 200px"
              />
              <p className="p-2 text-center">{movie?.title ?? "Untitled"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
