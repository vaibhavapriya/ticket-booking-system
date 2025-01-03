import React, { useEffect, useState } from "react";


const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTime, setShowTime] = useState("");
  const [screenName, setScreenName] = useState("");
  const [seatLayout, setSeatLayout] = useState("");

  // Fetch movies from the backend
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies/all");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Handle scheduling a show
  const handleScheduleShow = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/scheduleShow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieName: selectedMovie.name,
          showTime,
          screenName,
          seatLayout: seatLayout.split(","),
        }),
      });

      if (response.ok) {
        alert("Show scheduled successfully!");
        setShowForm(false);
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error scheduling show:", error);
      alert("Error scheduling show");
    }
  };

  return (
    <div className="movies-container bg-[#1a1a1a] text-[#cec3c8] min-h-screen p-6">
    <h1 className="text-3xl font-bold text-[#db0a5b] mb-8">Movies</h1>

    {/* Movies Grid */}
    <div className="movies-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div
          key={movie._id}
          className="movie-card bg-[#2d2d2d] p-4 rounded-lg shadow-md"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
            alt={movie.title}
            className="movie-poster w-full h-64 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold text-[#db0a5b]">{movie.title}</h2>
          <p className="text-sm text-[#cec3c8] my-2">{movie.overview}</p>
          <p className="text-sm text-[#cec3c8]">
            Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
          </p>
          <button
            onClick={() => {
              setSelectedMovie(movie);
              setShowForm(true);
            }}
            className="schedule-btn mt-4 bg-[#db0a5b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition"
          >
            Schedule Show
          </button>
        </div>
      ))}
    </div>

    {/* Schedule Show Form */}
    {showForm && selectedMovie && (
      <div className="schedule-form bg-[#2d2d2d] p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold text-[#db0a5b]">
          Schedule Show for {selectedMovie.title}
        </h2>
        <form onSubmit={handleScheduleShow} className="mt-4">
          <div className="mb-4">
            <label className="block text-lg font-medium text-[#cec3c8] mb-2">Show Time:</label>
            <input
              type="datetime-local"
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-[#cec3c8] mb-2">Screen Name:</label>
            <input
              type="text"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              placeholder="Enter Screen Name"
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-[#cec3c8] mb-2">Seat Layout (Comma Separated):</label>
            <input
              type="text"
              value={seatLayout}
              onChange={(e) => setSeatLayout(e.target.value)}
              placeholder="e.g., A1,A2,A3"
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
            >
              Schedule Show
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="ml-4 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
  );
};

export default Movies;
