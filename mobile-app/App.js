import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY_HERE';
const PEXELS_API_URL = 'https://api.pexels.com/v1/curated?per_page=20';
const BACKEND_URL = 'http://localhost:3001';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
    fetchFavorites();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(PEXELS_API_URL, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      setPhotos(response.data.photos);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch photos from Pexels API');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(\`\${BACKEND_URL}/favorites\`);
      setFavorites(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch favorites from backend');
    }
  };

  const toggleFavorite = async (photo) => {
    const isFavorite = favorites.find(fav => fav.id === photo.id);
    if (isFavorite) {
      // Remove favorite
      try {
        await axios.delete(\`\${BACKEND_URL}/favorites/\${photo.id}\`);
        setFavorites(favorites.filter(fav => fav.id !== photo.id));
      } catch (error) {
        Alert.alert('Error', 'Failed to remove favorite');
      }
    } else {
      // Add favorite
      try {
        await axios.post(\`\${BACKEND_URL}/favorites\`, photo);
        setFavorites([...favorites, photo]);
      } catch (error) {
        Alert.alert('Error', 'Failed to add favorite');
      }
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.find(fav => fav.id === item.id);
    return (
      <View style={styles.photoContainer}>
        <Image source={{ uri: item.src.medium }} style={styles.photo} />
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite ? styles.favorited : styles.notFavorited]}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={styles.favoriteText}>{isFavorite ? 'Unfavorite' : 'Favorite'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pexels Photos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  photoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photo: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  favoriteButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  favorited: {
    backgroundColor: '#ff6347',
  },
  notFavorited: {
    backgroundColor: '#87ceeb',
  },
  favoriteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
