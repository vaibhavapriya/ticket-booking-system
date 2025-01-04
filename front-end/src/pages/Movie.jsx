import React from 'react'

function Movie() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showsAvailable, setShowsAvailable] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
        try {
            const response = await fetch(
              `http://localhost:5000/api/movies/details/${tmdbId}`
            );
            const data = await response.json();
      
            setSelectedMovie(data);
            setShowsAvailable(data.shows && data.shows.length > 0); // Check if shows are available
          } catch (error) {
            console.error("Error fetching movie details:", error);
          }
    };
    fetchMovie();
  }, []);
  return (
    <div>
        <div className="movie-details bg-[#1a1a1a] p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold text-[#db0a5b]">
            {selectedMovie.title}
          </h2>
          <p className="text-sm text-[#cec3c8] my-2">
            {selectedMovie.overview}
          </p>
          {showsAvailable ? (
            <button className="book-btn mt-4 bg-[#db0a5b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition">
              Book Shows
            </button>
          ) : (
            <p className="text-sm text-[#cec3c8] my-2">No screens available</p>
          )}
        </div>
    </div>
  )
}

export default Movie