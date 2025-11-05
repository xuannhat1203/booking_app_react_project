import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { HotelCard } from '@/components/booking/hotel-card';
import { BOOKING_COLORS, Hotel } from '@/constants/booking';
import { getHotelById } from '@/apis/roomApi';
import { useQuery } from '@tanstack/react-query';

const HOTEL_PHOTOS = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
];

export default function HotelDetailScreen(): React.JSX.Element {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Fetch hotel by id from API
  const { data: hotel, isLoading, isError } = useQuery({
    queryKey: ['hotel-detail', id],
    queryFn: () => getHotelById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={BOOKING_COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (isError || !hotel) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Không tìm thấy khách sạn</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerButton, styles.headerButtonTransparent]}>
          <Ionicons name="arrow-back" size={24} color={BOOKING_COLORS.BACKGROUND} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            style={[styles.headerButton, styles.headerButtonTransparent]}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? BOOKING_COLORS.HEART : BOOKING_COLORS.BACKGROUND}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.headerButtonTransparent]}>
            <Ionicons name="share-outline" size={24} color={BOOKING_COLORS.BACKGROUND} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Main Image */}
        <View style={[styles.imageContainer, { width }]}>
          <ExpoImage
            source={{ uri: hotel.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' }}
            style={styles.mainImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Hotel Info */}
        <View style={styles.content}>
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={BOOKING_COLORS.RATING} />
              <Text style={styles.ratingText}>{hotel.rating || 0}</Text>
            </View>
            <Text style={styles.reviews}>(0 Reviews)</Text>
          </View>

          <Text style={styles.hotelName}>{hotel.hotelName}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={BOOKING_COLORS.TEXT_SECONDARY} />
            <Text style={styles.location}>{hotel.address}</Text>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
              officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud
              amet.
            </Text>
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={HOTEL_PHOTOS}
              renderItem={({ item }) => (
                <View style={styles.photoThumbnail}>
                  <ExpoImage
                    source={{ uri: item }}
                    style={styles.photoImage}
                    contentFit="cover"
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosList}
            />
          </View>

          {/* Room Details */}
          <View style={styles.section}>
            <Text style={styles.roomTitle}>Room in boutique hotel hosted by Marine</Text>
            <Text style={styles.roomDetails}>2 guests • 1 bedroom • 1 bed • 1 bathroom</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="broom-outline" size={24} color={BOOKING_COLORS.PRIMARY} />
              </View>
              <Text style={styles.featureText}>
                This host committed to Airbnb's clone 5-step enhanced cleaning process.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="location-outline" size={24} color={BOOKING_COLORS.PRIMARY} />
              </View>
              <Text style={styles.featureText}>
                95% of recent guests give the location a 5-star rating.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="key-outline" size={24} color={BOOKING_COLORS.PRIMARY} />
              </View>
              <Text style={styles.featureText}>
                90% of recent guests gave the check-in process a 5-star rating.
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="calendar-outline" size={24} color={BOOKING_COLORS.PRIMARY} />
              </View>
              <Text style={styles.featureText}>Free cancellation until 2:00 PM on 8 May</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>${hotel.pricePerNight || 0}/night</Text>
        </View>
        <TouchableOpacity style={styles.selectDateButton}>
          <Text style={styles.selectDateText}>Chọn ngày</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BOOKING_COLORS.BACKGROUND,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonTransparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BOOKING_COLORS.BACKGROUND,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: BOOKING_COLORS.TEXT_PRIMARY,
  },
  reviews: {
    fontSize: 14,
    color: BOOKING_COLORS.TEXT_SECONDARY,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '700',
    color: BOOKING_COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },
  location: {
    fontSize: 16,
    color: BOOKING_COLORS.TEXT_SECONDARY,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BOOKING_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 16,
    color: BOOKING_COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  photosList: {
    gap: 12,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BOOKING_COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  roomDetails: {
    fontSize: 16,
    color: BOOKING_COLORS.TEXT_SECONDARY,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${BOOKING_COLORS.PRIMARY}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: BOOKING_COLORS.TEXT_PRIMARY,
    lineHeight: 24,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: BOOKING_COLORS.PRIMARY,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: BOOKING_COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: BOOKING_COLORS.BORDER,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: BOOKING_COLORS.PRICE,
  },
  selectDateButton: {
    backgroundColor: BOOKING_COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  selectDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: BOOKING_COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BOOKING_COLORS.BACKGROUND,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: BOOKING_COLORS.TEXT_SECONDARY,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: BOOKING_COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: BOOKING_COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BOOKING_COLORS.BACKGROUND,
  },
});
