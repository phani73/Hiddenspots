import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Share,RefreshControl } from 'react-native';
import { Card, Button, TextInput, Avatar } from 'react-native-paper';
import { MessageCircle, ThumbsUp, Share2, TrendingUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hiddenSpots } from '@/data/hiddenSpots';
import RatingStars from '@/components/RatingStars';

interface Spot {
  _id: string;
  userName?: string;
  name: string;
  description?: string;
  images: string[];
}

interface PostData {
  likes: number;
  comments: number;
}

const PRIMARY = '#0070ff';
const MUTED = '#6b7280';
const LIGHT_BG = '#f9fafb';

export default function CommunityScreen() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [postData, setPostData] = useState<Record<string, PostData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const SPOTS_URL = 'https://4ef2-163-223-49-198.ngrok-free.app/api/spots';
  const POSTS_URL = 'https://4ef2-163-223-49-198.ngrok-free.app/api/posts';

  useEffect(() => {
    fetch(SPOTS_URL)
      .then(response => response.json())
      .then(async (data: Spot[]) => {
        setSpots(data);
        const postStats: Record<string, PostData> = {};
        for (const spot of data) {
          const res = await fetch(`${POSTS_URL}/${spot._id}`);
          const post = await res.json();
          postStats[spot._id] = { likes: post.likes, comments: post.comments };
        }
        setPostData(postStats);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching spots:', error);
        setLoading(false);
      });
  }, []);

  const handleLike = async (spotId: string) => {
    try {
      const response = await fetch(`${POSTS_URL}/like/${spotId}`, { method: 'POST' });
      const updated = await response.json();

      setPostData(prev => ({
        ...prev,
        [spotId]: { ...prev[spotId], likes: updated.likes }
      }));
    } catch (error) {
      console.error('Error liking spot:', error);
    }
  };

  const handleComment = (spotId: string) => {
    setShowCommentInput(showCommentInput === spotId ? null : spotId);
  };

  const submitComment = async (spotId: string) => {
    if (newComment.trim()) {
      try {
        const response = await fetch(`${POSTS_URL}/comment/${spotId}`, { method: 'POST' });
        const updated = await response.json();

        setPostData(prev => ({
          ...prev,
          [spotId]: { ...prev[spotId], comments: updated.comments }
        }));

        setNewComment('');
        setShowCommentInput(null);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const fetchSpots = async () => {
    try {
      setRefreshing(true); // Start refreshing
      const response = await fetch(SPOTS_URL);
      const data: Spot[] = await response.json();
      setSpots(data);
  
      const postStats: Record<string, PostData> = {};
      for (const spot of data) {
        const res = await fetch(`${POSTS_URL}/${spot._id}`);
        const post = await res.json();
        postStats[spot._id] = { likes: post.likes, comments: post.comments };
      }
  
      setPostData(postStats);
    } catch (error) {
      console.error('Error fetching spots:', error);
    } finally {
      setRefreshing(false); // Stop refreshing
      setLoading(false); // In case it's the initial load
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);
  

  const handleShare = async (spot: Spot) => {
    try {
      await Share.share({
        message: `Check out this hidden gem: ${spot.name}!\n\n${spot.description}\n\nShared via Hidden Spots App!`,
        url: spot.images.length > 0 ? spot.images[0] : undefined,
        title: spot.name,
      });
    } catch (error) {
      console.error('Error sharing spot:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }


  return (

    <SafeAreaView style={{ flex: 2, backgroundColor: LIGHT_BG }}>
   
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchSpots} colors={[PRIMARY]} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Community</Text>
            <Text style={styles.headerSubtitle}>Share experiences and discover hidden gems</Text>
          </View>

          {/* Trending Section */}
          <Card style={styles.trendingCard}>
            <Card.Content>
              <View style={styles.trendingHeader}>
                <TrendingUp size={20} color={PRIMARY} />
                <Text style={styles.trendingTitle}>Trending Spots</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {hiddenSpots
                  .sort((a, b) => b.averageRating - a.averageRating)
                  .slice(0, 3)
                  .map((spot, index) => (
                    <View key={spot.id} style={styles.trendingItem}>
                      <Image source={{ uri: spot.images[0] }} style={styles.trendingImage} />
                      <Text style={styles.trendingName} numberOfLines={1}>{spot.name}</Text>
                      <View style={styles.trendingMeta}>
                        <RatingStars rating={spot.averageRating} size={12} />
                        <Text style={styles.trendingRank}>#{index + 1}</Text>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </Card.Content>
          </Card>

          {/* Posts Section */}
          <Text style={styles.sectionTitle}>Recent Experiences</Text>
          {spots.map(spot => (
            <Card key={spot._id} style={styles.postCard}>
              <Card.Content>
                <View style={styles.postHeader}>
                  <Avatar.Image size={44} source={{ uri: 'https://i.pravatar.cc/150?img=4' }} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{spot.userName || 'Anonymous'}</Text>
                    <Text style={styles.timeAgo}>Just now</Text>
                  </View>
                </View>

                <Text style={styles.postContent}>{spot.description || 'No description provided'}</Text>
                {spot.images.length > 0 && <Image source={{ uri: spot.images[0] }} style={styles.postImage} />}

                <View style={styles.postActions}>
  <Button
    mode="text"
    icon={() => <ThumbsUp size={18} color={MUTED} />}
    textColor={MUTED}
    onPress={() => handleLike(spot._id)}
    contentStyle={styles.actionButton}
  >
    {postData[spot._id]?.likes || 0}
  </Button>

  <Button
    mode="text"
    icon={() => <MessageCircle size={18} color={MUTED} />}
    textColor={MUTED}
    onPress={() => handleComment(spot._id)}
    contentStyle={styles.actionButton}
  >
    {postData[spot._id]?.comments || 0}
  </Button>

  <Button
    mode="text"
    icon={() => <Share2 size={18} color={MUTED} />}
    textColor={MUTED}
    onPress={() => handleShare(spot)}
    contentStyle={styles.actionButton}
  >
    Share
  </Button>
</View>

                {showCommentInput === spot._id && (
                  <View style={styles.commentFooter}>
                    <TextInput
                      placeholder="Write a comment..."
                      mode="outlined"
                      dense
                      value={newComment}
                      onChangeText={setNewComment}
                      right={<TextInput.Icon icon="send" color={PRIMARY} onPress={() => submitComment(spot._id)} />}
                      style={styles.commentInput}
                      theme={{
                        colors: {
                          primary: PRIMARY,
                          text: '#000000',
                          placeholder: '#9ca3af',
                          background: 'white',
                        }
                      }}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                )}
              </Card.Content>
            </Card>
          ))}

        </ScrollView>
      
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </SafeAreaView>
   
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG, paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { padding: 20, backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, elevation: 2 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: MUTED },

  trendingCard: { borderRadius: 12, backgroundColor: '#fff', elevation: 2, paddingVertical: 16, marginBottom: 20 },
  trendingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginHorizontal: 16 },
  trendingTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginLeft: 8 },
  trendingItem: { width: 140, marginRight: 16, alignItems: 'center' },
  trendingImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 8 },
  trendingName: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 4 },
  trendingMeta: { flexDirection: 'row', alignItems: 'center' },
  trendingRank: { fontSize: 12, fontWeight: '600', color: PRIMARY, marginLeft: 4 },

  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 12 },

  postCard: { borderRadius: 12, elevation: 1, backgroundColor: '#fff', marginBottom: 20, padding: 8 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userInfo: { marginLeft: 12 },
  userName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  timeAgo: { fontSize: 12, color: MUTED },

  postContent: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 12 },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },

  postActions: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#f3f4f6', paddingTop: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },

  commentFooter: { marginTop: 12 },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
