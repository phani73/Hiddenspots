import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export default function RatingStars({ rating, size = 16, showNumber = false }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color={star <= fullStars ? '#fbbf24' : '#d1d5db'}
          fill={star <= fullStars ? '#fbbf24' : '#d1d5db'}
        />
      ))}
      {hasHalfStar && (
        <View style={[styles.halfStar, { width: size / 2 }]}>
          <Star
            size={size}
            color="#fbbf24"
            fill="#fbbf24"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfStar: {
    position: 'absolute',
    overflow: 'hidden',
  },
});