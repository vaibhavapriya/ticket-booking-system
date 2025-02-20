import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import SearchMovie from '../components/SearchMovie';
import Header from '../components/Header'
import Theaters from '../components/Theaters';
import axios from 'axios';

function Website() {
    const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("https://ticket-booking-system-7vpl.onrender.com/api/movies/all");
        const data = await response.data;
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:");
      }
    };
    fetchMovies();
  }, []);
  return (
    <div>
      <Header/>
      <SearchMovie/>
      <Theaters/>
      
      
    {/* Movies Grid */}
    <div className="movies-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div
          key={movie._id}
          className="movie-card bg-[#2d2d2d] p-4 rounded-lg shadow-md my-4"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
            alt={movie.title}
            className="movie-poster w-full h-100 object-cover rounded-lg mb-4 "
          />
          <h2 className="text-xl font-semibold text-[#db0a5b]">{movie.title}</h2>
          <p className="text-sm text-[#cec3c8] my-2">{movie.overview}</p>
          <p className="text-sm text-[#cec3c8]">
            Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
          </p>
          <Link to={`/movie/${movie.tmdbId}`}><button
            className="schedule-btn mt-4 bg-[#db0a5b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition"
          >Detail</button></Link>
          
        </div>
      ))}
    </div>
    </div>
  )
}

export default Website