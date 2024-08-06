import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useNavigation, useRoute } from '@react-navigation/native';
import images from "../constants/images";

const Swiping = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { book_id } = route.params;
  const { sortingAlgorithm } = route.params;  

  const [books, setBooks ] = useState([]);
  const [likedBooks, setLikedBooks ] = useState([]);
  const [loading, setLoading ] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        let response = await fetch(`https://actual-terribly-longhorn.ngrok-free.app/similar-books/${book_id}`);
        let data = await response.json();

        const similarBooks = data.similar_books.map(item => ({
          id: item.book.id,
          title: item.book.title,
          author: item.book.authors[0] || 'Unknown Author',
          subjects: item.book.subjects.join(', ') || 'Unknown Subjects'
        }));

        setBooks(similarBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [book_id]);

  const handleSwipeRight = (cardIndex) => {
    const likedBook = books[cardIndex];
    setLikedBooks((prevLikedBooks) => [...prevLikedBooks, likedBook]);
  };

  const handleSwipedAll = () => {
    console.log('All cards swiped');
    navigation.navigate('BookRecSummary', { sortingAlgorithm }, { likedBooks: likedBooks.map(book => book.title)});
  };

  const handleDislike = () => {
    console.log("Left swipe.");
    swiperRef.current.swipeLeft();
  }

  const handleLike = () => {
    console.log("Right swipe.");
    swiperRef.current.swipeRight();
  }

  const handleViewSaved = () => {
    console.log("Viewing saved");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="brown" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* adding top bar */}
      <Image source = {images.logo} style = {styles.logo} />

      {/* items within the card */}
      <View style = {styles.cardContainer}>
        {books.length > 0 ? (
          <Swiper
            cards={books}
            renderCard={(card) => (
              <View style={styles.card}>
                <Text style={styles.text}>
                  {card.title}, {card.author}
                </Text>
                <Text style={styles.subjects}>{card.subjects}</Text>
              </View>
            )}
            onSwipedRight={handleSwipeRight}
            onSwipedAll={handleSwipedAll}
            cardIndex={0}
            backgroundColor={'#f0f1f2'}
            stackSize={3}
          />
        ) : (
          <Text>No books available</Text>
        )}
      </View>
      
      {/* love, dislike, view library */}
      <View style = {styles.bottomContainer}>
        <TouchableOpacity style = {styles.thumbsDownButton} onPress={handleDislike}>
          <Image source={images.x_icon} style={styles.icons} />
        </TouchableOpacity>

        <TouchableOpacity style = {styles.bookshelfButton} onPress={handleViewSaved}>
          <Image source={images.bookshelf} style={styles.bookshelf} />
        </TouchableOpacity>

        <TouchableOpacity style = {styles.thumbsUpButton} onPress={handleLike}>
          <Image source={images.heart} style={styles.icons} />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6E1',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    marginTop: 15,
    width: 200,
    height: 175,
    resizeMode: 'contain', 
  },
  cardContainer: {
    flex: 1,
    width: '85%',
    backgroundColor: 'white',
    marginBottom: 100,
    borderRadius: 20,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  subjects: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    bottom: 20,
  },
  thumbsDownButton: {
    borderRadius: 50,
    padding: 10,
  },
  thumbsUpButton: {
    borderRadius: 50,
    padding: 10,
  },
  bookshelfButton: {
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookshelf: {
    width: 70,
    height: 60,
  },
  icons: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 100,
    borderWidth: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Swiping;
