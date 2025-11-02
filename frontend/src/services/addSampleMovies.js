import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sampleMovies = [
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s2bT29y0ngXxxu2IA8AOzzXTRhd.jpg",
    release_date: "2010-07-16",
    genre_ids: [28, 878, 12], // Proper array format
    vote_average: 8.4,
    vote_count: 35000,
    popularity: 100.5,
  },
  {
    title: "The Shawshank Redemption",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop_path: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
    release_date: "1994-09-23",
    genre_ids: [18, 80],
    vote_average: 9.3,
    vote_count: 28000,
    popularity: 95.2,
  },
  {
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
    release_date: "2008-07-18",
    genre_ids: [28, 80, 18, 53],
    vote_average: 9.0,
    vote_count: 30000,
    popularity: 110.3,
  }
];

export const addSampleMovies = async () => {
  try {
    for (const movie of sampleMovies) {
      const movieWithTimestamp = {
        ...movie,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'movies'), movieWithTimestamp);
      console.log(`✅ Added movie: ${movie.title}`);
    }
    console.log('🎉 All sample movies added successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error adding sample movies:', error);
    throw error;
  }
};

// Make it available globally for easy access
if (typeof window !== 'undefined') {
  window.addSampleMovies = addSampleMovies;
}