import React, { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import mobileAds from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthScreen } from './screens/AuthScreen';
import { QuestionnaireScreen } from './screens/QuestionnaireScreen';
import { TopicSelectionScreen } from './screens/TopicSelectionScreen';
import { LearningScreen } from './screens/LearningScreen';
import { api } from './services/api';
import { getLanguageSpeechCode } from './utils/helpers';
import { LANGUAGE_TOPICS } from './constants/languageTopics';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicSet, setIsTopicSet] = useState(false);
  const [learningMode, setLearningMode] = useState(null); // 'tutor', 'flashcards', 'quiz'
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [userStats, setUserStats] = useState(null);
  
  const timerRef = useRef(null);

  // Load saved user data on startup
  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    // Initialize the Google Mobile Ads SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Mobile Ads SDK initialized');
      });
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      const savedUserId = await AsyncStorage.getItem('userId'); // Load user ID

      if (savedUser && savedPreferences) {
        setUserData(JSON.parse(savedUser));
        setUserPreferences(JSON.parse(savedPreferences));
        setUserId(savedUserId || JSON.parse(savedUser).id);
        setIsAuthenticated(true);
        setHasCompletedQuestionnaire(true);
        setSelectedLanguage(JSON.parse(savedPreferences).targetLanguage);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleAuthComplete = async (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    await AsyncStorage.setItem('userId', user.id); // Store for persistence
  };

  const handleQuestionnaireComplete = async (preferences) => {
    setUserPreferences(preferences);
    setHasCompletedQuestionnaire(true);
    setSelectedLanguage(preferences.targetLanguage);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  // Helper function to create personalized introductions
  const createPersonalizedIntroduction = (topic, language) => {
    const languageIcon = LANGUAGE_TOPICS[language]?.icon || '📚';
    const proficiencyLevel = userPreferences?.proficiencyLevel || 5;
    
    if (proficiencyLevel <= 3) {
      return `📖 ${languageIcon} Hello! Today we learn "${topic.name}". ${topic.description}. Example: "${topic.example}". Ready? Let's start!`;
    } else if (proficiencyLevel <= 7) {
      return `👋 ${languageIcon} Great choice! Today we'll explore "${topic.name}" - ${topic.description}. For example: "${topic.example}". Shall we begin?`;
    } else {
      return `✨ ${languageIcon} Excellent selection! Today's topic is "${topic.name}". ${topic.description}. Let me share an example: "${topic.example}". Ready to dive deeper?`;
    }
  };

  // Start AI Tutor session
  const handleStartTutor = async (topic) => {
    setSelectedTopic(topic);
    setLearningMode('tutor');
    setIsTopicSet(true);
    setIsCallActive(true);
    setIsLoading(true);
    
    try {
      const data = await api.startSession(
        selectedLanguage, 
        userId, 
        topic.id,
        topic.name,
        topic.concept,
        topic.example,
        userPreferences
      );
      
      setSessionId(data.sessionId);
      
      const introduction = data.message || createPersonalizedIntroduction(topic, selectedLanguage);
      
      const tutorMessage = {
        id: Date.now().toString(),
        text: introduction,
        isUser: false,
        timestamp: Date.now(),
      };
      
      setMessages([tutorMessage]);
      await speakText(introduction);
    } catch (error) {
      console.error('Error starting tutor session:', error);
      const errorMessage = `I'm sorry, I'm having trouble starting the lesson on ${topic.name}. Let me try again.`;
      
      const errorTutorMessage = {
        id: Date.now().toString(),
        text: errorMessage,
        isUser: false,
        timestamp: Date.now(),
      };
      
      setMessages([errorTutorMessage]);
      await speakText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Flashcards
  const handleStartFlashcards = (topic) => {
    setSelectedTopic(topic);
    setLearningMode('flashcards');
    setIsTopicSet(true);
  };

  // Start Quiz
  const handleStartQuiz = (topic) => {
    setSelectedTopic(topic);
    setLearningMode('quiz');
    setIsTopicSet(true);
  };

  const generateResponse = async (userInput) => {
    setIsLoading(true);
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const response = await api.sendMessage(
        sessionId, 
        userId,
        userInput, 
        selectedLanguage, 
        selectedTopic, 
        conversationHistory
      );
      
      const assistantMessage = {
        id: Date.now().toString(),
        text: response,
        isUser: false,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      // // ✅ Track message count on server
      // await api.updateSessionActivity(sessionId, {
      //   messageCount: messages.length + 1,
      //   duration: callDuration
      // });
      await speakText(response);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = "I didn't catch that. Can you try again?";
      setMessages(prev => [...prev, { id: Date.now().toString(), text: errorMessage, isUser: false, timestamp: Date.now() }]);
      await speakText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async (newPreferences) => {
    setUserPreferences(newPreferences);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    if (newPreferences.targetLanguage !== selectedLanguage) {
      setSelectedLanguage(newPreferences.targetLanguage);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userPreferences');
    setIsAuthenticated(false);
    setHasCompletedQuestionnaire(false);
    setUserData(null);
    setUserPreferences(null);
    setSelectedLanguage('Spanish');
    setSelectedTopic(null);
    setIsTopicSet(false);
    setLearningMode(null);
    setMessages([]);
    setSessionId(null);
  };

  // Timer effect
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isCallActive]);
  
  const speakText = async (text) => {
    if (isMuted) return;
    try {
      await Speech.stop();
      
      let rate = 0.9;
      let pitch = 1.0;
      
      if (userPreferences) {
        if (userPreferences.proficiencyLevel <= 3) {
          rate = 0.6;
        } else if (userPreferences.proficiencyLevel <= 6) {
          rate = 0.8;
        } else {
          rate = 0.9;
        }
        
        if (userPreferences.targetLanguage === 'Japanese' || userPreferences.targetLanguage === 'Korean') {
          pitch = 1.05;
        }
      }
      
      await Speech.speak(text, {
        language: getLanguageSpeechCode(selectedLanguage),
        pitch: pitch,
        rate: rate,
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };
  
  const stopSpeaking = async () => {
    await Speech.stop();
    setIsSpeaking(false);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) stopSpeaking();
  };
  
  const fetchStats = async () => {
    if (!userId) return;
    console.log('Fetching stats for userId:', userId);
    const stats = await api.fetchStats(userId);
    console.log('Stats received:', stats);
    setUserStats(stats);
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    await generateResponse(currentInput);
  };
  
  const handleEndCall = async () => {
    setIsCallActive(false);
    console.log('Session ID:', sessionId);
    console.log('User ID:', userId);
    console.log('Call Duration:', callDuration);
    await api.endSession(sessionId, userId);
    stopSpeaking();
    handleBackToTopics();
  };
  
  const handleBackToTopics = () => {
    setIsTopicSet(false);
    setSelectedTopic(null);
    setLearningMode(null);
    setMessages([]);
    setSessionId(null);
    setInputText('');
    setIsLoading(false);
    setIsSpeaking(false);
    // Refresh stats when returning to topics
    fetchStats();
  };
  
  const toggleStats = () => setShowStats(!showStats);
  
  // Screen routing based on user state
  if (!isAuthenticated) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }
  
  if (!hasCompletedQuestionnaire) {
    return <QuestionnaireScreen userData={userData} onComplete={handleQuestionnaireComplete} />;
  }
  
  if (!isTopicSet) {
    return (
      <TopicSelectionScreen
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        onStartTutor={handleStartTutor}
        onStartFlashcards={handleStartFlashcards}
        onStartQuiz={handleStartQuiz}
        userStats={userStats}
        showStats={showStats}
        onToggleStats={toggleStats}
        onFetchStats={fetchStats}
        userPreferences={userPreferences}
        onUpdatePreferences={handleUpdatePreferences}
        onLogout={handleLogout}
      />
    );
  }
  
  // Once a topic is selected, show the LearningScreen with the selected mode
  return (
    <LearningScreen
      mode={learningMode}
      selectedLanguage={selectedLanguage}
      selectedTopic={selectedTopic}
      userPreferences={userPreferences}
      onBack={handleBackToTopics}
      // CallScreen props (only used when mode='tutor')
      messages={messages}
      isLoading={isLoading}
      isSpeaking={isSpeaking}
      isMuted={isMuted}
      callDuration={callDuration}
      inputText={inputText}
      onInputChange={setInputText}
      onSendMessage={handleSendMessage}
      onEndCall={handleEndCall}
      onToggleMute={toggleMute}
      onStopSpeaking={stopSpeaking}
      userStats={userStats}
      showStats={showStats}
      onToggleStats={toggleStats}
      onFetchStats={fetchStats}
      sessionId={sessionId}
      setSessionId={setSessionId}
      setIsTopicSet={setIsTopicSet}
      setMessages={setMessages}
      setSelectedTopic={setSelectedTopic}
    />
  );
};

export default App;