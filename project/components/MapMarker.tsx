import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heart, Leaf, Palette, Brush } from 'lucide-react-native';

interface MapMarkerProps {
  vibe: 'Romantic' | 'Serene' | 'Creative' | 'Artistic';
  size?: number;
}

export default function MapMarker({ vibe, size = 30 }: MapMarkerProps) {
  const getMarkerConfig = () => {
    switch (vibe) {
      case 'Romantic':
        return {
          icon: Heart,
          color: '#ef4444',
          backgroundColor: '#fef2f2'
        };
      case 'Serene':
        return {
          icon: Leaf,
          color: '#22c55e',
          backgroundColor: '#f0fdf4'
        };
      case 'Creative':
        return {
          icon: Palette,
          color: '#a855f7',
          backgroundColor: '#faf5ff'
        };
      case 'Artistic':
        return {
          icon: Brush,
          color: '#f97316',
          backgroundColor: '#fff7ed'
        };
      default:
        return {
          icon: Heart,
          color: '#6b7280',
          backgroundColor: '#f9fafb'
        };
    }
  };

  const { icon: IconComponent, color, backgroundColor } = getMarkerConfig();

  return (
    <View style={[
      styles.markerContainer,
      { 
        backgroundColor,
        width: size + 10,
        height: size + 10,
        borderRadius: (size + 10) / 2
      }
    ]}>
      <IconComponent
        size={size * 0.6}
        color={color}
        strokeWidth={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
    padding: 6,
  },
});