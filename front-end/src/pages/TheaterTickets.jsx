import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger, faParking, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";

function TheaterTickets() {
  const { theaterID } = useParams();
  console.log("Theater ID from URL:", theaterID);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [theaterData, setTheaterData] = useState({});
  const [dates, setDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Movie and Theater Data
    const fetchTheaterData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shows/theater/${theaterID}`
        );
        setTheaterData(response.data);  // Assuming you get theater data with shows
      } catch (error) {
        console.error("Error fetching theater data:", error);
      }
    };

    fetchTheaterData();

    // Generate Date Range
    const today = new Date();
    const nextDates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    setDates(nextDates);
  }, [theaterID]);

  const handleDateClick = (date) => setSelectedDate(date);

  // Filter and group shows by movie name
  const getGroupedShows = (theaterData) => {
    if (!theaterData || !theaterData.shows || typeof theaterData.shows !== "object") {
      console.error("Theater data or shows is not an object:", theaterData);
      return {}; // Return an empty object if shows is not an object
    }

    // Iterate through the shows object where keys are movie names
    const filteredShows = Object.keys(theaterData.shows).reduce((acc, movieName) => {
      const showsArray = theaterData.shows[movieName]; // Shows for each movie
      const filteredMovieShows = showsArray.filter((show) => {
        const showDate = new Date(show.showDate);
        return (
          showDate.getDate() === selectedDate.getDate() &&
          showDate.getMonth() === selectedDate.getMonth() &&
          showDate.getFullYear() === selectedDate.getFullYear()
        );
      });

      if (filteredMovieShows.length > 0) {
        acc[movieName] = filteredMovieShows; // Group shows by movie name
      }

      return acc;
    }, {});

    return filteredShows;
  };

  const groupedShows = getGroupedShows(theaterData);

  return (
    <div className="booking-page p-6">
      <Header />
      
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
        {Object.keys(groupedShows).length > 0 ? (
          Object.keys(groupedShows).map((movieName) => (
            <div key={movieName} className="movie-group p-4 border rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#db0a5b] mb-4">{movieName}</h2>
              {groupedShows[movieName].map((show) => {
                const bookedPercentage = (show.bookedSeats.length / show.totalSeats) * 100;
                let bgColor = "bg-[#28a745]";  // Green (Available)
                if (bookedPercentage >= 70) bgColor = "bg-[#dc3545]";  // Red (Limited)
                if (bookedPercentage === 100) bgColor = "bg-[#6c757d]";  // Gray (Full)

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
          ))
        ) : (
          <p>No shows available for the selected date</p>
        )}
      </div>
    </div>
  );
}

export default TheaterTickets;
