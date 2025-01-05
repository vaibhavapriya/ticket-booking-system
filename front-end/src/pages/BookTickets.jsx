import React, { useState, useEffect } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import axios from "axios";

function BookTickets() {
  const { tmdbId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState({}); // Default empty array for theaters
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  // const handleClickSeat = () => {
  //   navigate(`/book-seats/${show._id}`); // Navigate to seat booking page
  // };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/shows/${tmdbId}`
        );
        setMovie(response.data.movie); // Update state with movie object
        console.log("API Response:", response.data.movie);
        console.log("movie:",movie)
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
  
    fetchMovie();
    console.log(movie)
  
    const today = new Date();
    const nextDates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(nextDates);
  }, [tmdbId]);

  useEffect(() => {
    console.log("Updated movie data:", movie);
  }, [movie]);

  const handleDateClick = (date) => setSelectedDate(date);

  const filteredTheaters = movie?.theaters?.filter((theater) =>
    theater.shows?.some((show) => {
      const showDate = new Date(show.showDate);
      return (
        showDate.getDate() === selectedDate.getDate() &&
        showDate.getMonth() === selectedDate.getMonth() &&
        showDate.getFullYear() === selectedDate.getFullYear()
      );
    })
  );
  

  return (
    <div className="booking-page">
            {movie && (
        <div>
          {/* Movie title and overview */}
          <h1>{movie.title}</h1>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
            alt={movie.title}
            className="w-1/3"
          />
          <p>{movie.overview}</p>
        </div>
      )}
      {/* Date Selector */}
      <div className="date-selector flex items-center space-x-4 overflow-x-auto">
        {dates.map((date, idx) => (
          <button
            key={idx}
            className={`date-button ${
              date.toDateString() === selectedDate.toDateString()
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } px-4 py-2 rounded`}
            onClick={() => handleDateClick(date)}
          >
            {date.toDateString()}
          </button>
        ))}
      </div>

      {/* Theater and Show Info */}
      <div className="theater-info mt-8">
        {filteredTheaters && filteredTheaters.length > 0 ? (
          filteredTheaters.map((theater) => (
            <div
              key={theater._id}
              className="theater-card p-4 border rounded mb-4"
            >
              {/* Theater Details */}
              <div className="theater-header flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{theater.name}</h3>
                  <p className="text-sm text-gray-500">{theater.address}</p>
                  <p className="text-sm text-gray-500">{theater.city}</p>
                </div>
                <div className="icons flex space-x-2">
                  {theater.food && <span>🍔</span>}
                  {theater.parking && <span>🅿️</span>}
                  {theater.handicapFacility && <span>♿</span>}
                </div>
              </div>

              {/* Show Details */}
              <div className="shows mt-4 flex flex-wrap">
                {theater.shows
                  .filter(
                    (show) =>
                      new Date(show.showDate).toDateString() ===
                      selectedDate.toDateString()
                  )
                  .map((show) => {
                    const bookedPercentage =
                      (show.bookedSeats.length / show.totalSeats) * 100;
                    let bgColor = "bg-green-500";
                    if (bookedPercentage >= 70) bgColor = "bg-red-500";
                    if (bookedPercentage === 100) bgColor = "bg-gray-500";

                    return (
                      <div
                        key={show._id} onClick={() => navigate(`/book-seats/${show._id}`)}
                        className={`show-time ${bgColor} text-white px-4 py-2 m-2 rounded cursor-pointer`}
                      >
                        {new Date(show.showDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        ) : (
          <p>No theaters available for the selected date</p>
        )}
      </div>
    </div>
  );
}

export default BookTickets;
