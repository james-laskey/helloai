// screens/StatsModal.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export const StatsModal = ({ visible, onClose, userStats }) => {
  const [loading, setLoading] = useState(true);
  const [expandedLanguage, setExpandedLanguage] = useState(null);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }
  }, [visible, userStats]);

  if (!visible) return null;

  const languages = userStats?.languages || [];

  const renderOverallStats = () => (
    <View style={styles.overallContainer}>
      <Text style={styles.overallTitle}>Overall Progress</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Ionicons name="time-outline" size={24} color="#53C691" />
          <Text style={styles.statBoxValue}>{userStats?.total_duration_formatted || '0m'}</Text>
          <Text style={styles.statBoxLabel}>Total Time</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="chatbubbles-outline" size={24} color="#6C67F2" />
          <Text style={styles.statBoxValue}>{userStats?.total_sessions || 0}</Text>
          <Text style={styles.statBoxLabel}>Sessions</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="help-buoy" size={24} color="#FF8C00" />
          <Text style={styles.statBoxValue}>{userStats?.total_quizzes_completed || 0}</Text>
          <Text style={styles.statBoxLabel}>Quizzes</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="card" size={24} color="#6C67F2" />
          <Text style={styles.statBoxValue}>{userStats?.total_flashcards_mastered || 0}</Text>
          <Text style={styles.statBoxLabel}>Cards Mastered</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="stats-chart" size={24} color="#007AFF" />
          <Text style={styles.statBoxValue}>{userStats?.overall_average_quiz_score || 0}%</Text>
          <Text style={styles.statBoxLabel}>Avg Quiz Score</Text>
        </View>
      </View>
    </View>
  );

  const renderLanguageItem = ({ item: lang }) => {
    const isExpanded = expandedLanguage === lang.language;
    
    return (
      <TouchableOpacity 
        style={styles.languageCard}
        activeOpacity={0.8}
        onPress={() => setExpandedLanguage(isExpanded ? null : lang.language)}
      >
        <View style={styles.languageCardHeader}>
          <View style={styles.languageTitleContainer}>
            <Text style={styles.languageIcon}>
              {lang.language === 'Spanish' ? '🇪🇸' : 
               lang.language === 'French' ? '🇫🇷' :
               lang.language === 'Japanese' ? '🇯🇵' :
               lang.language === 'Korean' ? '🇰🇷' :
               lang.language === 'German' ? '🇩🇪' :
               lang.language === 'Italian' ? '🇮🇹' :
               lang.language === 'English' ? '🇬🇧' :
               lang.language === 'Chinese' ? '🇨🇳' : '🌐'}
            </Text>
            <Text style={styles.languageName}>{lang.language}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#888" 
          />
        </View>
        
        {/* Compact stats always visible */}
        <View style={styles.compactStats}>
          <View style={styles.compactStat}>
            <Ionicons name="time-outline" size={14} color="#53C691" />
            <Text style={styles.compactStatValue}>{lang.totalDurationFormatted || '0m'}</Text>
          </View>
          <View style={styles.compactStat}>
            <Ionicons name="chatbubbles-outline" size={14} color="#6C67F2" />
            <Text style={styles.compactStatValue}>{lang.totalSessions || 0}</Text>
          </View>
          <View style={styles.compactStat}>
            <Ionicons name="help-buoy" size={14} color="#FF8C00" />
            <Text style={styles.compactStatValue}>{lang.quizzesCompleted || 0}</Text>
          </View>
          <View style={styles.compactStat}>
            <Ionicons name="card" size={14} color="#6C67F2" />
            <Text style={styles.compactStatValue}>
              {lang.flashcardsMastered || 0}/{lang.totalFlashcards || 0}
            </Text>
          </View>
        </View>
        
        {/* Expanded details */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Messages</Text>
                <Text style={styles.detailValue}>{lang.totalMessages || 0}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Avg Score</Text>
                <Text style={styles.detailValue}>{Math.round(lang.averageQuizScore || 0)}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mastery</Text>
                <Text style={styles.detailValue}>
                  {lang.totalFlashcards > 0 
                    ? Math.round((lang.flashcardsMastered / lang.totalFlashcards) * 100)
                    : 0}%
                </Text>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Flashcard Mastery</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${lang.totalFlashcards > 0 
                        ? (lang.flashcardsMastered / lang.totalFlashcards) * 100 
                        : 0}%` 
                    }
                  ]} 
                />
              </View>
            </View>
            
            {lang.lastPracticed && (
              <Text style={styles.lastPracticed}>
                Last practiced: {new Date(lang.lastPracticed).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📊 Your Learning Stats</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator size="large" color="#53C691" style={styles.loader} />
            ) : (
              <>
                {renderOverallStats()}
                
                <View style={styles.languagesSection}>
                  <Text style={styles.sectionTitle}>Languages Practiced</Text>
                  {languages.length > 0 ? (
                    <FlatList
                      data={languages}
                      keyExtractor={(item) => item.language}
                      renderItem={renderLanguageItem}
                      scrollEnabled={false}
                      contentContainerStyle={styles.languagesList}
                    />
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="book-outline" size={48} color="rgba(255,255,255,0.3)" />
                      <Text style={styles.emptyText}>No language data yet</Text>
                      <Text style={styles.emptySubtext}>Complete a session to see your stats!</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.95)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#1a1a1a', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    maxHeight: '85%',
    minHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 50,
  },
  overallContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  overallTitle: {
    color: '#53C691',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statBoxValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statBoxLabel: {
    color: '#888',
    fontSize: 10,
    marginTop: 4,
  },
  languagesSection: {
    padding: 16,
  },
  sectionTitle: {
    color: '#53C691',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  languagesList: {
    gap: 12,
  },
  languageCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  languageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageIcon: {
    fontSize: 28,
  },
  languageName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  compactStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  compactStatValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#53C691',
    borderRadius: 3,
  },
  lastPracticed: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
});