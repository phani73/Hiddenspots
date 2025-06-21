import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, Dimensions, Platform, SafeAreaView } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { FAB } from 'react-native-paper';
import { LocateFixed } from 'lucide-react-native';
import { hiddenSpots } from '@/data/hiddenSpots';
import { UserLocation } from '@/types/spots';
import MapMarker from '@/components/MapMarker';

const { width, height } = Dimensions.get('window');

const GWALIOR_REGION = {
  latitude: 26.2183,
  longitude: 78.1828,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function DiscoverScreen() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert(
          'Location Permission',
          'Please enable location access to see your position on the map and get personalized recommendations.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleSpotPress = (spotId: string) => {
    router.push(`/spot-details?id=${spotId}`);
  };

  const centerOnUser = () => {
    if (userLocation && mapRef) {
      mapRef.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } else {
      getCurrentLocation();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <MapView
      ref={setMapRef}
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={GWALIOR_REGION}
      showsUserLocation={locationPermission}
      showsMyLocationButton={false}
      showsCompass={true}
      showsScale={true}
    >
        {hiddenSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            onPress={() => handleSpotPress(spot.id)}
            title={spot.name}
            description={spot.vibe}
          >
            <MapMarker vibe={spot.vibe} size={35} />
          </Marker>
        ))}
      </MapView>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hidden Spots of Gwalior</Text>
        <Text style={styles.headerSubtitle}>
          Discover {hiddenSpots.length} unique locations
        </Text>
      </View>

      <FAB
  style={styles.fab}
  icon={() => <LocateFixed size={25} color="#ffffff" />}
  onPress={centerOnUser}
/>

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: width * 0.035,
    color: '#6b7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.05,
    backgroundColor: '#0070ff',
  },
});