// screens/LearningScreen.js - Simplified version without tabs

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text
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
      const result = await learningApi.generateFlashcards({
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        topicName: selectedTopic.name,
        language: selectedLanguage,
        userPreferences
      });
      setFlashcards(result.flashcards);
      setFlashcardSetId(result.setId);
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
      setQuiz(result.quiz);
      setQuizAttemptId(result.attemptId);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
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
      if (flashcards) {
        return <FlashcardComponent flashcards={flashcards} onComplete={() => {}} />;
      }
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
      if (quiz) {
        return <QuizComponent quiz={quiz} onSubmit={() => {}} onComplete={() => {}} />;
      }
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 16, marginTop: 12 },
});