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
import { TopicCard } from '../components/TopicCard';
import { SettingsModal } from '../components/SettingsModal';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';
import { StatsModal } from './StatsModal';

export const TopicSelectionScreen = ({ 
  selectedLanguage, 
  onSelectLanguage, 
  onSelectTopic, 
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
          <TouchableOpacity onPress={onToggleStats} style={styles.iconButton}>
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
          <TopicCard 
            topic={item} 
            languageColor={currentLanguageData?.color} 
            onPress={onSelectTopic}
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
});