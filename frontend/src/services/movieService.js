import { 
  getPopularMovies, 
  searchMovies as omdbSearchMovies, 
  getMovieDetails as omdbGetMovieDetails 
} from './omdbService';

// Import your Firestore dependencies (remove unused orderBy)
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment
} from 'firebase/firestore';

// Use OMDb API for movie data
export const getAllMovies = async () => {
  try {
    console.log('🔄 Fetching popular movies from OMDb API...');
    const movies = await getPopularMovies();
    console.log(`🎉 Loaded ${movies.length} movies from OMDb`);
    return movies;
  } catch (error) {
    console.error('❌ Error fetching movies from OMDb:', error);
    // Fallback to empty array
    return [];
  }
};

// Use OMDb API for search
export const searchMovies = async (searchTerm) => {
  try {
    console.log('🔍 Searching OMDb for:', searchTerm);
    
    if (!searchTerm || !searchTerm.trim()) {
      return [];
    }
    
    const results = await omdbSearchMovies(searchTerm);
    console.log(`✅ OMDb search found ${results.length} results for "${searchTerm}"`);
    return results;
  } catch (error) {
    console.error('❌ Error searching OMDb:', error);
    return [];
  }
};

// Use OMDb API for movie details
export const getMovie = async (movieId) => {
  try {
    console.log('🔄 Fetching movie details from OMDb for ID:', movieId);
    const movie = await omdbGetMovieDetails(movieId);
    
    if (!movie) {
      console.log('❌ Movie not found in OMDb:', movieId);
      return null;
    }
    
    console.log('✅ OMDb movie details loaded:', movie.title);
    return movie;
  } catch (error) {
    console.error('❌ Error fetching movie from OMDb:', error);
    return null;
  }
};

// Keep your existing Firestore functions for reviews
export const getMovieReviews = async (movieId) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    // Manual sorting (since we removed orderBy import)
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    
    console.log(`📝 Found ${reviews.length} reviews for movie ${movieId}`);
    return reviews;
  } catch (error) {
    console.error('Error getting reviews: ', error);
    return [];
  }
};

// Add a review - UPDATED to handle OMDb movie IDs
export const addReview = async (reviewData) => {
  try {
    console.log('📝 Adding review for OMDb movie:', reviewData.movieId);
    
    const reviewWithTimestamp = {
      ...reviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'reviews'), reviewWithTimestamp);
    console.log('✅ Review added with ID:', docRef.id);
    
    // Update user's review count
    try {
      const userRef = doc(db, 'users', reviewData.userId);
      await updateDoc(userRef, {
        reviewCount: increment(1),
        lastActivityAt: serverTimestamp()
      });
      console.log('✅ User review count updated');
    } catch (userError) {
      console.warn('⚠️ Could not update user review count:', userError);
    }
    
    return { id: docRef.id, ...reviewData };
  } catch (error) {
    console.error('❌ Error adding review: ', error);
    throw error;
  }
};

// Keep your other review functions (they should work the same)
export const updateReview = async (reviewId, updatedData) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Review updated successfully');
  } catch (error) {
    console.error('❌ Error updating review: ', error);
    throw error;
  }
};

export const deleteReview = async (reviewId, userId) => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        reviewCount: increment(-1)
      });
    } catch (userError) {
      console.warn('⚠️ Could not update user review count:', userError);
    }
    
    console.log('✅ Review deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting review: ', error);
    throw error;
  }
};

// Keep your user functions
export const getUserReviews = async (userId) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting user reviews: ', error);
    return [];
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile: ', error);
    return null;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile: ', error);
    throw error;
  }
};