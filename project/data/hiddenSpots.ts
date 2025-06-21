import { HiddenSpot } from '@/types/spots';

export const hiddenSpots: HiddenSpot[] = [
  {
    id: '1',
    name: 'Sunset Point at Gopachal Hill',
    description: 'A romantic hillside spot offering breathtaking sunset views over Gwalior city with ancient rock-cut sculptures nearby.',
    latitude: 26.2183,
    longitude: 78.1828,
    vibe: 'Romantic',
    images: [
      'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770810.jpeg'
    ],
    stories: [
      'Perfect spot for couples to watch the city lights come alive as the sun sets.',
      'The ancient Jain sculptures add a mystical charm to the romantic atmosphere.'
    ],
    ratings: {
      uniqueness: 4.5,
      vibe: 4.8,
      safety: 4.2,
      crowdLevel: 2.5
    },
    averageRating: 4.0,
    reviews: [
      {
        id: '1',
        userName: 'Priya_Explorer',
        rating: 5,
        comment: 'Most romantic spot in Gwalior! Perfect for evening dates.',
        date: '2024-01-15'
      }
    ],
    crowdLevel: 'Low',
    safetyLevel: 'High',
    discoveredBy: 'Rahul Sharma',
    discoveredDate: '2023-12-10'
  },
  {
    id: '2',
    name: 'Peaceful Gardens of Jai Vilas Palace',
    description: 'Hidden serene gardens behind the main palace complex, perfect for meditation and quiet contemplation.',
    latitude: 26.2235,
    longitude: 78.1649,
    vibe: 'Serene',
    images: [
      'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg',
      'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg'
    ],
    stories: [
      'A hidden oasis where you can escape the city noise and find inner peace.',
      'Morning birds chirping and flowering plants create a therapeutic environment.'
    ],
    ratings: {
      uniqueness: 4.2,
      vibe: 4.9,
      safety: 4.7,
      crowdLevel: 1.8
    },
    averageRating: 4.4,
    reviews: [
      {
        id: '2',
        userName: 'Meditation_Seeker',
        rating: 5,
        comment: 'Perfect for morning meditation. So peaceful and beautiful!',
        date: '2024-01-20'
      }
    ],
    crowdLevel: 'Low',
    safetyLevel: 'High',
    discoveredBy: 'Anita Gupta',
    discoveredDate: '2023-11-25'
  },
  {
    id: '3',
    name: 'Street Art Alley near Patankar Bazaar',
    description: 'A vibrant narrow alley filled with local street art and murals showcasing Gwalior\'s creative spirit.',
    latitude: 26.2124,
    longitude: 78.1773,
    vibe: 'Creative',
    images: [
      'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg',
      'https://images.pexels.com/photos/1070527/pexels-photo-1070527.jpeg'
    ],
    stories: [
      'Local artists come here to express their creativity on the walls.',
      'Each wall tells a different story about Gwalior\'s culture and traditions.'
    ],
    ratings: {
      uniqueness: 4.7,
      vibe: 4.6,
      safety: 3.8,
      crowdLevel: 3.2
    },
    averageRating: 4.1,
    reviews: [
      {
        id: '3',
        userName: 'Art_Lover_23',
        rating: 4,
        comment: 'Amazing street art! A must-visit for art enthusiasts.',
        date: '2024-01-18'
      }
    ],
    crowdLevel: 'Medium',
    safetyLevel: 'Medium',
    discoveredBy: 'Arjun Malhotra',
    discoveredDate: '2023-12-05'
  },
  {
    id: '4',
    name: 'Traditional Pottery Workshop in Old City',
    description: 'A hidden gem where master potters still practice ancient ceramic arts, offering glimpses into Gwalior\'s artistic heritage.',
    latitude: 26.2098,
    longitude: 78.1892,
    vibe: 'Artistic',
    images: [
      'https://images.pexels.com/photos/1004554/pexels-photo-1004554.jpeg',
      'https://images.pexels.com/photos/1139317/pexels-photo-1139317.jpeg',
      'https://images.pexels.com/photos/2265824/pexels-photo-2265824.jpeg'
    ],
    stories: [
      'Watch master craftsmen create beautiful pottery using techniques passed down for generations.',
      'You can try your hand at pottery and create your own souvenir to take home.'
    ],
    ratings: {
      uniqueness: 4.8,
      vibe: 4.4,
      safety: 4.1,
      crowdLevel: 2.2
    },
    averageRating: 4.4,
    reviews: [
      {
        id: '4',
        userName: 'Culture_Enthusiast',
        rating: 5,
        comment: 'Incredible experience learning about traditional pottery!',
        date: '2024-01-22'
      }
    ],
    crowdLevel: 'Low',
    safetyLevel: 'High',
    discoveredBy: 'Meera Jain',
    discoveredDate: '2023-11-30'
  },
 
];