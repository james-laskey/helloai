// screens/LearningScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CallScreen } from './CallScreen';
import { FlashcardComponent } from '../components/FlashcardComponent';
import { QuizComponent } from '../components/QuizComponent';
import { InterstitialAdComponent } from '../components/InterstitialAdComponent';
import { learningApi } from '../services/learningApi';

export const LearningScreen = ({ 
  mode, // 'tutor', 'flashcards', 'quiz'
  selectedLanguage,
  selectedTopic,
  userPreferences,
  onBack,
  // CallScreen props
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
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [submittedFlashcards, setSubmittedFlashcards] = useState(false);
  
  // New states for previous datasets
  const [previousFlashcardSets, setPreviousFlashcardSets] = useState([]);
  const [previousQuizAttempts, setPreviousQuizAttempts] = useState([]);
  const [showDatasetSelector, setShowDatasetSelector] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [loadingPrevious, setLoadingPrevious] = useState(false);
  
  // Ad state
  const [showAd, setShowAd] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  // Fetch previous datasets when component mounts
  useEffect(() => {
    if (mode === 'flashcards') {
      fetchPreviousFlashcardSets();
    } else if (mode === 'quiz') {
      fetchPreviousQuizAttempts();
    }
  }, [mode]);

  const fetchPreviousFlashcardSets = async () => {
    setLoadingPrevious(true);
    try {
      const result = await learningApi.getPreviousFlashcardSets({
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        language: selectedLanguage
      });
      if (result && result.sets) {
        setPreviousFlashcardSets(result.sets);
      }
    } catch (error) {
      console.error('Error fetching previous flashcard sets:', error);
    } finally {
      setLoadingPrevious(false);
    }
  };

  const fetchPreviousQuizAttempts = async () => {
    setLoadingPrevious(true);
    try {
      const result = await learningApi.getPreviousQuizAttempts({
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        language: selectedLanguage
      });
      if (result && result.quizzes) {
        setPreviousQuizAttempts(result.quizzes);
      }
    } catch (error) {
      console.error('Error fetching previous quiz attempts:', error);
    } finally {
      setLoadingPrevious(false);
    }
  };

  const handleUsePreviousFlashcardSet = (set) => {
    setFlashcards(set.cards);
    setFlashcardSetId(set.id);
    setSelectedDataset(set);
    setShowDatasetSelector(false);
  };

  const handleUsePreviousQuiz = (quizData) => {
    setQuiz(quizData.questions);
    setQuizAttemptId(quizData.id);
    setSelectedDataset(quizData);
    setShowDatasetSelector(false);
  };

  const handleGenerateNew = () => {
    setSelectedDataset(null);
    setShowDatasetSelector(false);
    if (mode === 'flashcards') {
      setFlashcards(null);
      generateFlashcards();
    } else if (mode === 'quiz') {
      setQuiz(null);
      generateQuiz();
    }
  };

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
        // Refresh the list of previous sets
        fetchPreviousFlashcardSets();
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
        // Refresh the list of previous quizzes
        fetchPreviousQuizAttempts();
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuizResults = async (answers, score, total) => {
    if (!quizAttemptId || submittedQuiz) return;
    
    setSubmittedQuiz(true);
    try {
      const result = await learningApi.submitQuiz({
        attemptId: quizAttemptId,
        userId: userPreferences?.id || 'anonymous',
        topicId: selectedTopic.id,
        answers: answers.map(a => a.selected),
        timeSpent: 0
      });
      console.log('Quiz submitted successfully:', result);
      setQuiz(null);
      // Refresh previous quizzes after submission
      fetchPreviousQuizAttempts();
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const updateFlashcardMastery = async (cardIndex, known) => {
    if (!flashcardSetId || submittedFlashcards) return;
    
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

  const submitFlashcardCompletion = async (knownCount, totalCount) => {
    if (!flashcardSetId || submittedFlashcards) return;
    
    setSubmittedFlashcards(true);
    try {
      console.log(`Flashcard session completed: ${knownCount}/${totalCount} known`);
      setFlashcards(null);
      // Refresh previous flashcard sets after completion
      fetchPreviousFlashcardSets();
    } catch (error) {
      console.error('Error submitting flashcard completion:', error);
    }
  };

  // Updated completion handlers with ad display
  const handleFlashcardComplete = async (knownCount, totalCount) => {
    console.log(`Flashcard session completed! Known: ${knownCount}/${totalCount}`);
    await submitFlashcardCompletion(knownCount, totalCount);
    // Show interstitial ad before navigating back
    setShowAd(true);
  };

  const handleQuizComplete = async (score, total, answers) => {
    console.log(`Quiz complete! Score: ${score}/${total}`);
    await submitQuizResults(answers, score, total);
    // Show interstitial ad before navigating back
    setShowAd(true);
  };

  const handleAdComplete = () => {
    console.log('Ad completed or closed');
    setShowAd(false);
    // Navigate back after ad completes
    setTimeout(() => {
      onBack();
    }, 100);
  };

  const handleBack = () => {
    if (mode === 'tutor') {
      onEndCall();
    }
    onBack();
  };

  // Render dataset selector for flashcards
  const renderFlashcardDatasetSelector = () => {
    if (previousFlashcardSets.length === 0 && !loadingPrevious) {
      return (
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorTitle}>No previous flashcards found</Text>
          <Text style={styles.selectorSubtitle}>Generate your first set to get started!</Text>
          <TouchableOpacity style={styles.generateButton} onPress={generateFlashcards}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.generateButtonText}>Generate New Flashcards</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Choose a Flashcard Set</Text>
        <Text style={styles.selectorSubtitle}>Select from your previous sets or create a new one</Text>
        
        <FlatList
          data={previousFlashcardSets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.datasetCard}
              onPress={() => handleUsePreviousFlashcardSet(item)}
            >
              <View style={styles.datasetCardHeader}>
                <Ionicons name="card" size={24} color="#53C691" />
                <Text style={styles.datasetCardTitle}>{item.title || `${selectedTopic.name} Flashcards`}</Text>
              </View>
              <View style={styles.datasetCardStats}>
                <Text style={styles.datasetCardStat}>📇 {item.cards?.length || 0} cards</Text>
                <Text style={styles.datasetCardStat}>📊 Mastery: {Math.round(item.masteryLevel || 0)}%</Text>
                <Text style={styles.datasetCardStat}>🔄 Reviewed: {item.timesReviewed || 0} times</Text>
              </View>
              <Text style={styles.datasetCardDate}>
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.datasetList}
        />
        
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateNew}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.generateButtonText}>Generate New Set</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render dataset selector for quizzes
  const renderQuizDatasetSelector = () => {
    if (previousQuizAttempts.length === 0 && !loadingPrevious) {
      return (
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorTitle}>No previous quizzes found</Text>
          <Text style={styles.selectorSubtitle}>Generate your first quiz to get started!</Text>
          <TouchableOpacity style={styles.generateButton} onPress={generateQuiz}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.generateButtonText}>Generate New Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Choose a Quiz</Text>
        <Text style={styles.selectorSubtitle}>Select from your previous quizzes or create a new one</Text>
        
        <FlatList
          data={previousQuizAttempts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.datasetCard}
              onPress={() => handleUsePreviousQuiz(item)}
            >
              <View style={styles.datasetCardHeader}>
                <Ionicons name="help-buoy" size={24} color="#FF8C00" />
                <Text style={styles.datasetCardTitle}>{item.title || `${selectedTopic.name} Quiz`}</Text>
              </View>
              <View style={styles.datasetCardStats}>
                <Text style={styles.datasetCardStat}>📝 {item.totalQuestions || 0} questions</Text>
                {item.score !== null && (
                  <Text style={styles.datasetCardStat}>⭐ Score: {item.score}%</Text>
                )}
                <Text style={styles.datasetCardStat}>🎯 Correct: {item.correctCount || 0}</Text>
              </View>
              <Text style={styles.datasetCardDate}>
                {item.completedAt ? `Completed: ${new Date(item.completedAt).toLocaleDateString()}` : `Created: ${new Date(item.createdAt).toLocaleDateString()}`}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.datasetList}
        />
        
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateNew}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.generateButtonText}>Generate New Quiz</Text>
        </TouchableOpacity>
      </View>
    );
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
      // Show dataset selector if no flashcards loaded and not loading
      if (!flashcards && !loading && !showDatasetSelector) {
        setShowDatasetSelector(true);
      }
      
      if (showDatasetSelector && !flashcards) {
        return loadingPrevious ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Loading your flashcards...</Text>
          </View>
        ) : renderFlashcardDatasetSelector();
      }
      
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
      
      return null;
    }

    if (mode === 'quiz') {
      // Show dataset selector if no quiz loaded and not loading
      if (!quiz && !loading && !showDatasetSelector) {
        setShowDatasetSelector(true);
      }
      
      if (showDatasetSelector && !quiz) {
        return loadingPrevious ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Loading your quizzes...</Text>
          </View>
        ) : renderQuizDatasetSelector();
      }
      
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
            onSubmit={submitQuizResults}
            onComplete={handleQuizComplete}
            attemptId={quizAttemptId}
            userId={userPreferences?.id}
            topicId={selectedTopic.id}
          />
        );
      }
      
      return null;
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
      
      {/* Interstitial Ad Component */}
      <InterstitialAdComponent
        visible={showAd}
        onClose={() => {
          setShowAd(false);
          onBack();
        }}
        onAdComplete={handleAdComplete}
      />
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
  selectorContainer: {
    flex: 1,
    padding: 20,
  },
  selectorTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectorSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  datasetList: {
    paddingBottom: 20,
  },
  datasetCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  datasetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  datasetCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  datasetCardStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  datasetCardStat: {
    color: '#aaa',
    fontSize: 12,
  },
  datasetCardDate: {
    color: '#888',
    fontSize: 11,
    marginTop: 8,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#53C691',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});