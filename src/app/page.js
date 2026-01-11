import Link from "next/link";
import Image from "next/image";

async function fetchMovies(category) {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  if (!API_KEY) {
    console.error("NEXT_PUBLIC_TMDB_API_KEY is not set in environment variables");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch ${category}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.results ?? [];
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return [];
  }
}

export default async function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
    fetchMovies("popular"),
    fetchMovies("top_rated"),
    fetchMovies("now_playing"),
    fetchMovies("upcoming"),
  ]);

  const categories = [
    { title: "Popular Movies", movies: popular },
    { title: "Top Rated", movies: topRated },
    { title: "Now Playing", movies: nowPlaying },
    { title: "Upcoming", movies: upcoming },
  ];

  const allEmpty = categories.every(cat => cat.movies.length === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Movie Hub
          </h1>
          <p className="text-gray-400 text-lg">Discover the latest and greatest movies</p>
        </header>

        {allEmpty && (
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">⚠️ API Key Required</h2>
            <p className="text-gray-300 mb-4">
              To use this application, you need to set up your TMDB API key:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4">
              <li>Get your free API key from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">TMDB API Settings</a></li>
              <li>Create a <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code> file in your project root</li>
              <li>Add: <code className="bg-gray-800 px-2 py-1 rounded">NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here</code></li>
              <li>Restart your dev server: <code className="bg-gray-800 px-2 py-1 rounded">npm run dev</code></li>
            </ol>
            <p className="text-sm text-gray-400">
              The API key is free and takes just a few minutes to set up.
            </p>
          </div>
        )}

        {categories.map((category) => (
          <section key={category.title} className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></span>
              {category.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {category.movies.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <p>No movies available in this category.</p>
                </div>
              ) : (
                category.movies.map((movie) => {
                const posterPath = movie?.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/vercel.svg";
                const title = movie?.title ?? "Untitled";
                const rating = movie?.vote_average?.toFixed(1) ?? "N/A";

                return (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={posterPath}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-yellow-400">
                          ⭐ {rating}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {title}
                        </h3>
                        {movie?.release_date && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              }))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
