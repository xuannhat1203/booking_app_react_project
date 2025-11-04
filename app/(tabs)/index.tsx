import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/components/booking/search-bar';
import { CityButton } from '@/components/booking/city-button';
import { HotelCard } from '@/components/booking/hotel-card';
import { BOOKING_COLORS, CITIES, BEST_HOTELS, NEARBY_HOTELS, Hotel } from '@/constants/booking';

export default function HomeScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bestHotels, setBestHotels] = useState<Hotel[]>(BEST_HOTELS);
  const [nearbyHotels, setNearbyHotels] = useState<Hotel[]>(NEARBY_HOTELS);

  const toggleFavorite = (hotelId: string, list: Hotel[], setList: (hotels: Hotel[]) => void): void => {
    setList(
      list.map((hotel) =>
        hotel.id === hotelId ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel
      )
    );
  };

  const renderSectionHeader = (title: string, onSeeAll?: () => void): React.JSX.Element => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BOOKING_COLORS.PRIMARY} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="grid-outline" size={22} color={BOOKING_COLORS.BACKGROUND} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>live Green</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="person-outline" size={22} color={BOOKING_COLORS.BACKGROUND} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Search Bar */}
        <SearchBar onPress={() => router.push('/search')} />

        {/* City Categories */}
        <View style={styles.citiesSection}>
          <FlatList
            data={CITIES}
            renderItem={({ item }) => (
              <CityButton city={item} onPress={() => router.push('/filter')} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.citiesList}
          />
        </View>

        {/* Best Hotels */}
        {renderSectionHeader('Best Hotels', () => router.push('/filter'))}
        <FlatList
          data={bestHotels}
          renderItem={({ item }) => (
            <HotelCard
              hotel={item}
              variant="horizontal"
              onPress={() => router.push(`/hotel-detail/${item.id}`)}
              onFavoritePress={() => toggleFavorite(item.id, bestHotels, setBestHotels)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hotelsList}
        />

        {/* Nearby Hotels */}
        {renderSectionHeader('Nearby your location', () => router.push('/filter'))}
        <View style={styles.nearbyHotels}>
          {nearbyHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              variant="vertical"
              onPress={() => router.push(`/hotel-detail/${hotel.id}`)}
              onFavoritePress={() => toggleFavorite(hotel.id, nearbyHotels, setNearbyHotels)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BOOKING_COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: BOOKING_COLORS.PRIMARY,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  headerIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BOOKING_COLORS.BACKGROUND,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  citiesSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  citiesList: {
    paddingHorizontal: 20,
    paddingRight: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BOOKING_COLORS.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: BOOKING_COLORS.PRIMARY,
  },
  hotelsList: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  nearbyHotels: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});