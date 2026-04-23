// screens/LearningScreen.js - Fixed version with updateMastery

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CallScreen } from './CallScreen';
import { FlashcardComponent } from '../components/FlashcardComponent';
import { QuizComponent } from '../components/QuizComponent';
import { learningApi } from '../services/learningApi';

export const LearningScreen = ({ 
  mode, // 'tutor', 'flashcards', 'quiz'
  selectedLanguage,
  selectedTopic,
  userPreferences,
  onBack,
  // CallScreen props (only for mode='tutor')
  messages,
  isLoading,
  isSpeaking,
  isMuted,
  callDuration,
  inputText,
  onInputChange,
  onSendMessage,
  onEndCall,
  onToggleMute,
  onStopSpeaking,
  userStats,
  showStats,
  onToggleStats,
  onFetchStats,
  sessionId,
  setSessionId,
  setIsTopicSet,
  setMessages,
  setSelectedTopic
}) => {
  const [flashcards, setFlashcards] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashcardSetId, setFlashcardSetId] = useState(null);
  const [quizAttemptId, setQuizAttemptId] = useState(null);

  useEffect(() => {
    if (mode === 'flashcards' && !flashcards && !loading) {
      generateFlashcards();
    }
    if (mode === 'quiz' && !quiz && !loading) {
      generateQuiz();
    }
  }, [mode]);

  const generateFlashcards = async () => {
    setLoading(true);
    try {
      console.log('Generating flashcards for:', selectedTopic.name);
      
      const result = await learningApi.generateFlashcards({
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        language: selectedLanguage,
        userPreferences
      });
      
      console.log('Flashcards result:', result);
      
      if (result && result.flashcards) {
        setFlashcards(result.flashcards);
        setFlashcardSetId(result.setId);
      } else {
        console.error('No flashcards in response:', result);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const result = await learningApi.generateQuiz({
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        language: selectedLanguage,
        userPreferences,
        questionCount: 10
      });
      
      if (result && result.quiz) {
        setQuiz(result.quiz);
        setQuizAttemptId(result.attemptId);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update flashcard mastery when user marks a card as known/unknown
  const updateFlashcardMastery = async (cardIndex, known) => {
    if (!flashcardSetId) return;
    
    try {
      await learningApi.updateFlashcardMastery({
        setId: flashcardSetId,
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        cardIndex,
        known
      });
      console.log(`Flashcard ${cardIndex} marked as ${known ? 'known' : 'needs review'}`);
    } catch (error) {
      console.error('Error updating flashcard mastery:', error);
    }
  };

  const handleFlashcardComplete = (knownCount, totalCount) => {
    console.log(`Flashcard session completed! Known: ${knownCount}/${totalCount}`);
    // Refresh stats after completing flashcards
    if (onFetchStats) {
      onFetchStats();
    }
    setTimeout(() => {
      onBack(); // This will return to TopicSelectionScreen
    }, 1500);
  };

  const handleQuizComplete = (score, total) => {
    console.log(`Quiz complete! Score: ${score}/${total}`);
    if (onFetchStats) {
      onFetchStats();
    }
    setTimeout(() => {
      onBack(); // This will return to TopicSelectionScreen
    }, 1500);
  };

  const handleBack = () => {
    if (mode === 'tutor') {
      onEndCall();
    }
    onBack();
  };

  const renderContent = () => {
    if (mode === 'tutor') {
      return (
        <CallScreen
          selectedLanguage={selectedLanguage}
          selectedTopic={selectedTopic}
          messages={messages}
          isLoading={isLoading}
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          callDuration={callDuration}
          inputText={inputText}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
          onEndCall={handleBack}
          onToggleMute={onToggleMute}
          onStopSpeaking={onStopSpeaking}
          userStats={userStats}
          showStats={showStats}
          onToggleStats={onToggleStats}
          onFetchStats={onFetchStats}
        />
      );
    }

    if (mode === 'flashcards') {
      if (loading) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Generating flashcards...</Text>
          </View>
        );
      }
      if (flashcards && flashcards.length > 0) {
        return (
          <FlashcardComponent 
            flashcards={flashcards} 
            onComplete={handleFlashcardComplete}
            onUpdateMastery={updateFlashcardMastery}
          />
        );
      }
      // Show error or empty state
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="card-outline" size={48} color="rgba(255,255,255,0.5)" />
          <Text style={styles.loadingText}>No flashcards available</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={generateFlashcards}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (mode === 'quiz') {
      if (loading) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Generating quiz...</Text>
          </View>
        );
      }
      if (quiz && quiz.length > 0) {
        return (
          <QuizComponent 
            quiz={quiz} 
            onSubmit={() => {}} 
            onComplete={handleQuizComplete} 
          />
        );
      }
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="help-buoy-outline" size={48} color="rgba(255,255,255,0.5)" />
          <Text style={styles.loadingText}>No quiz available</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={generateQuiz}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'tutor' ? 'AI Tutor' : mode === 'flashcards' ? 'Flashcards' : 'Quiz'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C67F2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: { flex: 1 },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  loadingText: { 
    color: '#fff', 
    fontSize: 16, 
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#53C691',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});