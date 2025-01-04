import React, {useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Movie() {
    const { tmdbId } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showsAvailable, setShowsAvailable] = useState(false);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const fetchMovieDetails = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=5a0bdd0116118ba6a1778b4f90ce89d6`
          );
          const data = await response.json();
          setMovie(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching movie details:', error);
          setLoading(false);
        }
      };
  
      fetchMovieDetails();
  }, []);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!movie) {
    return <p className="text-white text-center mt-10">Movie not found!</p>;
  }
  return (
    <div>
        <div className="movie-details-page bg-[#1a1a1a] min-h-screen text-white p-6">
      {/* Movie Poster */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full lg:w-1/3 rounded-lg shadow-lg"
        />

        {/* Movie Information */}
        <div className="movie-info lg:w-2/3">
          <h1 className="text-4xl font-bold text-[#db0a5b] mb-4">{movie.title}</h1>
          <p className="text-lg mb-4">
            <span className="font-semibold">Rating:</span> {movie.vote_average} ⭐ ({movie.vote_count} votes)
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold">Release Date:</span>{' '}
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold">Runtime:</span> {movie.runtime} mins
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold">Revenue:</span> $
            {movie.revenue.toLocaleString()}
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold">Genres:</span>{' '}
            {movie.genres.map((genre) => genre.name).join(', ')}
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold">Overview:</span> {movie.overview}
          </p>
          {movie.adult && (
            <p className="text-red-500 font-bold text-lg mt-4">
              ** Adult Only **
            </p>
          )}
          {showsAvailable ? (
            <button className="book-btn mt-4 bg-[#db0a5b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition">
              Book Shows
            </button>
          ) : (
            <p className="text-lg text-[#cec3c8] my-2">No screens available</p>
          )}
        </div>
      </div>
          
        </div>
    </div>
  )
}

export default Movie