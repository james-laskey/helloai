// components/FlashcardComponent.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

export const FlashcardComponent = ({ flashcards, onComplete, onUpdateMastery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState([]);
  const [unknownCards, setUnknownCards] = useState([]);
  const [completed, setCompleted] = useState(false);
  
  const flipAnimation = useState(new Animated.Value(0))[0];
  
  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;
  const progress = ((currentIndex + 1) / totalCards) * 100;
  
  useEffect(() => {
    // Reset flip animation when card changes
    setIsFlipped(false);
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true
    }).start();
  }, [currentIndex]);
  
  const flipCard = () => {
    if (isFlipped) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => setIsFlipped(false));
    } else {
      Animated.timing(flipAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start(() => setIsFlipped(true));
    }
  };
  
  const handleKnown = () => {
    setKnownCards([...knownCards, currentCard]);
    onUpdateMastery(currentIndex, true);
    nextCard();
  };
  
  const handleUnknown = () => {
    setUnknownCards([...unknownCards, currentCard]);
    onUpdateMastery(currentIndex, false);
    nextCard();
  };
  
  const nextCard = () => {
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
      onComplete(knownCards.length, totalCards);
    }
  };
  
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });
  
  if (completed) {
    const score = Math.round((knownCards.length / totalCards) * 100);
    return (
      <View style={styles.completedContainer}>
        <View style={styles.completedHeader}>
          <Ionicons name="checkmark-circle" size={60} color="#53C691" />
          <Text style={styles.completedTitle}>Session Complete!</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{knownCards.length}</Text>
            <Text style={styles.statLabel}>Known</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{unknownCards.length}</Text>
            <Text style={styles.statLabel}>Review Later</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{score}%</Text>
            <Text style={styles.statLabel}>Mastery</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.doneButton} onPress={onComplete}>
          <Text style={styles.doneButtonText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Card {currentIndex + 1} of {totalCards}
        </Text>
      </View>
      
      <TouchableOpacity activeOpacity={0.9} onPress={flipCard}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ rotateY: frontInterpolate }] }
          ]}
        >
          <View style={styles.cardFront}>
            <Text style={styles.cardText}>{currentCard.front}</Text>
            <Text style={styles.flipHint}>Tap to flip</Text>
          </View>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] }
          ]}
        >
          <View style={styles.cardBackContent}>
            <Text style={styles.cardBackText}>{currentCard.back}</Text>
            {currentCard.example && (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleLabel}>Example:</Text>
                <Text style={styles.exampleText}>"{currentCard.example}"</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
      
      {isFlipped && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.unknownButton]} onPress={handleUnknown}>
            <Ionicons name="close" size={24} color="#fff" />
            <Text style={styles.buttonText}>Needs Review</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.knownButton]} onPress={handleKnown}>
            <Ionicons name="checkmark" size={24} color="#fff" />
            <Text style={styles.buttonText}>I Know This</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  progressContainer: {
    marginBottom: 20
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#53C691',
    borderRadius: 2
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center'
  },
  card: {
    width: width - 60,
    minHeight: 300,
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 24,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  cardBackContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  cardText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20
  },
  cardBackText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26
  },
  exampleContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(83,198,145,0.1)',
    borderRadius: 12
  },
  exampleLabel: {
    color: '#53C691',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  exampleText: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic'
  },
  flipHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    position: 'absolute',
    bottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 160,
    gap: 12
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    gap: 8
  },
  unknownButton: {
    backgroundColor: '#ff4444'
  },
  knownButton: {
    backgroundColor: '#53C691'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  completedHeader: {
    alignItems: 'center',
    marginBottom: 32
  },
  completedTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 16,
    minWidth: 80
  },
  statValue: {
    color: '#53C691',
    fontSize: 32,
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4
  },
  doneButton: {
    backgroundColor: '#53C691',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});