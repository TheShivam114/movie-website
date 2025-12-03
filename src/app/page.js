// "use client"
import axios from "axios";
import Link from "next/navigation";
export default async function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await axios.get(
    // `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    // `https://jsonfakery.com/movies/paginated`
  );
console.log(response.data);
  // const movies  = response.data;


  return (
    <div>
      <h1>Popular Movies</h1>
      <div>
        {movies.map((movie)=>(
          <Link key={movie.id} href={`/movie/${movie.id}`}
          className="block">
            <div>
              {/* <img src="{movie.poster_path}" */}
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
}
