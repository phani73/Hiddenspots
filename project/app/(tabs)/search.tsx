import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Button, Chip } from 'react-native-paper';
import { Filter } from 'lucide-react-native';
import { hiddenSpots } from '@/data/hiddenSpots';
import { HiddenSpot } from '@/types/spots';
import SpotCard from '@/components/SpotCard';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#0070ff';

type VibeFilter = 'All' | 'Romantic' | 'Serene' | 'Creative' | 'Artistic';
type CrowdFilter = 'All' | 'Low' | 'Medium' | 'High';
type SafetyFilter = 'All' | 'High' | 'Medium' | 'Low';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vibeFilter, setVibeFilter] = useState<VibeFilter>('All');
  const [crowdFilter, setCrowdFilter] = useState<CrowdFilter>('All');
  const [safetyFilter, setSafetyFilter] = useState<SafetyFilter>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSpots = useMemo(() => {
    return hiddenSpots.filter((spot: HiddenSpot) => {
      const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           spot.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVibe = vibeFilter === 'All' || spot.vibe === vibeFilter;
      const matchesCrowd = crowdFilter === 'All' || spot.crowdLevel === crowdFilter;
      const matchesSafety = safetyFilter === 'All' || spot.safetyLevel === safetyFilter;

      return matchesSearch && matchesVibe && matchesCrowd && matchesSafety;
    });
  }, [searchQuery, vibeFilter, crowdFilter, safetyFilter]);

  const handleSpotPress = (spotId: string) => {
    router.push(`/spot-details?id=${spotId}`);
  };

  const clearFilters = () => {
    setVibeFilter('All');
    setCrowdFilter('All');
    setSafetyFilter('All');
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
      <Searchbar
          placeholder="Search hidden spots..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={PRIMARY_COLOR}
          inputStyle={{ color: '#1f2937' }}
        />
        <Button
          mode="outlined"
          onPress={() => setShowFilters(!showFilters)}
          icon={() => <Filter size={16} color={PRIMARY_COLOR} />}
          contentStyle={styles.filterButtonContent}
          style={styles.filterButton}
          labelStyle={{ color: PRIMARY_COLOR }}
        >
          Filters
        </Button>
      </View>

      {showFilters && (
  <View style={styles.filtersContainer}>
    {/* Vibe Filter */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
      <View style={styles.filterSection}>
        {(['All', 'Romantic', 'Serene', 'Creative', 'Artistic'] as VibeFilter[]).map((vibe) => (
          <Chip
            key={vibe}
            selected={vibeFilter === vibe}
            onPress={() => setVibeFilter(vibe)}
            style={[
              styles.filterChip,
              vibeFilter === vibe && { backgroundColor: PRIMARY_COLOR },
            ]}
            textStyle={vibeFilter === vibe ? styles.selectedChipText : styles.chipText}
          >
            {vibe}
          </Chip>
        ))}
      </View>
    </ScrollView>

    {/* Crowd Filter */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
      <View style={styles.filterSection}>
        {(['All', 'Low', 'Medium', 'High'] as CrowdFilter[]).map((crowd) => (
          <Chip
            key={crowd}
            selected={crowdFilter === crowd}
            onPress={() => setCrowdFilter(crowd)}
            style={[
              styles.filterChip,
              crowdFilter === crowd && { backgroundColor: PRIMARY_COLOR },
            ]}
            textStyle={crowdFilter === crowd ? styles.selectedChipText : styles.chipText}
          >
            Crowd: {crowd}
          </Chip>
        ))}
      </View>
    </ScrollView>

    {/* Safety Filter */}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
      <View style={styles.filterSection}>
        {(['All', 'High', 'Medium', 'Low'] as SafetyFilter[]).map((safety) => (
          <Chip
            key={safety}
            selected={safetyFilter === safety}
            onPress={() => setSafetyFilter(safety)}
            style={[
              styles.filterChip,
              safetyFilter === safety && { backgroundColor: PRIMARY_COLOR },
            ]}
            textStyle={safetyFilter === safety ? styles.selectedChipText : styles.chipText}
          >
            Safety: {safety}
          </Chip>
        ))}
      </View>
    </ScrollView>

    <View style={styles.filterActions}>
      <Button mode="text" onPress={clearFilters} 
       labelStyle={{ color: PRIMARY_COLOR, fontWeight: 'bold' }} >
        Clear All
      </Button>
    </View>
  </View>
)}


      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {filteredSpots.map((spot) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            onPress={() => handleSpotPress(spot.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  filterButton: {
    borderColor: PRIMARY_COLOR,
    borderRadius: 12,
  },
  filterButtonContent: {
    height: 40,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },  
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterRow: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  chipText: {
    color: '#6b7280',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});