import React, { useEffect, useState } from "react";


const Movies = () => {
  const theaterId = localStorage.getItem('userid');
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [selectedScreenSeats, setSelectedScreenSeats] = useState("");
  const [showDate, setShowDate] = useState("");
  const [price, setPrice] = useState(0);

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
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/screens/${theaterId}`);
        const data = await response.json();
        setScreens(data);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };

    fetchScreens();
  }, []);

  const handleScheduleShow = async (e) => {
    e.preventDefault();
    console.log(selectedScreenSeats)

    try {
      const response = await fetch("http://localhost:5000/api/movies/show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theaterId: screens.find((screen) => screen._id === selectedScreen)?.theater,
          screenId: selectedScreen,
          movieName: selectedMovie.title,
          tmdbId: selectedMovie.tmdbId,
          movieId: selectedMovie._id,
          showDate,
          price,
          totalSeats: selectedScreenSeats

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
              <label className="block text-lg font-medium text-[#cec3c8] mb-2">
                Select Screen:
              </label>
              <select
                value={selectedScreen}
                onChange={(e) => {
                  const screenId = e.target.value;
                  setSelectedScreen(screenId);

                  // Find the selected screen and update the total seats
                  const selected = screens.find((screen) => screen._id === screenId);
                  setSelectedScreenSeats(selected?.totalSeats || 0);
                }}
                className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
              >
                <option value="">Select a Screen</option>
                {screens.map((screen) => (
                  <option key={screen._id} value={screen._id}>
                    {screen.screenName} - {screen.totalSeats} Seats
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-[#cec3c8] mb-2">
                Select Date & Time:
              </label>
              <input
                type="datetime-local"
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-[#cec3c8] mb-2">
                Price:
              </label>
              <input
                type="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
