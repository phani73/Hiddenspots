import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import { TextInput as RNTextInput } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Camera, Upload, X } from 'lucide-react-native';

const PRIMARY = '#0070ff';
const MUTED = '#6b7280';
const LIGHT_BG = '#f9fafb';

export default function AddSpotScreen() {
  const [spotName, setSpotName] = useState('');
  const [description, setDescription] = useState('');
  const [personalStory, setPersonalStory] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('Romantic');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vibeOptions = ['Loving', 'Serene', 'Creative', 'Artistic'];

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return false;
    }
    return true;
  };

  const handleImagePicker = async () => {
    const hasPermission = await requestImagePermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 5));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images. Please try again.');
    }
  };

  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setSelectedImages(prev => [...prev, result.assets[0].uri].slice(0, 5));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!spotName.trim()) return Alert.alert('Error', 'Please enter a spot name.');
    if (!description.trim()) return Alert.alert('Error', 'Please enter a description.');
    if (!personalStory.trim()) return Alert.alert('Error', 'Please share your personal story.');
    if (!userName.trim()) return Alert.alert('Error', 'Please enter your name.');
    if (selectedImages.length === 0) return Alert.alert('Error', 'Please add at least one image.');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
        const formData = new FormData();

        formData.append('name', spotName);
        formData.append('userName', userName);
        formData.append('vibe', selectedVibe);
        formData.append('description', description);
        formData.append('personalStory', personalStory);

        // Prepare image files
        for (let i = 0; i < selectedImages.length; i++) {
            const uri = selectedImages[i];
            const fileInfo = await FileSystem.getInfoAsync(uri);
            formData.append('images', {
                uri: uri,
                type: 'image/jpeg',
                name: `photo_${i}.jpg`
            } as any);
        }

        await axios.post('https://4ef2-163-223-49-198.ngrok-free.app/api/spots/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        console.log('Request URL:', ' https://ff79-2405-201-c031-50d2-7d03-73ef-b8da-d9e3.ngrok-free.app/api/spots/add');


        Alert.alert('Success!', 'Your hidden spot has been submitted for review.', [{ text: 'OK' }]);

        // Reset form
        setSpotName('');
        setDescription('');
        setPersonalStory('');
        setUserName('');
        setSelectedImages([]);
        setSelectedVibe('Romantic');

    } catch (error: any) {
      console.error("Error (full):", error); // This prints everything
      if (error.response) {
          console.error("Error Response:", error.response); // This shows the detailed HTTP error from backend
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
      } else if (error.request) {
          console.error("Error Request (No response received):", error.request);
      } else {
          console.error("Error Message:", error.message);
      }
      Alert.alert('Error', 'Submission failed. Please try again.');
  } finally {
      setIsSubmitting(false);
  }
};


return (
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share a Hidden Spot</Text>
        <Text style={styles.headerSubtitle}>Help others discover secret gems of Gwalior</Text>
      </View>

      <Card style={styles.formCard}>
        <Card.Content>
        <View style={styles.textInputContainer}>
  <Text style={styles.inputLabel}>Spot Name *</Text>
  <RNTextInput
    value={spotName}
    onChangeText={setSpotName}
    style={styles.nativeInput}
    placeholder="Enter spot name"
    placeholderTextColor="#999"
  />
</View>

<View style={styles.textInputContainer}>
  <Text style={styles.inputLabel}>Your Name *</Text>
  <RNTextInput
    value={userName}
    onChangeText={setUserName}
    placeholder="Enter your name"
    placeholderTextColor="#999"
    style={styles.nativeInput}
  />
</View>

          <View style={styles.vibeSection}>
            <Text style={styles.sectionTitle}>Spot Vibe *</Text>
            <View style={styles.vibeOptions}>
              {vibeOptions.map((vibe) => (
                <TouchableOpacity
                  key={vibe}
                  onPress={() => setSelectedVibe(vibe)}
                  style={[styles.vibeButton, selectedVibe === vibe && styles.vibeButtonSelected]}
                >
                  <Text style={[styles.vibeButtonText, selectedVibe === vibe && styles.vibeButtonTextSelected]}>{vibe}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.textInputContainer}>
  <Text style={styles.inputLabel}>Description *</Text>
  <RNTextInput
    value={description}
    onChangeText={setDescription}
    placeholder="Write a description..."
    placeholderTextColor="#999"
    multiline
    numberOfLines={3}
    style={[styles.nativeInput, { textAlignVertical: 'top', height: 100 }]}
  />
</View>

<View style={styles.textInputContainer}>
  <Text style={styles.inputLabel}>Your Personal Story *</Text>
  <RNTextInput
    value={personalStory}
    onChangeText={setPersonalStory}
    placeholder="Share your story..."
    placeholderTextColor="#999"
    multiline
    numberOfLines={4}
    style={[styles.nativeInput, { textAlignVertical: 'top', height: 70 }]}
  />
</View>


          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>Photos * (Max 5)</Text>

            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageButton} onPress={handleCameraCapture}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                  <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Camera</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={18} color={PRIMARY} style={{ marginRight: 6 }} />
                  <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Gallery</Text>
                </View>
              </TouchableOpacity>
            </View>

            {selectedImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreview}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity onPress={() => removeImage(index)} style={styles.removeButton}>
                      <X size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting} style={styles.submitButton} contentStyle={styles.submitButtonContent}>
            {isSubmitting ? 'Submitting...' : 'Submit Hidden Spot'}
          </Button>

        </Card.Content>
      </Card>

    </ScrollView>
  </KeyboardAvoidingView>
);
}





const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG, paddingTop: 50 },

  header: { padding: 20, backgroundColor: PRIMARY, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: '#e0e7ff', textAlign: 'center' },

  formCard: { margin: 16, borderRadius: 16, elevation: 3, backgroundColor: '#fff', paddingVertical: 10 },
  input: { marginBottom: 16 },

  vibeSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  vibeOptions: { flexDirection: 'row', justifyContent: 'space-between' },
  vibeButton: { flex: 1, padding: 10, marginHorizontal: 4, borderWidth: 1, borderColor: PRIMARY, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center' },
  vibeButtonSelected: { backgroundColor: '#dbeafe' },
  vibeButtonText: { color: PRIMARY, fontWeight: '500' },
  vibeButtonTextSelected: { color: '#0000cd' },

  imageSection: { marginBottom: 24 },
  imageButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  imageButton: {
    flex: 0.48,
    borderColor: PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  
  imagePreview: { marginTop: 12 },
  imageContainer: { position: 'relative', marginRight: 12 },
  previewImage: { width: 90, height: 90, borderRadius: 12 },
  removeButton: { position: 'absolute', top: -6, right: -6, backgroundColor: '#ef4444', borderRadius: 12, padding: 4 },

  submitButton: { backgroundColor: PRIMARY, marginTop: 8, borderRadius: 8 },
  submitButtonContent: { paddingVertical: 10 },

  textInputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1f2937',
  },
  nativeInput: {
    backgroundColor: '#fff',
    borderColor: '#0000cd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  
});








