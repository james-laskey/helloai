import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  PermissionsAndroid
} from 'react-native';
import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import Ionicons from '@react-native-vector-icons/ionicons';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';
import { formatDuration, getLanguageSpeechCode } from '../utils/helpers';
import { StatsModal } from './StatsModal';

const { height } = Dimensions.get('window');

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
  const speakingAnimation = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef();
  
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  
  // Speech recognition language code
  const speechLanguage = getLanguageSpeechCode(selectedLanguage);

  // Set up speech recognition event listeners
  useSpeechRecognitionEvent('start', () => {
    console.log('Speech recognition started');
    setIsListening(true);
  });

  useSpeechRecognitionEvent('end', () => {
    console.log('Speech recognition ended');
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const resultText = event.results[0]?.transcript;
    if (resultText) {
      setTranscript(resultText);
      onInputChange(resultText);
      
      // Auto-send after speech ends
      if (event.isFinal) {
        setTimeout(() => {
          if (resultText.trim() && !isLoading) {
            onSendMessage();
          }
        }, 500);
      }
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('Speech error:', event.error, event.message);
    setIsListening(false);
  });

  // Request microphone permission
  const requestMicrophonePermission = async () => {
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
    if (!isVoiceSupported || isMuted || isLoading || isSpeaking || isListening) return;
    
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      console.warn('Permissions not granted');
      return;
    }
    
    ExpoSpeechRecognitionModule.start({
      lang: speechLanguage,
      interimResults: true,
      continuous: false, // Auto-stops after silence
    });
  };

  // Stop listening
  const stopListening = () => {
    if (!isListening) return;
    ExpoSpeechRecognitionModule.stop();
  };

  // Auto-start listening when tutor finishes speaking
  useEffect(() => {
    if (!isSpeaking && !isLoading && !isMuted && !isListening && isVoiceSupported) {
      const timer = setTimeout(startListening, 500);
      return () => clearTimeout(timer);
    }
    
    if (isSpeaking && isListening) {
      stopListening();
    }
  }, [isSpeaking, isLoading, isMuted, isVoiceSupported]);

  // Request permissions on mount
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  // Manual voice toggle (for mute button override)
  const handleManualVoiceToggle = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  // Handle manual message send (disables listening temporarily)
  const handleSendMessage = async () => {
    if (isListening) {
      await stopListening();
    }
    onSendMessage();
    
    // Resume listening after tutor responds
    setTimeout(() => {
      if (!isSpeaking && !isLoading && !isMuted) {
        startListening();
      }
    }, 1000);
  };

  // Speaking animation
  useEffect(() => {
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
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

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
        
        {/* Voice Listening Indicator */}
        {isListening && !isMuted && !isLoading && (
          <View style={styles.listeningIndicator}>
            <Animated.View style={styles.listeningPulse} />
            <Ionicons name="mic" size={20} color="#53C691" />
            <Text style={styles.listeningText}>Listening...</Text>
          </View>
        )}
        
        <View style={styles.videoContainer}>
          <View style={styles.tutorVideoFrame}>
            <Animated.View style={[styles.tutorAvatarContainer, { transform: [{ scale: speakingAnimation }] }]}>
              <View style={styles.tutorAvatar}>
                <Text style={styles.tutorAvatarEmoji}>{LANGUAGE_TOPICS[selectedLanguage]?.icon || '👩‍🏫'}</Text>
              </View>
            </Animated.View>
            <Text style={styles.tutorName}>{selectedLanguage} Tutor</Text>
            <Text style={styles.topicFocus}>Focus: {selectedTopic?.name}</Text>
            <Text style={styles.tutorStatus}>
              {isSpeaking ? '🔴 Speaking' : isLoading ? '🤔 Thinking...' : isListening ? '🎙️ Listening to you...' : '🎧 Ready to listen'}
            </Text>
          </View>
          
          <View style={styles.selfView}>
            <View style={[styles.selfAvatar, isListening && styles.selfAvatarListening]}>
              <Text style={styles.selfAvatarEmoji}>{isListening ? '🎙️' : '👤'}</Text>
            </View>
            <Text style={styles.selfName}>{isListening ? 'Speaking...' : 'You'}</Text>
          </View>
        </View>
        
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
          
          <ScrollView ref={scrollViewRef} style={styles.transcriptScroll} contentContainerStyle={styles.transcriptContent}>
            {messages.map((message) => (
              <View key={message.id} style={[styles.transcriptMessage, message.isUser ? styles.userTranscript : styles.tutorTranscript]}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSpeaker}>{message.isUser ? 'You' : selectedLanguage + ' Tutor'}</Text>
                  <Text style={styles.messageTime}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
            {isLoading && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Tutor is typing...</Text>
                <ActivityIndicator size="small" color="#53C691" />
              </View>
            )}
          </ScrollView>
        </View>
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <View style={styles.controlsContainer}>
            <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButton} onPress={onToggleMute}>
                <View style={[styles.controlIcon, isMuted && styles.controlIconActive]}>
                  <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color={isMuted ? "#ff4444" : "#fff"} />
                </View>
                <Text style={styles.controlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={handleManualVoiceToggle}>
                <View style={[styles.controlIcon, isListening && styles.controlIconListening]}>
                  <Ionicons name={isListening ? "stop-circle" : "ear"} size={24} color="#fff" />
                </View>
                <Text style={styles.controlLabel}>{isListening ? "Stop Listen" : "Voice"}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={onStopSpeaking}>
                <View style={styles.controlIcon}>
                  <Ionicons name="volume-high" size={24} color="#fff" />
                </View>
                <Text style={styles.controlLabel}>Volume</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.endCallControl} onPress={onEndCall}>
                <View style={styles.endCallIcon}>
                  <Ionicons name="call" size={28} color="#fff" />
                </View>
                <Text style={styles.endCallLabel}>End</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                value={inputText}
                onChangeText={onInputChange}
                placeholder={isListening ? "Voice input active... speak now" : "Type your response..."}
                placeholderTextColor="#666"
                multiline
                maxLength={300}
                editable={!isLoading && !isListening}
              />
              <TouchableOpacity
                style={[
                  styles.sendMessageButton, 
                  ((!inputText.trim() && !isListening) || isLoading) && styles.sendMessageButtonDisabled,
                  isListening && styles.voiceActiveButton
                ]}
                onPress={handleSendMessage}
                disabled={(!inputText.trim() && !isListening) || isLoading}
              >
                <Ionicons name={isListening ? "mic" : "send"} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  callContainer: { flex: 1, backgroundColor: '#6C67F2' },
  backgroundGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: '#6C67F2' },
  callUI: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 10 },
  endCallButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  statsButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  callInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  callDuration: { color: '#fff', fontSize: 18, fontWeight: '600' },
  topicBadge: { backgroundColor: '#6C67F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  topicBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  // Listening indicator
  listeningIndicator: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    zIndex: 10,
    gap: 8,
  },
  listeningPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#53C691',
    opacity: 0.3,
  },
  listeningText: { color: '#53C691', fontSize: 14, fontWeight: '600' },
  
  videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  tutorVideoFrame: { alignItems: 'center', justifyContent: 'center' },
  tutorAvatarContainer: { alignItems: 'center' },
  tutorAvatar: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#2a2a3e', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#53C691' },
  tutorAvatarEmoji: { fontSize: 80 },
  tutorName: { color: '#fff', fontSize: 24, fontWeight: '600', marginTop: 20 },
  topicFocus: { color: '#383838', fontSize: 14, marginTop: 4 },
  tutorStatus: { color: '#888', fontSize: 14, marginTop: 8 },
  
  selfView: { position: 'absolute', bottom: 20, right: 20, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#444' },
  selfAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2a2a3e', justifyContent: 'center', alignItems: 'center' },
  selfAvatarListening: { backgroundColor: '#53C691', borderWidth: 2, borderColor: '#fff' },
  selfAvatarEmoji: { fontSize: 30 },
  selfName: { color: '#fff', fontSize: 12, marginTop: 4 },
  
  captionsContainer: { backgroundColor: 'rgba(0,0,0,0.8)', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.3, marginTop: 20 },
  captionsHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333', gap: 8 },
  captionsHeaderText: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1 },
  voiceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#53C691', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, gap: 4 },
  voiceBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  
  transcriptScroll: { maxHeight: 200 },
  transcriptContent: { padding: 16 },
  transcriptMessage: { marginBottom: 16, padding: 12, borderRadius: 12 },
  userTranscript: { backgroundColor: '#6C67F2', alignSelf: 'flex-end' },
  tutorTranscript: { backgroundColor: '#383838', alignSelf: 'flex-start' },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  messageSpeaker: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  messageTime: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  messageText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#2a2a3e', borderRadius: 12, alignSelf: 'flex-start' },
  typingText: { color: '#888', fontSize: 12 },
  
  controlsContainer: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
  controlButtons: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 16 },
  controlButton: { alignItems: 'center', gap: 8 },
  controlIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  controlIconActive: { backgroundColor: '#ff4444' },
  controlIconListening: { backgroundColor: '#53C691' },
  controlLabel: { color: '#fff', fontSize: 12 },
  endCallControl: { alignItems: 'center', gap: 8 },
  endCallIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ff3b30', justifyContent: 'center', alignItems: 'center' },
  endCallLabel: { color: '#ff3b30', fontSize: 12, fontWeight: '600' },
  
  messageInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#1a1a1a', borderRadius: 30, paddingHorizontal: 16, paddingVertical: 8 },
  messageInput: { flex: 1, color: '#fff', fontSize: 16, maxHeight: 80 },
  sendMessageButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  sendMessageButtonDisabled: { backgroundColor: '#555', opacity: 0.5 },
  voiceActiveButton: { backgroundColor: '#53C691' },
});