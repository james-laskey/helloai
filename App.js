import React, { useState, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthScreen } from './screens/AuthScreen';
import { QuestionnaireScreen } from './screens/QuestionnaireScreen';
import { TopicSelectionScreen } from './screens/TopicSelectionScreen';
import { CallScreen } from './screens/CallScreen';
import { api } from './services/api';
import { getLanguageSpeechCode } from './utils/helpers';
import { LANGUAGE_TOPICS } from './constants/languageTopics';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isTopicSet, setIsTopicSet] = useState(false);
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
  const [userId] = useState(`user_${Date.now()}`);
  
  const timerRef = useRef(null);

  // Load saved user data on startup
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      
      if (savedUser && savedPreferences) {
        setUserData(JSON.parse(savedUser));
        setUserPreferences(JSON.parse(savedPreferences));
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
  };

  const handleQuestionnaireComplete = async (preferences) => {
    setUserPreferences(preferences);
    setHasCompletedQuestionnaire(true);
    setSelectedLanguage(preferences.targetLanguage);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  // REMOVED: getPersonalizedSystemPrompt() - Now handled server-side

  // Helper function to create personalized introductions
  const createPersonalizedIntroduction = (topic, language) => {
    const languageIcon = LANGUAGE_TOPICS[language]?.icon || '📚';
    const proficiencyLevel = userPreferences?.proficiencyLevel || 5;
    
    // Adjust introduction based on proficiency level
    if (proficiencyLevel <= 3) {
      return `📖 ${languageIcon} Hello! Today we learn "${topic.name}". ${topic.description}. Example: "${topic.example}". Ready? Let's start!`;
    } else if (proficiencyLevel <= 7) {
      return `👋 ${languageIcon} Great choice! Today we'll explore "${topic.name}" - ${topic.description}. For example: "${topic.example}". Shall we begin?`;
    } else {
      return `✨ ${languageIcon} Excellent selection! Today's topic is "${topic.name}". ${topic.description}. Let me share an example: "${topic.example}". Ready to dive deeper?`;
    }
  };

  // Handle topic selection and start the tutoring session
  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setIsTopicSet(true);
    setIsCallActive(true);
    setIsLoading(true);
    
    try {
      // Pass user preferences to server - server generates the prompt
      const data = await api.startSession(
        selectedLanguage, 
        userId, 
        topic.id,
        topic.name,
        topic.concept,
        topic.example,
        userPreferences // Pass raw preferences, server generates prompt
      );
      
      setSessionId(data.sessionId);
      
      // Create a personalized introduction based on the topic and user preferences
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
      console.error('Error starting topic session:', error);
      const errorMessage = `I'm sorry, I'm having trouble starting the lesson on ${topic.name}. Let me try again. What would you like to learn?`;
      
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

  // Updated generateResponse - no longer sends system prompt (server uses stored one)
  const generateResponse = async (userInput) => {
    setIsLoading(true);
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Removed the systemPrompt parameter - server uses the one stored during session start
      const response = await api.sendMessage(
        sessionId, 
        userInput, 
        selectedLanguage, 
        selectedTopic, 
        conversationHistory
        // No systemPrompt parameter anymore
      );
      
      const assistantMessage = {
        id: Date.now().toString(),
        text: response,
        isUser: false,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
    // Optionally update selected language if changed
    if (newPreferences.targetLanguage !== selectedLanguage) {
      setSelectedLanguage(newPreferences.targetLanguage);
    }
  };

  const handleLogout = async () => {
    // Clear stored user data
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userPreferences');
    // Reset app state
    setIsAuthenticated(false);
    setHasCompletedQuestionnaire(false);
    setUserData(null);
    setUserPreferences(null);
    setSelectedLanguage('Spanish');
    setSelectedTopic(null);
    setIsTopicSet(false);
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
      
      // Adjust speech parameters based on proficiency and native language
      let rate = 0.9;
      let pitch = 1.0;
      
      if (userPreferences) {
        // Slower speech for beginners
        if (userPreferences.proficiencyLevel <= 3) {
          rate = 0.6;
        } else if (userPreferences.proficiencyLevel <= 6) {
          rate = 0.8;
        } else {
          rate = 0.9;
        }
        
        // Slightly higher pitch for certain languages (optional)
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
    const stats = await api.fetchStats(userId);
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
    await api.endSession(sessionId);
    stopSpeaking();
    setIsTopicSet(false);
    setMessages([]);
    setSelectedTopic(null);
    setSessionId(null);
    await fetchStats();
    setShowStats(true);
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
      onSelectTopic={handleTopicSelect}
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
      onInputChange={setInputText}
      onSendMessage={handleSendMessage}
      onEndCall={handleEndCall}
      onToggleMute={toggleMute}
      onStopSpeaking={stopSpeaking}
      userStats={userStats}
      showStats={showStats}
      onToggleStats={toggleStats}
      onFetchStats={fetchStats}
    />
  );
};

export default App;