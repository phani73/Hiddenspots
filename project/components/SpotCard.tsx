import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { MapPin, Users, Shield } from 'lucide-react-native';
import { HiddenSpot } from '@/types/spots';
import RatingStars from './RatingStars';
import MapMarker from './MapMarker';

interface SpotCardProps {
  spot: HiddenSpot;
  onPress: () => void;
}

export default function SpotCard({ spot, onPress }: SpotCardProps) {
  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'High': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: spot.images[0] }}
            style={styles.spotImage}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <MapMarker vibe={spot.vibe} size={20} />
                <Text style={styles.spotName} numberOfLines={1}>
                  {spot.name}
                </Text>
              </View>
              <View style={styles.vibeTag}>
                <Text style={styles.vibeText}>{spot.vibe}</Text>
              </View>
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
              {spot.description}
            </Text>
            
            <View style={styles.ratingRow}>
              <RatingStars rating={spot.averageRating} size={14} />
              <Text style={styles.ratingText}>
                {spot.averageRating.toFixed(1)} ({spot.reviews.length} reviews)
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Users size={14} color={getCrowdColor(spot.crowdLevel)} />
                <Text style={[styles.statusText, { color: getCrowdColor(spot.crowdLevel) }]}>
                  {spot.crowdLevel}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Shield size={14} color={getSafetyColor(spot.safetyLevel)} />
                <Text style={[styles.statusText, { color: getSafetyColor(spot.safetyLevel) }]}>
                  Safe
                </Text>
              </View>
              <View style={styles.statusItem}>
                <MapPin size={14} color="#6b7280" />
                <Text style={styles.statusText}>
                  {spot.discoveredBy}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  spotImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  spotName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  vibeTag: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  vibeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  },
});