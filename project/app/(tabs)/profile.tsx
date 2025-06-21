import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Share } from 'react-native';
import { Card, Button, Avatar, Divider } from 'react-native-paper';
import { MapPin, Heart, Award, Calendar, Settings, Share2, Camera, LogOut } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'; // Import router

const PRIMARY_COLOR = '#0070ff';
const BACKGROUND_COLOR = '#ffffff';
const TEXT_COLOR = '#1f2937';

const userStats = {
  spotsDiscovered: 12,
  spotsShared: 4,
  totalLikes: 30,
  reviewsWritten: 8,
  joinDate: 'June 2025',
};

const recentActivity = [
  { id: '1', type: 'review', spotName: 'Sunset Point at Gopachal Hill', action: 'left a 5-star review', timeAgo: '2 days ago', image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg' },
  { id: '2', type: 'discover', spotName: 'Street Art Alley', action: 'discovered this spot', timeAgo: '1 week ago', image: 'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg' },
  { id: '3', type: 'share', spotName: 'Traditional Pottery Workshop', action: 'shared a new spot', timeAgo: '2 weeks ago', image: 'https://images.pexels.com/photos/1004554/pexels-photo-1004554.jpeg' },
];

const achievements = [
  { id: '1', title: 'Explorer', description: 'Discovered 10+ hidden spots', icon: MapPin, earned: true },
  { id: '2', title: 'Community Favorite', description: 'Received 100+ likes', icon: Heart, earned: true },
  { id: '3', title: 'Storyteller', description: 'Shared 5+ detailed reviews', icon: Award, earned: false },
];

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState('https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg');
  const router = useRouter(); // Initialize router

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Profile Updated', 'Your profile picture has been updated!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not update profile picture.');
    }
  };

  const shareProfile = async () => {
    try {
      await Share.share({
        message: 'Check out my travel profile! 🚀',
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
      Alert.alert('Error', 'Could not share profile.');
    }
  };

  const logout = () => {
    Alert.alert('Logged Out', 'You have been successfully logged out.');
    router.replace('/auth/Signin'); // Navigate to SignIn page
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Avatar.Image size={80} source={{ uri: profileImage }} />
          <View style={styles.cameraIcon}>
            <Camera size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>Phani</Text>
        <Text style={styles.userBio}>Adventure seeker exploring Gwalior's hidden gems ✨</Text>
        <Text style={styles.joinDate}>
          <Calendar size={14} color="#6b7280" /> Joined {userStats.joinDate}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <Button mode="outlined" icon={() => <Settings size={16} color={PRIMARY_COLOR} />} style={styles.actionButton} labelStyle={{ color: PRIMARY_COLOR }}>
          Settings
        </Button>
        <Button mode="outlined" icon={() => <Share2 size={16} color={PRIMARY_COLOR} />} style={styles.actionButton} labelStyle={{ color: PRIMARY_COLOR }} onPress={shareProfile}>
          Share Profile
        </Button>
        <Button mode="outlined" icon={() => <LogOut size={16} color={PRIMARY_COLOR} />} style={styles.actionButton} labelStyle={{ color: PRIMARY_COLOR }} onPress={logout}>
          Logout
        </Button>
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.spotsDiscovered}</Text>
              <Text style={styles.statLabel}>Spots Discovered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.spotsShared}</Text>
              <Text style={styles.statLabel}>Spots Shared</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalLikes}</Text>
              <Text style={styles.statLabel}>Total Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.reviewsWritten}</Text>
              <Text style={styles.statLabel}>Reviews Written</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.achievementsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.earned ? '#e0f2fe' : '#f3f4f6' }]}>
                  <IconComponent size={20} color={achievement.earned ? PRIMARY_COLOR : '#9ca3af'} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: achievement.earned ? TEXT_COLOR : '#9ca3af' }]}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedText}>✓</Text>
                  </View>
                )}
              </View>
            );
          })}
        </Card.Content>
      </Card>

      <Card style={styles.activityCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity, index) => (
            <View key={activity.id}>
              <View style={styles.activityItem}>
                <Image source={{ uri: activity.image }} style={styles.activityImage} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    You <Text style={styles.activityAction}>{activity.action}</Text> at <Text style={styles.spotName}>{activity.spotName}</Text>
                  </Text>
                  <Text style={styles.activityTime}>{activity.timeAgo}</Text>
                </View>
              </View>
              {index < recentActivity.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 50 },
  header: { alignItems: 'center', padding: 20, backgroundColor: BACKGROUND_COLOR, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  userName: { fontSize: 24, fontWeight: '700', color: TEXT_COLOR, marginTop: 12 },
  userBio: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  joinDate: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: PRIMARY_COLOR, borderRadius: 12, padding: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'center', padding: 16, gap: 12 },
  actionButton: { flex: 1, borderColor: PRIMARY_COLOR },
  statsCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 12, backgroundColor: '#f8fafc' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: TEXT_COLOR, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statItem: { width: '48%', alignItems: 'center', marginBottom: 16, backgroundColor: BACKGROUND_COLOR, paddingVertical: 12, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: '700', color: PRIMARY_COLOR },
  statLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 4 },
  achievementsCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 12, backgroundColor: '#f8fafc' },
  achievementItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  achievementIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 16, fontWeight: '600' },
  achievementDescription: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  earnedBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' },
  earnedText: { color: BACKGROUND_COLOR, fontSize: 12, fontWeight: '600' },
  activityCard: { marginHorizontal: 16, marginBottom: 20, borderRadius: 12, backgroundColor: '#f8fafc' },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  activityImage: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  activityInfo: { flex: 1 },
  activityText: { fontSize: 14, color: TEXT_COLOR, lineHeight: 18 },
  activityAction: { fontWeight: '600', color: PRIMARY_COLOR },
  spotName: { fontWeight: '600', color: TEXT_COLOR },
  activityTime: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  divider: { marginVertical: 8, backgroundColor: '#e5e7eb' },
});
