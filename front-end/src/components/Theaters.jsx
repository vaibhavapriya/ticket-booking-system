import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faParking, faWheelchair } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from 'react-router-dom';

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [currentTheaterIndex, setCurrentTheaterIndex] = useState(0); // Index for current theater
  const currentImageIndex = useRef(0); // Tracks the image index for each theater

  // Load cinema halls from the API
  useEffect(() => {
    const fetchCinemaHalls = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cinemahall");
        setTheaters(response.data);
      } catch (error) {
        console.error("Error fetching cinema halls:", error.message);
      }
    };
    fetchCinemaHalls();
  }, []);

  // Go to the next theater
  const nextTheater = () => {
    if (theaters.length === 0) return;
    setCurrentTheaterIndex((prevIndex) => (prevIndex + 1) % theaters.length);
    currentImageIndex.current = 0; // Reset to the first image when changing theaters
  };

  // Go to the previous theater
  const prevTheater = () => {
    if (theaters.length === 0) return;
    setCurrentTheaterIndex(
      (prevIndex) => (prevIndex - 1 + theaters.length) % theaters.length
    );
    currentImageIndex.current = 0; // Reset to the first image when changing theaters
  };

  // Go to next image in the current theater
  const nextImage = (photos) => {
    if (photos.length === 0) return;
    currentImageIndex.current = (currentImageIndex.current + 1) % photos.length;
  };

  // Go to previous image in the current theater
  const prevImage = (photos) => {
    if (photos.length === 0) return;
    currentImageIndex.current =
      (currentImageIndex.current - 1 + photos.length) % photos.length;
  };

  const currentTheater = theaters[currentTheaterIndex]; // Get the current theater

  return (
    <div className="container mx-auto p-4 w-100">
      <h1 className="text-2xl font-bold mb-4 text-[#db0a5b]">Pick your theater</h1>
      {/* Display only the current theater */}
      {currentTheater && (
        <div className="w-full max-w-full p-4 border rounded-lg shadow-lg">
          {/* Slider Controls */}
          <div className="relative">
            {/* Image Display */}
            <img
              src={
                currentTheater.photos[currentImageIndex.current] ||
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
          <Link to={`/t/${currentTheater.userid}`}><h2 className="text-xl font-semibold mt-4 text-white hover:text-[#db0a5b]">{currentTheater.name}</h2></Link>
          
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

          {/* Navigation between theaters */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prevTheater}
              className="bg-gray-800 text-white p-2 rounded-full"
            >
              Prev Theater
            </button>
            <button
              onClick={nextTheater}
              className="bg-gray-800 text-white p-2 rounded-full"
            >
              Next Theater
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Theaters;
