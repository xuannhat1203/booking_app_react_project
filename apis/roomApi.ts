import { Hotel, Room } from "@/constants/booking";
import axiosInstance from "@/utils/axiosInstance";

export const getBestHotels = async (): Promise<Hotel[]> => {
    try {
        const response = await axiosInstance.get("/hotels/best");
        const hotels = response.data?.content || response.data?.data || response.data || [];

        return hotels.map((hotel: any) => ({
            id: String(hotel.id || ""),
            name: hotel.name || "Unnamed Hotel",
            location:
                hotel.city && hotel.country
                    ? `${hotel.city}, ${hotel.country}`
                    : hotel.address || "Unknown location",
            price:
                hotel.price ??
                hotel.rooms?.[0]?.price ??
                hotel.rooms?.[0]?.pricePerNight ??
                0,
            rating: Number(hotel.rating) || 0,
            reviewCount:
                hotel.reviewCount ??
                hotel.numberOfReviews ??
                hotel.reviews?.length ??
                0,
            imageUrl:
                hotel.imageUrl ||
                hotel.image_url ||
                hotel.image ||
                hotel.rooms?.[0]?.imageUrl ||
                hotel.rooms?.[0]?.image_url ||
                "",
            isFavorite: Boolean(hotel.isFavorite || hotel.is_favorite),
        }));
    } catch (error: any) {
        if (__DEV__) {
            console.log("API getBestHotels error:", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
        }
        throw error;
    }
};
export const getNearbyRoom = async (): Promise<Room[]> => {
    try {
        const response = await axiosInstance.get('/rooms');
        const rooms: any[] = response?.data?.data ?? [];
        const mappedRooms: Room[] = rooms.map((room: any) => ({
            id: String(room.id || ''),
            roomNumber: room.roomNumber || '',
            type: room.type || '',
            pricePerNight: room.pricePerNight
                ? (typeof room.pricePerNight === 'number'
                    ? room.pricePerNight
                    : parseFloat(String(room.pricePerNight)))
                : 0,
            available: Boolean(room.available ?? true),
            capacity: room.capacity || 0,
            hotelId: String(room.hotelId || ''),
            hotelName: room.hotelName || '',
            imageUrl: room.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        }));
        const shuffled = mappedRooms.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    } catch (error: any) {
        if (__DEV__) {
            console.log('API getNearbyRoom error:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
        }
        throw error;
    }
};
export const filterHotels = async (sortBy: string, minPrice: number, maxPrice: number, address: string): Promise<any[]> => {
    try {
        const response = await axiosInstance.get(`/hotels/filter?sortBy=&minPrice=&maxPrice=&address=`);
        return response?.data?.data ?? [];
    } catch (error: any) {
        if (__DEV__) {
            console.log('API filterHotels error:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
        }
        return [];
    }
};
export const getAllRooms = async () => {
    try {
        const response = await axiosInstance.get('/rooms');
        return response?.data?.data ?? [];
    } catch (error) {
        console.log('API getAllRooms error:', error);
        throw error;
    }
};
export const filterRooms = async (
    sortBy: string,
    minPrice: number,
    maxPrice: number,
    address: string
): Promise<any[]> => {
    try {
        const params = new URLSearchParams();
        if (sortBy) params.append('sortBy', sortBy);
        if (minPrice > 0) params.append('minPrice', String(minPrice));
        if (maxPrice > 0) params.append('maxPrice', String(maxPrice));
        if (address) params.append('address', address);

        const queryString = params.toString();
        const url = `/rooms/filter${queryString ? `?${queryString}` : ''}`;

        const response = await axiosInstance.get(url);
        return response?.data?.data ?? [];
    } catch (error: any) {
        if (__DEV__) {
            console.log('API filterRooms error:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
        }
        return [];
    }
};

export const sortRoomsByPrice = async () => {
    try {
        const response = await axiosInstance.get(`/rooms/filter?sortBy=price_desc`);
        return response?.data?.data ?? [];
    } catch (error) {
        console.log('API sortRoomsByPrice error:', error);
        throw error;
    }
};
export const sortRoomsByRating = async () => {
    try {
        const response = await axiosInstance.get(`/rooms/filter?sortBy=rating_desc`);
        return response?.data?.data ?? [];
    } catch (error) {
        console.log('API sortRoomsByRating error:', error);
        throw error;
    }
};
export const get5bestroom = async () => {
    try {
        const response = await axiosInstance.get('/rooms/best-room');
        return response?.data?.data ?? [];
    } catch (error) {
        console.log('API get5bestroom error:', error);
        throw error;
    }
};
