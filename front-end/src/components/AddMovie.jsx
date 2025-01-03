import React, { useState } from 'react';
import axios from 'axios';
  
const AddMovie = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
  
    // TMDB API Key
    const apiKey = 'YOUR_TMDB_API_KEY';
    
    // Handle search input change
    const handleSearchChange = async (e) => {
      const term = e.target.value;
      setSearchTerm(term);
  
      if (term.trim() === '') {
        setMovies([]);
        return;
      }
  
      setLoading(true);
  
      try {
        // Make a request to the TMDB API
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: '5a0bdd0116118ba6a1778b4f90ce89d6',
                query: term,
                language: 'en-US',
                page: 1,
              }, 
        });
  
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movie data from TMDB:', error);
      } finally {
        setLoading(false);
      }
};
  
    // Handle adding a movie to the backend
const handleAddMovie = async (movie) => {
    try {
        const movieData = {
          title: movie.title,
          poster: movie.poster_path,
          releaseDate: movie.release_date,
          overview: movie.overview,
        };
  
        // Send movie details to your backend to store in the movie database
        await axios.post('http://localhost:5000/api/client/movies', movieData);
        alert('Movie added successfully!');
    } catch (error) {
        console.error('Error adding movie to database:', error);
        alert('Error adding movie!');
    }
};
  
    // Render movies as cards
const renderMovieCards = () => {
    return movies.map((movie) => (
        <div key={movie.id} className="max-w-sm rounded overflow-hidden shadow-lg p-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-72 object-cover"
          />
          <div className="py-2">
            <h3 className="font-bold text-xl">{movie.title}</h3>
            <p className="text-sm text-gray-500">{movie.release_date}</p>
            <p className="text-sm mt-2">{movie.overview.substring(0, 100)}...</p>
          </div>
          <button
            onClick={() => handleAddMovie(movie)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Movie
          </button>
        </div>
    ));
};
  
return (
      <div className="p-4">
        <h2 className="text-2xl mb-4">Search for Movies</h2>
        
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a movie..."
        />
  
        {loading && <p>Loading...</p>}
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderMovieCards()}
        </div>
      </div>
);
};
  
  export default AddMovie;
  