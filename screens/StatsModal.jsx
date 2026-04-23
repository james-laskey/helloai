// screens/StatsModal.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export const StatsModal = ({ visible, onClose, userStats }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }
  }, [visible, userStats]);

  if (!visible) return null;

  const languages = userStats?.languages || [];
  const selectedLangData = selectedLanguage 
    ? languages.find(l => l.language === selectedLanguage) 
    : null;

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

  const renderLanguageSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
      <TouchableOpacity
        style={[styles.languageChip, !selectedLanguage && styles.languageChipActive]}
        onPress={() => setSelectedLanguage(null)}
      >
        <Text style={[styles.languageChipText, !selectedLanguage && styles.languageChipTextActive]}>
          All Languages
        </Text>
      </TouchableOpacity>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.language}
          style={[styles.languageChip, selectedLanguage === lang.language && styles.languageChipActive]}
          onPress={() => setSelectedLanguage(lang.language)}
        >
          <Text style={[styles.languageChipText, selectedLanguage === lang.language && styles.languageChipTextActive]}>
            {lang.language}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLanguageDetails = () => {
    if (!selectedLangData) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sessions</Text>
            <Text style={styles.detailValue}>{selectedLangData.totalSessions || 0}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Messages</Text>
            <Text style={styles.detailValue}>{selectedLangData.totalMessages || 0}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {Math.floor((selectedLangData.totalDurationSeconds || 0) / 60)}m
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Quizzes</Text>
            <Text style={styles.detailValue}>{selectedLangData.quizzesCompleted || 0}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Avg Score</Text>
            <Text style={styles.detailValue}>
              {Math.round(selectedLangData.averageQuizScore || 0)}%
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Flashcards</Text>
            <Text style={styles.detailValue}>
              {selectedLangData.flashcardsMastered || 0}/{selectedLangData.totalFlashcards || 0}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Flashcard Mastery</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((selectedLangData.flashcardsMastered || 0) / (selectedLangData.totalFlashcards || 1)) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercent}>
            {Math.round(((selectedLangData.flashcardsMastered || 0) / (selectedLangData.totalFlashcards || 1)) * 100)}% Mastered
          </Text>
        </View>

        {selectedLangData.lastPracticed && (
          <Text style={styles.lastPracticed}>
            Last practiced: {new Date(selectedLangData.lastPracticed).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  };

  const renderLanguageList = () => (
    <View style={styles.languageList}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.language}
          style={styles.languageCard}
          onPress={() => setSelectedLanguage(lang.language)}
        >
          <View style={styles.languageCardHeader}>
            <Text style={styles.languageName}>{lang.language}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
          <View style={styles.languageStats}>
            <View style={styles.languageStat}>
              <Ionicons name="time-outline" size={14} color="#888" />
              <Text style={styles.languageStatText}>
                {Math.floor((lang.totalDurationSeconds || 0) / 60)} min
              </Text>
            </View>
            <View style={styles.languageStat}>
              <Ionicons name="help-buoy" size={14} color="#888" />
              <Text style={styles.languageStatText}>{lang.quizzesCompleted || 0} quizzes</Text>
            </View>
            <View style={styles.languageStat}>
              <Ionicons name="card" size={14} color="#888" />
              <Text style={styles.languageStatText}>
                {lang.flashcardsMastered || 0}/{lang.totalFlashcards || 0} cards
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

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
                {renderLanguageSelector()}
                {selectedLanguage ? renderLanguageDetails() : renderLanguageList()}
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
    maxHeight: '90%',
    minHeight: '70%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 50,
  },
  overallContainer: {
    padding: 20,
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
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statBoxValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statBoxLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  languageScroll: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  languageChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 10,
  },
  languageChipActive: {
    backgroundColor: '#53C691',
  },
  languageChipText: {
    color: '#fff',
    fontSize: 14,
  },
  languageChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  languageList: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  languageCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  languageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  languageStats: {
    flexDirection: 'row',
    gap: 16,
  },
  languageStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageStatText: {
    color: '#aaa',
    fontSize: 12,
  },
  detailsContainer: {
    padding: 20,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 8,
  },
  progressLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#53C691',
    borderRadius: 4,
  },
  progressPercent: {
    color: '#53C691',
    fontSize: 12,
    marginTop: 6,
  },
  lastPracticed: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});