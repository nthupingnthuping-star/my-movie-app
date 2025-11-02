import axios from 'axios';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Create axios instance for TMDB API
const tmdbAPI = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// TMDB API functions
export const movieAPI = {
  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbAPI.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbAPI.get('/search/movie', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await tmdbAPI.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get movie credits
  getMovieCredits: async (movieId) => {
    try {
      const response = await tmdbAPI.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  },

  // Get similar movies
  getSimilarMovies: async (movieId) => {
    try {
      const response = await tmdbAPI.get(`/movie/${movieId}/similar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw error;
    }
  }
};

// Backend API functions (for your Node.js backend)
const backendAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

export const backend = {
  // User authentication
  login: async (credentials) => {
    const response = await backendAPI.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await backendAPI.post('/auth/register', userData);
    return response.data;
  },

  // Reviews
  createReview: async (reviewData) => {
    const response = await backendAPI.post('/reviews', reviewData);
    return response.data;
  },

  getReviews: async (movieId) => {
    const response = await backendAPI.get(`/reviews/movie/${movieId}`);
    return response.data;
  }
};

export default tmdbAPI;