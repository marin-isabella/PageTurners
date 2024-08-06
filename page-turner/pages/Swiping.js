import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const Swiping = ({navigation, route}) => {
  const { book_id } = route.params;
  const { sortingAlgorithm } = route.params;  

  const [books, setBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        let response = await fetch(`https://actual-terribly-longhorn.ngrok-free.app/test`);
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
    console.log('Liked Books:', likedBooks);
    navigation.navigate('BookRecSummary', {likedBooks: likedBooks})
  };

  const handleLikePress = () => {
    swiperRef.current.swipeRight();
  };

  const handleDislikePress = () => {
    swiperRef.current.swipeLeft();
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
      {books.length > 0 ? (
        <Swiper
          ref={swiperRef}
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
      <TouchableOpacity style={styles.dislikeButton} onPress={handleDislikePress}>
        <Text style={styles.buttonText}>{"</3"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
        <Text style={styles.buttonText}>{"<3"}</Text>
      </TouchableOpacity>
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
