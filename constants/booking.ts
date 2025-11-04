export const BOOKING_COLORS = {
  PRIMARY: '#6C7CE7',
  BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6B7280',
  BORDER: '#E5E7EB',
  CARD_BACKGROUND: '#F9FAFB',
  RATING: '#FFB800',
  PRICE: '#6C7CE7',
  HEART: '#EF4444',
} as const;

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isFavorite?: boolean;
}

export interface City {
  id: string;
  name: string;
  imageUrl: string;
}

export const CITIES: City[] = [
  { id: '1', name: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200' },
  { id: '2', name: 'Goa', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200' },
  { id: '3', name: 'Chennai', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200' },
  { id: '4', name: 'Jaipur', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200' },
  { id: '5', name: 'Pune', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=200' },
] as const;

export const BEST_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Malon Greens',
    location: 'Mumbai, Maharashtra',
    price: 120,
    rating: 5.0,
    reviewCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Fortune Lan',
    location: 'Goa, Maharashtra',
    price: 150,
    rating: 5.0,
    reviewCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    isFavorite: false,
  },
] as const;

export const NEARBY_HOTELS: Hotel[] = [
  {
    id: '3',
    name: 'Malon Greens',
    location: 'Mumbai, Maharashtra',
    price: 110,
    rating: 4.0,
    reviewCount: 80,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Sobro Prime',
    location: 'Mumbai, Maharashtra',
    price: 90,
    rating: 5.0,
    reviewCount: 75,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    isFavorite: false,
  },
] as const;

