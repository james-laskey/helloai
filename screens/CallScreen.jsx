// screens/CallScreen.js

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import Ionicons from '@react-native-vector-icons/ionicons';
import { FloatingTextInput } from '../components/FloatingTextInput';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';
import { formatDuration, getLanguageSpeechCode } from '../utils/helpers';
import { StatsModal } from './StatsModal';

const { height, width } = Dimensions.get('window');

export const CallScreen = ({ 
  selectedLanguage, 
  selectedTopic, 
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
  onFetchStats
}) => {
  const isMounted = useRef(true);
  const speakingAnimation = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef();
  
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  
  // Speech recognition language code
  const speechLanguage = getLanguageSpeechCode(selectedLanguage);

  // Set up speech recognition event listeners
  useSpeechRecognitionEvent('start', () => {
    if (!isMounted.current) return;
    console.log('Speech recognition started');
    setIsListening(true);
  });

  useSpeechRecognitionEvent('end', () => {
    if (!isMounted.current) return;
    console.log('Speech recognition ended');
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    if (!isMounted.current) return;
    const resultText = event.results[0]?.transcript;
    if (resultText) {
      setTranscript(resultText);
      onInputChange(resultText);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (!isMounted.current) return;
    console.log('Speech error:', event.error, event.message);
    setIsListening(false);
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      Speech.stop();
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    if (!isMounted.current) return;
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs microphone access for voice conversations with your tutor.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsVoiceSupported(false);
          Alert.alert('Permission Denied', 'Please enable microphone permission to use voice input.');
        }
      } catch (err) {
        console.warn(err);
        setIsVoiceSupported(false);
      }
    }
  };

  // Start listening for voice input
  const startListening = async () => {
    if (!isMounted.current) return;
    if (!isVoiceSupported || isMuted || isLoading || isSpeaking || isListening) return;
    
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      console.warn('Permissions not granted');
      return;
    }
    
    ExpoSpeechRecognitionModule.start({
      lang: speechLanguage,
      interimResults: true,
      continuous: false,
    });
  };

  // Stop listening
  const stopListening = () => {
    if (!isMounted.current) return;
    if (!isListening) return;
    ExpoSpeechRecognitionModule.stop();
  };

  // Request permissions on mount
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  // Manual voice toggle
  const handleManualVoiceToggle = async () => {
    if (!isMounted.current) return;
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  // Handle manual message send
  const handleSendMessage = async () => {
    if (!isMounted.current) return;
    
    if (isListening) {
      await stopListening();
    }
    
    onSendMessage();
    setIsTextInputVisible(false);
  };

  // Handle text input change
  const handleInputChange = (text) => {
    if (!isMounted.current) return;
    onInputChange(text);
  };

  // Repeat the last tutor message
  const repeatLastTutorMessage = async () => {
    if (!isMounted.current) return;
    
    // Find the last tutor message (assistant)
    const lastTutorMessage = [...messages].reverse().find(msg => !msg.isUser);
    
    if (lastTutorMessage && lastTutorMessage.text) {
      await Speech.stop();
      await Speech.speak(lastTutorMessage.text, {
        language: getLanguageSpeechCode(selectedLanguage),
        pitch: 1.0,
        rate: 0.9,
      });
    }
  };

  // Speaking animation
  useEffect(() => {
    if (!isMounted.current) return;
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(speakingAnimation, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(speakingAnimation, { toValue: 1, duration: 500, useNativeDriver: true })
        ])
      ).start();
    } else {
      speakingAnimation.setValue(1);
    }
  }, [isSpeaking]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!isMounted.current) return;
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // Find the last tutor message to determine if repeat button should be shown
  const lastTutorMessage = [...messages].reverse().find(msg => !msg.isUser);
  const shouldShowRepeatButton = lastTutorMessage && !isLoading && !isSpeaking;

  return (
    <SafeAreaView style={styles.callContainer}>
      <StatusBar barStyle="light-content" />
      <StatsModal visible={showStats} onClose={onToggleStats} userStats={userStats} />
      <View style={styles.backgroundGradient} />
      
      <View style={styles.callUI}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onEndCall} style={styles.endCallButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.callInfo}>
            <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
            <View style={styles.topicBadge}>
              <Text style={styles.topicBadgeText}>{selectedTopic?.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onFetchStats} style={styles.statsButton}>
            <Ionicons name="stats-chart" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoContainer}>
          <View style={styles.tutorVideoFrame}>
            <Animated.View style={[styles.tutorAvatarContainer, { transform: [{ scale: speakingAnimation }] }]}>
              <View style={styles.tutorAvatar}>
                <Text style={styles.tutorAvatarEmoji}>{LANGUAGE_TOPICS[selectedLanguage]?.icon || '👩‍🏫'}</Text>
              </View>
            </Animated.View>
            <Text style={styles.tutorName}>{selectedLanguage} Tutor</Text>
            <Text style={styles.topicFocus}>Focus: {selectedTopic?.name}</Text>
          </View>
        </View>
        
        {/* Fixed Control Buttons Column */}
        <View style={styles.controlButtonsColumn}>
          <TouchableOpacity
            style={[styles.controlColumnButton, isMuted && styles.activeButton]}
            onPress={onToggleMute}
          >
            <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
            <Text style={styles.controlColumnLabel}>{isMuted ? "Muted" : "Mute"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlColumnButton, isListening && styles.activeButton]}
            onPress={handleManualVoiceToggle}
          >
            <Ionicons name={isListening ? "stop-circle" : "mic-circle"} size={24} color="#fff" />
            <Text style={styles.controlColumnLabel}>{isListening ? "Stop" : "Voice"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlColumnButton}
            onPress={onStopSpeaking}
          >
            <Ionicons name="volume-high" size={24} color="#fff" />
            <Text style={styles.controlColumnLabel}>Volume</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlColumnButton, styles.endCallColumnButton]}
            onPress={onEndCall}
          >
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.controlColumnLabel}>End</Text>
          </TouchableOpacity>
        </View>
        
        {/* Taller Transcript Box */}
        <View style={styles.captionsContainer}>
          <View style={styles.captionsHeader}>
            <Ionicons name="chatbubbles" size={16} color="#888" />
            <Text style={styles.captionsHeaderText}>Live Transcript</Text>
            {isListening && (
              <View style={styles.voiceBadge}>
                <Ionicons name="mic" size={12} color="#53C691" />
                <Text style={styles.voiceBadgeText}>Voice Active</Text>
              </View>
            )}
          </View>
          
          <ScrollView 
            ref={scrollViewRef} 
            style={styles.transcriptScroll} 
            contentContainerStyle={styles.transcriptContent}
            showsVerticalScrollIndicator={true}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyTranscript}>
                <Text style={styles.emptyTranscriptText}>Tap the Voice button and start speaking to begin!</Text>
              </View>
            ) : (
              messages.map((message, index) => {
                const isLastTutorMessage = !message.isUser && index === messages.length - 1;
                return (
                  <View key={message.id}>
                    <View style={[styles.transcriptMessage, message.isUser ? styles.userTranscript : styles.tutorTranscript]}>
                      <View style={styles.messageHeader}>
                        <Text style={styles.messageSpeaker}>{message.isUser ? 'You' : selectedLanguage + ' Tutor'}</Text>
                        <Text style={styles.messageTime}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                      <Text style={styles.messageText}>{message.text}</Text>
                    </View>
                    {/* Repeat button for the last tutor message */}
                    {isLastTutorMessage && !message.isUser && shouldShowRepeatButton && (
                      <TouchableOpacity 
                        style={styles.repeatButton}
                        onPress={repeatLastTutorMessage}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="repeat-outline" size={16} color="#53C691" />
                        <Text style={styles.repeatButtonText}>Repeat</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
            {isLoading && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Tutor is typing...</Text>
                <ActivityIndicator size="small" color="#53C691" />
              </View>
            )}
          </ScrollView>
        </View>
        {/* Floating Text Input Modal */}
        <FloatingTextInput
        inputText={inputText}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isListening={isListening}
        placeholder="Type a message..."
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  callContainer: { flex: 1, backgroundColor: '#6C67F2' },
  backgroundGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: '#6C67F2' },
  callUI: { flex: 1, position: 'relative' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 10 },
  endCallButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  statsButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  callInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  callDuration: { color: '#fff', fontSize: 18, fontWeight: '600' },
  topicBadge: { backgroundColor: '#6C67F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  topicBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  videoContainer: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 16,
  },
  tutorVideoFrame: { alignItems: 'center', justifyContent: 'center' },
  tutorAvatarContainer: { alignItems: 'center' },
  tutorAvatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#2a2a3e', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    borderColor: '#53C691' 
  },
  tutorAvatarEmoji: { fontSize: 40 },
  tutorName: { color: '#fff', fontSize: 24, fontWeight: '600', marginTop: 12 },
  topicFocus: { color: '#383838', fontSize: 14, marginTop: 4 },
  
  // Fixed Control Buttons Column - Right side of screen
  controlButtonsColumn: {
    position: 'absolute',
    right: 12,
    top: '40%',
    transform: [{ translateY: -100 }],
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 30,
    padding: 8,
    gap: 8,
    zIndex: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  controlColumnButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    gap: 2,
  },
  activeButton: {
    backgroundColor: '#53C691',
  },
  endCallColumnButton: {
    backgroundColor: '#ff3b30',
  },
  controlColumnLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '500',
  },
  
  // Taller transcript container
  captionsContainer: { 
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    marginTop: 8,
    minHeight: 200,
  },
  captionsHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333', 
    gap: 8 
  },
  captionsHeaderText: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  voiceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#53C691', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, gap: 4 },
  voiceBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  
  transcriptScroll: { 
    flex: 1,
  },
  transcriptContent: { 
    padding: 12, 
    paddingBottom: 20,
    flexGrow: 1,
  },
  transcriptMessage: { marginBottom: 8, padding: 10, borderRadius: 12 },
  userTranscript: { backgroundColor: '#6C67F2', alignSelf: 'flex-end', maxWidth: '85%' },
  tutorTranscript: { backgroundColor: '#383838', alignSelf: 'flex-start', maxWidth: '85%' },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  messageSpeaker: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },
  messageTime: { color: 'rgba(255,255,255,0.5)', fontSize: 9 },
  messageText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(83, 198, 145, 0.15)',
    borderRadius: 20,
    gap: 6,
  },
  repeatButtonText: {
    color: '#53C691',
    fontSize: 12,
    fontWeight: '500',
  },
  
  emptyTranscript: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTranscriptText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: '#2a2a3e', borderRadius: 12, alignSelf: 'flex-start' },
  typingText: { color: '#888', fontSize: 12 },
  
  // Floating Text Input Button
  floatingTextButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#53C691',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    gap: 2,
  },
  floatingTextButtonLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  
  // Floating Input Modal
  floatingInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    zIndex: 30,
  },
  floatingInputWrapper: {
    gap: 12,
  },
  floatingInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  floatingInputTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingTextInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    maxHeight: 120,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  floatingSendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingVertical: 12,
    gap: 8,
  },
  floatingSendButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  floatingSendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});