import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger, faParking, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons"; // For food icon
import Header from "../components/Header";

function TheaterTickets() {
  const { theaterID } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [theaterData, setTheaterData] = useState({});
  const [dates, setDates] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const currentTheater = theaterData.theater || {};  // Access the theater data
  
  useEffect(() => {
    // Fetch Movie and Theater Data
    const fetchTheaterData = async () => {
      try {
        const response = await axios.get(
          `https://ticket-booking-system-7vpl.onrender.com/api/shows/theater/${theaterID}`
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

  // Slider Controls
  const prevImage = (photos) => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const nextImage = (photos) => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

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
      
      {/* Slider Image */}
      <div className="w-full max-w-full p-4 border rounded-lg shadow-lg">
        <div className="relative">
          <img
            src={
              currentTheater.photos?.[currentImageIndex] ||
              "https://plus.unsplash.com/premium_photo-1709594070896-fc3869d4dcd6?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={`${currentTheater.name} Image`}
            className="h-64 w-full object-cover rounded-lg"
          />
          <div className="absolute top-1/2 left-0 right-0 flex justify-between">
            <button
              onClick={() => prevImage(currentTheater.photos)}
              className="bg-gray-800 text-white p-2 rounded-full"
            >
              Prev Image
            </button>
            <button
              onClick={() => nextImage(currentTheater.photos)}
              className="bg-gray-800 text-white p-2 rounded-full"
            >
              Next Image
            </button>
          </div>
        </div>
        <Link to={`/t/${currentTheater.userid}`} className="text-[#db0a5b] mt-4 inline-block">
          About
        </Link>
        <p>{currentTheater.userid}</p>
        <h2 className="text-xl font-semibold mt-4 text-white">{currentTheater.name}</h2>
        <p className="text-white text-gray-600">{currentTheater.city}</p>
        <p className="text-white text-gray-600">{currentTheater.address}</p>
        <div className="flex items-center gap-4 mt-4">
          {/* FontAwesome Icons with white color */}
          {currentTheater.food && (
            <FontAwesomeIcon icon={faUtensils} title="Food Available" className="text-white text-xl" />
          )}
          {currentTheater.parking && (
            <FontAwesomeIcon icon={faParking} title="Parking Available" className="text-white text-xl" />
          )}
          {currentTheater.handicapFacility && (
            <FontAwesomeIcon icon={faWheelchair} title="Handicap Facility" className="text-white text-xl" />
          )}
        </div>
      </div>

      {/* Date Selector */}
      <div className="date-selector flex overflow-x-auto mb-8 my-6">
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
