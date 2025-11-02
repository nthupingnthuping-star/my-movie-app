const OMDB_API_KEY = 'f4c815f9'; // Replace with your OMDb API key
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Search movies by title
export const searchMovies = async (searchTerm, page = 1) => {
  try {
    console.log('🔍 Searching OMDb for:', searchTerm);
    
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}&type=movie`
    );
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.log('❌ OMDb search failed:', data.Error);
      return [];
    }
    
    console.log(`✅ OMDb found ${data.Search.length} results for "${searchTerm}"`);
    
    // Fetch detailed info for each movie
    const detailedMovies = await Promise.all(
      data.Search.map(movie => getMovieDetails(movie.imdbID))
    );
    
    return detailedMovies.filter(movie => movie !== null);
  } catch (error) {
    console.error('❌ Error searching OMDb:', error);
    return [];
  }
};

// Get movie details by IMDb ID
export const getMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`
    );
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.log('❌ OMDb details failed:', data.Error);
      return null;
    }
    
    return formatMovieData(data);
  } catch (error) {
    console.error('❌ Error fetching movie details from OMDb:', error);
    return null;
  }
};

// Get popular movies (OMDb doesn't have popular endpoint, so we'll search common terms)
export const getPopularMovies = async () => {
  const popularTerms = ['avengers', 'star wars', 'marvel', 'batman', 'superman', 'spider'];
  
  try {
    // Get one movie from each popular search to create a diverse list
    const allMovies = [];
    
    for (const term of popularTerms) {
      try {
        const movies = await searchMovies(term, 1);
        if (movies.length > 0) {
          // Add first movie from each search
          allMovies.push(movies[0]);
        }
      } catch (error) {
        console.log(`Skipping term "${term}" due to error:`, error);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`🎉 Loaded ${allMovies.length} popular movies from OMDb`);
    return allMovies;
  } catch (error) {
    console.error('❌ Error fetching popular movies:', error);
    return [];
  }
};

// Format OMDb data to match your app's structure
const formatMovieData = (movie) => {
  // Convert OMDb rating to number
  const voteAverage = movie.imdbRating && movie.imdbRating !== 'N/A' 
    ? parseFloat(movie.imdbRating) 
    : 0;
  
  // Convert votes to number
  const voteCount = movie.imdbVotes && movie.imdbVotes !== 'N/A'
    ? parseInt(movie.imdbVotes.replace(/,/g, ''))
    : 0;
  
  // Parse genres to array
  const genreIds = movie.Genre && movie.Genre !== 'N/A'
    ? movie.Genre.split(',').map(genre => genre.trim())
    : [];
  
  return {
    id: movie.imdbID, // Use IMDb ID as unique identifier
    title: movie.Title || 'Unknown Title',
    overview: movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No description available.',
    poster_path: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg',
    backdrop_path: null, // OMDb doesn't provide backdrop images
    release_date: movie.Released && movie.Released !== 'N/A' ? movie.Released : 'Unknown',
    vote_average: voteAverage,
    vote_count: voteCount,
    popularity: voteCount, // Use vote count as popularity proxy
    genre_ids: genreIds,
    // Additional OMDb data
    runtime: movie.Runtime,
    director: movie.Director,
    actors: movie.Actors,
    year: movie.Year,
    rated: movie.Rated,
    imdbID: movie.imdbID
  };
};

// Get movies by year range
export const getMoviesByYear = async (year, page = 1) => {
  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&y=${year}&page=${page}&type=movie`
    );
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      return [];
    }
    
    // Fetch detailed info for each movie
    const detailedMovies = await Promise.all(
      data.Search.map(movie => getMovieDetails(movie.imdbID))
    );
    
    return detailedMovies.filter(movie => movie !== null);
  } catch (error) {
    console.error('❌ Error fetching movies by year:', error);
    return [];
  }
};