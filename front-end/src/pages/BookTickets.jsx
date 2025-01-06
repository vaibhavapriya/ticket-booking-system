import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger, faParking, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";

function BookTickets() {
  const { tmdbId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState(null);
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/shows/${tmdbId}`
        );
        setMovie(response.data.movie);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovie();

    const today = new Date();
    const nextDates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(nextDates);
  }, [tmdbId]);

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
    <div className="booking-page p-6">
      <Header />
      <div>
      <h1 className="text-3xl font-bold text-[#db0a5b] p-4">
        { movie?.theaters?.[0]?.shows?.[0]?.movieName || ""}
      </h1>
      </div>
      

      {/* Date Selector */}
      <div className="date-selector flex overflow-x-auto mb-8">
        {dates.map((date, idx) => (
          <button
            key={idx}
            className={`date-button px-4 py-2 rounded mx-2 ${
              date.toDateString() === selectedDate.toDateString()
                ? "bg-[#db0a5b] text-white"
                : "bg-[#f1f1f1] text-black"
            }`}
            onClick={() => handleDateClick(date)}
          >
            {date.toDateString()}
          </button>
        ))}
      </div>

      {/* Theater and Show Info */}
      <div className="theater-info grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredTheaters && filteredTheaters.length > 0 ? (
          filteredTheaters.map((theater) => (
            <div
              key={theater._id}
              className="theater-card p-4 border rounded-lg shadow-md"
            >
              {/* Theater Details */}
              <div className="theater-header flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#333]">
                    {theater.name}
                  </h3>
                  <p className="text-sm text-[#777]">{theater.address}</p>
                  <p className="text-sm text-[#777]">{theater.city}</p>
                </div>
                <div className="icons flex space-x-3">
                  {theater.food && (
                    <FontAwesomeIcon
                      icon={faHamburger}
                      className="text-[#db0a5b]"
                    />
                  )}
                  {theater.parking && (
                    <FontAwesomeIcon
                      icon={faParking}
                      className="text-[#db0a5b]"
                    />
                  )}
                  {theater.handicapFacility && (
                    <FontAwesomeIcon
                      icon={faWheelchair}
                      className="text-[#db0a5b]"
                    />
                  )}
                </div>
              </div>

              {/* Show Times */}
              <div className="shows flex flex-wrap">
                {theater.shows
                  ?.filter(
                    (show) =>
                      new Date(show.showDate).toDateString() ===
                      selectedDate.toDateString()
                  )
                  .map((show) => {
                    const bookedPercentage =
                      (show.bookedSeats.length / show.totalSeats) * 100;
                    let bgColor = "bg-[#28a745]";
                    if (bookedPercentage >= 70) bgColor = "bg-[#dc3545]";
                    if (bookedPercentage === 100) bgColor = "bg-[#6c757d]";

                    return (
                      <div
                        key={show._id}
                        onClick={() => navigate(`/book-seats/${show._id}`)}
                        className={`${bgColor} text-white px-4 py-2 m-2 rounded cursor-pointer`}
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
