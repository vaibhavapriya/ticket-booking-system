import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function BookTickets() {
    const { tmdbId } = useParams();
      useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(
                  `http://localhost:5000/api/movies/shows/${tmdbId}`
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
{/*     
    <div className="theater-details mt-10">
    <h2 className="text-2xl font-bold text-[#db0a5b] mb-4">Theater Information</h2>
    <p><strong>Name:</strong> {theaterDetails.name}</p>
    <p><strong>Location:</strong> {theaterDetails.city}, {theaterDetails.address}</p>
    <div className="flex gap-4">
        <p>
        {theaterDetails.parking && <i className="fas fa-parking"></i>} Parking Available
        </p>
        <p>
        {theaterDetails.food && <i className="fas fa-utensils"></i>} Food Available
        </p>
        <p>
        {theaterDetails.handicapFacility && <i className="fas fa-wheelchair"></i>} Handicap Facility
        </p>
    </div>
    </div> */}

    </div>
  )
}

export default BookTickets