import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card, Button, Avatar, Divider, Portal, Modal, TextInput } from 'react-native-paper';
import { ArrowLeft, MapPin, Users, Shield, Heart, MessageCircle, Share2, Star } from 'lucide-react-native';
import { hiddenSpots } from '@/data/hiddenSpots';
import RatingStars from '@/components/RatingStars';
import MapMarker from '@/components/MapMarker';

const { width } = Dimensions.get('window');

export default function SpotDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [userName, setUserName] = useState('');

  const spot = hiddenSpots.find(s => s.id === id);

  if (!spot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Spot not found</Text>
        <Button mode="contained" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  const getCrowdColor = (level) => {
    switch (level) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FFC107';
      case 'High': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getSafetyColor = (level) => {
    switch (level) {
      case 'High': return '#4CAF50';
      case 'Medium': return '#FFC107';
      case 'Low': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleSubmitReview = () => {
    if (!userName.trim() || !newReview.trim()) {
      Alert.alert('Validation Error', 'Please fill in your name and review.');
      return;
    }

    Alert.alert('Review Submitted!', 'Thank you for sharing your experience.', [
      {
        text: 'OK',
        onPress: () => {
          setShowReviewModal(false);
          setNewReview('');
          setUserName('');
          setNewRating(5);
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

      <View style={styles.header}>
          <Button
            mode="text"
            onPress={() => router.back()}
            icon={() => <ArrowLeft size={24} color="#0000cd" />}
            contentStyle={styles.backButtonContent}
            labelStyle={{ color: '#0000cd' }}
          >
            Back
          </Button>
          <View style={styles.headerActions}>
            <Button mode="text" icon={() => <Heart size={24} color="red" />} labelStyle={{ color: '#0000cd' }}>Save</Button>
            <Button mode="text" icon={() => <Share2 size={24} color="#0000cd" />} labelStyle={{ color: '#0000cd' }}>Share</Button>
          </View>
        </View>

        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
          {spot.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.spotImage} resizeMode="cover" />
          ))}
        </ScrollView>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.titleRow}>
              <MapMarker vibe={spot.vibe} size={25} />
              <Text style={styles.spotName}>{spot.name}</Text>
            </View>

            <View style={styles.vibeContainer}>
              <Text style={styles.vibeLabel}>Vibe: </Text>
              <Text style={[styles.vibeText, { color: '#2196F3' }]}>{spot.vibe}</Text>
            </View>

            <Text style={styles.description}>{spot.description}</Text>

            <View style={styles.ratingContainer}>
              <RatingStars rating={spot.averageRating} size={20} />
              <Text style={styles.ratingText}>{spot.averageRating.toFixed(1)} ({spot.reviews.length} reviews)</Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Users size={18} color={getCrowdColor(spot.crowdLevel)} />
                <Text style={[styles.statusText, { color: getCrowdColor(spot.crowdLevel) }]}>Crowd: {spot.crowdLevel}</Text>
              </View>
              <View style={styles.statusItem}>
                <Shield size={18} color={getSafetyColor(spot.safetyLevel)} />
                <Text style={[styles.statusText, { color: getSafetyColor(spot.safetyLevel) }]}>Safety: {spot.safetyLevel}</Text>
              </View>
              <View style={styles.statusItem}>
                <MapPin size={18} color="#616161" />
                <Text style={styles.statusText}>By {spot.discoveredBy}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.storiesCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Personal Stories</Text>
            {spot.stories.map((story, index) => (
              <View key={index} style={styles.storyItem}>
                <Text style={styles.storyText}>"{story}"</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.ratingsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Community Ratings</Text>
            {Object.keys(spot.ratings).map((key) => (
              <View key={key} style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: `${(spot.ratings[key] / 5) * 100}%` }]} />
                </View>
                <Text style={styles.ratingValue}>{spot.ratings[key].toFixed(1)}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.reviewsCard}>
          <Card.Content>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Button mode="contained" onPress={() => setShowReviewModal(true)} icon={() => <MessageCircle size={16} color="#ffffff" />} style={styles.reviewButton}>Write Review</Button>
            </View>

            {spot.reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Avatar.Text size={32} label={review.userName.charAt(0)} style={{ backgroundColor: '#BBDEFB' }} color="#2196F3" />
                  <View style={styles.reviewUserInfo}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <RatingStars rating={review.rating} size={12} />
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Divider style={styles.reviewDivider} />
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Modal visible={showReviewModal} onDismiss={() => setShowReviewModal(false)} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Write a Review</Text>

          <TextInput
            label="Your Name"
            value={userName}
            onChangeText={setUserName}
            mode="outlined"
            style={styles.modalInput}
            theme={{ colors: { text: '#212121', primary: '#2196F3', underlineColor: 'transparent', background: '#F5F5F5' } }}
          />

          <View style={styles.ratingSelector}>
            <Text style={styles.ratingSelectorLabel}>Your Rating:</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  mode="text"
                  onPress={() => setNewRating(star)}
                  icon={() => (
                    <Star size={24} color={star <= newRating ? '#FFC107' : '#BDBDBD'} fill={star <= newRating ? '#FFC107' : '#BDBDBD'} />
                  )}
                  style={styles.starButton}
                />
              ))}
            </View>
          </View>

          <TextInput
            label="Your Review"
            value={newReview}
            onChangeText={setNewReview}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.modalInput}
            theme={{ colors: { text: '#212121', primary: '#2196F3', underlineColor: 'transparent', background: '#F5F5F5' } }}
          />

          <View style={styles.modalActions}>
            <Button mode="text" onPress={() => setShowReviewModal(false)} style={styles.modalButton}>Cancel</Button>
            <Button mode="contained" onPress={handleSubmitReview} style={styles.modalButton}>Submit Review</Button>
          </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}


const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingTop: 50,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  backButtonContent: {
    flexDirection: 'row-reverse',
  },
  headerActions: {
    flexDirection: 'row',
  },
  imageGallery: {
    height: 250,
  },
  spotImage: {
    width: width,
    height: 250,
  },
  infoCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  spotName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 12,
    flex: 1,
  },
  vibeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vibeLabel: {
    fontSize: 16,
    color: '#616161',
  },
  vibeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  description: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    color: '#616161',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  storiesCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  storyItem: {
    marginBottom: 12,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  storyText: {
    fontSize: 16,
    color: '#424242',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  ratingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#616161',
    width: 80,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    width: 30,
  },
  reviewsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewButton: {
    backgroundColor: '#2196F3',
    color: '#FFFFFF',
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  reviewComment: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginLeft: 44,
  },
  reviewDivider: {
    marginTop: 12,
    backgroundColor: '#F5F5F5',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: 16,
  },
  ratingSelector: {
    marginBottom: 16,
  },
  ratingSelectorLabel: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    minWidth: 40,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 0.4,
    backgroundColor: '#2196F3',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  errorText: {
    fontSize: 18,
    color: '#C62828',
    marginBottom: 20,
  },
});
