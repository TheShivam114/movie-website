export default async function watchMovie({ params }) {
  const { id } = params;
  const embedUrl = `https://vidsrc.icu/embed/movie/${id}`;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  const movie = await response.json();
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
      <div className="w-full max-w-4xl">
        <iframe
          src={embedUrl}
          className="w-full h-[500px] border-none rounded-lg"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}