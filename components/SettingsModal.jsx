// components/SettingsModal.js

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';

export const SettingsModal = ({ 
  visible, 
  onClose, 
  userPreferences, 
  selectedLanguage,
  onUpdatePreferences,
  onLogout
}) => {
  const [tempPreferences, setTempPreferences] = useState(userPreferences);

  const proficiencyLevels = [
    { value: 1, label: '1 - Absolute Beginner', description: 'Know nothing at all' },
    { value: 2, label: '2 - Very Basic', description: 'Know a few words' },
    { value: 3, label: '3 - Basic', description: 'Can say simple greetings' },
    { value: 4, label: '4 - Elementary', description: 'Basic phrases and vocabulary' },
    { value: 5, label: '5 - Lower Intermediate', description: 'Simple conversations' },
    { value: 6, label: '6 - Intermediate', description: 'Can handle basic topics' },
    { value: 7, label: '7 - Upper Intermediate', description: 'Good conversational skills' },
    { value: 8, label: '8 - Advanced', description: 'Fluent in most situations' },
    { value: 9, label: '9 - Very Advanced', description: 'Near-native understanding' },
    { value: 10, label: '10 - Proficient', description: 'Native-like fluency' },
  ];

  const learningStyles = [
    { id: 'Visual', label: 'Visual', icon: 'eye-outline', description: 'Learn by seeing' },
    { id: 'Auditory', label: 'Auditory', icon: 'ear-outline', description: 'Learn by listening' },
    { id: 'Reading/Writing', label: 'Reading/Writing', icon: 'book-outline', description: 'Learn by reading' },
    { id: 'Kinesthetic', label: 'Kinesthetic', icon: 'body-outline', description: 'Learn by doing' },
  ];

  const handleSave = () => {
    onUpdatePreferences(tempPreferences);
    onClose();
    Alert.alert('Success', 'Your preferences have been updated!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            onClose();
            onLogout();
          }
        }
      ]
    );
  };

  const currentLanguageData = LANGUAGE_TOPICS[selectedLanguage];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <Text style={styles.userName}>{userPreferences?.name || 'Language Learner'}</Text>
              <Text style={styles.userEmail}>{userPreferences?.email || 'learner@example.com'}</Text>
            </View>

            {/* Proficiency Level */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Proficiency Level</Text>
              <Text style={styles.settingsSectionSubtitle}>
                How would you rate your current level?
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.proficiencyScroll}
              >
                {proficiencyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.proficiencyButton,
                      tempPreferences?.proficiencyLevel === level.value && styles.proficiencyButtonSelected
                    ]}
                    onPress={() => setTempPreferences({ ...tempPreferences, proficiencyLevel: level.value })}
                  >
                    <Text style={styles.proficiencyValue}>{level.value}</Text>
                    <Text style={styles.proficiencyLabel}>{level.label.split(' - ')[1]}</Text>
                    <Text style={styles.proficiencyDescription}>{level.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Learning Style */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Learning Style</Text>
              <Text style={styles.settingsSectionSubtitle}>
                How do you prefer to learn?
              </Text>
              <View style={styles.styleContainer}>
                {learningStyles.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[
                      styles.styleButton,
                      tempPreferences?.preferredLearningStyle === style.id && styles.styleButtonSelected
                    ]}
                    onPress={() => setTempPreferences({ ...tempPreferences, preferredLearningStyle: style.id })}
                  >
                    <View style={styles.styleIconContainer}>
                      <Ionicons 
                        name={style.icon} 
                        size={24} 
                        color={tempPreferences?.preferredLearningStyle === style.id ? '#53C691' : '#fff'} 
                      />
                    </View>
                    <Text style={[
                      styles.styleLabel,
                      tempPreferences?.preferredLearningStyle === style.id && styles.styleLabelSelected
                    ]}>
                      {style.label}
                    </Text>
                    <Text style={styles.styleDescription}>{style.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Language Information */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Language Information</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Target Language:</Text>
                <View style={styles.infoValueContainer}>
                  <Text style={styles.infoEmoji}>{currentLanguageData?.icon}</Text>
                  <Text style={styles.infoValue}>{selectedLanguage}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Native Language:</Text>
                <View style={styles.infoValueContainer}>
                  <Text style={styles.infoEmoji}>{LANGUAGE_TOPICS[tempPreferences?.nativeLanguage]?.icon || '🌐'}</Text>
                  <Text style={styles.infoValue}>{tempPreferences?.nativeLanguage || 'Not set'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Learning Goals:</Text>
                <View style={styles.goalsContainer}>
                  {tempPreferences?.learningGoals?.map((goal, index) => (
                    <View key={index} style={styles.goalBadge}>
                      <Text style={styles.goalBadgeText}>{goal}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ff4444" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* Version Info */}
            <Text style={styles.versionText}>Version 1.0.0</Text>
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
    maxHeight: '90%' 
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
    fontSize: 24, 
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#53C691',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  settingsSection: { 
    marginBottom: 28 
  },
  settingsSectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#53C691', 
    marginBottom: 4 
  },
  settingsSectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  proficiencyScroll: {
    flexDirection: 'row',
  },
  proficiencyButton: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center', 
    minWidth: 100,
    marginRight: 12,
  },
  proficiencyButtonSelected: { 
    backgroundColor: '#53C691',
    borderWidth: 0,
  },
  proficiencyValue: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: 'bold' 
  },
  proficiencyLabel: { 
    color: 'rgba(255,255,255,0.9)', 
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  proficiencyDescription: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  styleContainer: { 
    gap: 12 
  },
  styleButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 16, 
    padding: 16, 
    gap: 12,
  },
  styleButtonSelected: { 
    backgroundColor: 'rgba(83, 198, 145, 0.15)', 
    borderWidth: 1, 
    borderColor: '#53C691' 
  },
  styleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleLabel: { 
    flex: 1,
    color: '#fff', 
    fontSize: 16,
    fontWeight: '500',
  },
  styleLabelSelected: { 
    color: '#53C691' 
  },
  styleDescription: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoEmoji: {
    fontSize: 18,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  goalBadge: {
    backgroundColor: 'rgba(83, 198, 145, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalBadgeText: {
    color: '#53C691',
    fontSize: 12,
  },
  saveButton: { 
    flexDirection: 'row',
    backgroundColor: '#53C691', 
    borderRadius: 16, 
    paddingVertical: 14, 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8,
    marginTop: 8, 
    marginBottom: 12 
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,68,68,0.1)', 
    borderRadius: 16, 
    paddingVertical: 14, 
    gap: 8, 
    marginBottom: 16 
  },
  logoutButtonText: { 
    color: '#ff4444', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  versionText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginBottom: 20,
  },
});