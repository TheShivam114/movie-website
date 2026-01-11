import Link from "next/link";
import Image from "next/image";

export default async function MovieDetail({ params }) {
  const { id } = params;

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!API_KEY) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">API Key Missing</h1>
          <p className="text-gray-400 mb-8">
            Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch movie ${id}: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch movie: ${response.status}`);
    }

    const movie = await response.json();

    const posterPath = movie?.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/vercel.svg";
    const backdropPath = movie?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative">
        {backdropPath && (
          <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
            <Image
              src={backdropPath}
              alt={movie.title ?? "Movie backdrop"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="relative container mx-auto px-4 py-8 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            ← Back to Movies
          </Link>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={posterPath}
                    alt={movie.title ?? "Movie poster"}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {movie.title ?? "Untitled"}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl text-gray-400 italic mb-4">
                      {movie.tagline}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {movie.vote_average && (
                    <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold">
                        {movie.vote_average.toFixed(1)}/10
                      </span>
                    </div>
                  )}
                  {movie.release_date && (
                    <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full">
                      <span className="text-blue-400">📅</span>
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
                      <span className="text-purple-400">⏱️</span>
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movie.overview && (
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Overview</h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.overview}
                    </p>
                  </div>
                )}

                <Link href={`/watch/${id}`}>
                  <button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Watch Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-8">
            The movie you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}
