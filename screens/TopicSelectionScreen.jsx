// screens/TopicSelectionScreen.js

import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { LanguageDropdown } from '../components/LanguageDropdown';
import { SettingsModal } from '../components/SettingsModal';
import { TopicCard } from '../components/TopicCard';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';
import { StatsModal } from './StatsModal';

export const TopicSelectionScreen = ({ 
  selectedLanguage, 
  onSelectLanguage, 
  onStartTutor,
  onStartFlashcards,
  onStartQuiz,
  userStats, 
  showStats, 
  onToggleStats,
  onFetchStats,
  userPreferences,
  onUpdatePreferences,
  onLogout
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const currentLanguageData = LANGUAGE_TOPICS[selectedLanguage];
  const topics = currentLanguageData?.topics || [];
  const handleStatsPress = async () => {
    console.log('Fetching stats...');
    await onFetchStats(); // Fetch latest data
    onToggleStats(); // Then show modal
  };
  // Custom TopicCard wrapper with action buttons
  const TopicCardWithActions = ({ topic, color }) => (
    <View style={styles.topicCardWrapper}>
      {/* Original TopicCard component */}
      <TopicCard 
        topic={topic} 
        languageColor={color} 
        onPress={onStartTutor}
      />
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.flashcardButton]}
          onPress={() => onStartFlashcards(topic)}
        >
          <Ionicons name="card" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Flashcards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.quizButton]}
          onPress={() => onStartQuiz(topic)}
        >
          <Ionicons name="help-buoy" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <StatsModal visible={showStats} onClose={onToggleStats} userStats={userStats} />
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        userPreferences={userPreferences}
        selectedLanguage={selectedLanguage}
        onUpdatePreferences={onUpdatePreferences}
        onLogout={onLogout}
      />
      
      <View style={styles.topBar}>
        <LanguageDropdown selectedLanguage={selectedLanguage} onSelectLanguage={onSelectLanguage} />
        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={handleStatsPress} style={styles.iconButton}>
            <Ionicons name="stats-chart" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconButton}>
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.headerSection}>
        <View style={styles.languageHeader}>
          <Text style={styles.languageHeaderIcon}>{currentLanguageData?.icon}</Text>
          <Text style={styles.languageHeaderTitle}>{selectedLanguage}</Text>
        </View>
        <View style={styles.logoContainer}>
          <Text style={styles.subtitle}>Choose a topic to practice</Text>
        </View>
      </View>
      
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TopicCardWithActions 
            topic={item} 
            color={currentLanguageData?.color} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.topicsList}
        style={styles.topicsContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#6C67F2' 
  },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 10, 
    paddingBottom: 10 
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerSection: {
    marginBottom: 16,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  languageHeaderIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  languageHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: { 
    alignItems: 'center', 
    marginTop: 10, 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 14, 
    color: 'rgba(255,255,255,0.7)' 
  },
  topicsContainer: {
    flex: 1,
  },
  topicsList: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  topicCardWrapper: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  flashcardButton: {
    backgroundColor: '#FF8C00',
  },
  quizButton: {
    backgroundColor: '#6C67F2',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});