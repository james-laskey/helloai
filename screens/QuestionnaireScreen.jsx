import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';
import Ionicons from '@react-native-vector-icons/ionicons';

export const QuestionnaireScreen = ({ userData, onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [proficiency, setProficiency] = useState(null);
  const [learningGoals, setLearningGoals] = useState([]);
  const [preferredLearningStyle, setPreferredLearningStyle] = useState('');

  // All available languages (including native language options)
  const allLanguages = Object.keys(LANGUAGE_TOPICS);

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
    { id: 'conversation', label: 'Conversation Practice', icon: 'chatbubbles' },
    { id: 'grammar', label: 'Grammar Focus', icon: 'book' },
    { id: 'vocabulary', label: 'Vocabulary Building', icon: 'school' },
    { id: 'pronunciation', label: 'Pronunciation & Speaking', icon: 'mic' },
    { id: 'reading', label: 'Reading & Writing', icon: 'document-text' },
  ];

  const toggleGoal = (goalId) => {
    if (learningGoals.includes(goalId)) {
      setLearningGoals(learningGoals.filter(g => g !== goalId));
    } else {
      setLearningGoals([...learningGoals, goalId]);
    }
  };

  const handleSubmit = () => {
    if (!selectedLanguage) {
      Alert.alert('Missing Info', 'Please select a language to learn');
      return;
    }
    if (!nativeLanguage) {
      Alert.alert('Missing Info', 'Please select your native language');
      return;
    }
    if (selectedLanguage === nativeLanguage) {
      Alert.alert('Same Language', 'You selected the same language as your native language. Please choose a different language to learn or update your native language.');
      return;
    }
    if (!proficiency) {
      Alert.alert('Missing Info', 'Please rate your proficiency level');
      return;
    }
    if (learningGoals.length === 0) {
      Alert.alert('Missing Info', 'Please select at least one learning goal');
      return;
    }

    const userPreferences = {
      ...userData,
      targetLanguage: selectedLanguage,
      nativeLanguage: nativeLanguage,
      proficiencyLevel: proficiency,
      learningGoals: learningGoals,
      learningStyle: preferredLearningStyle,
      signupDate: new Date().toISOString(),
    };

    onComplete(userPreferences);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Help us personalize your learning experience</Text>
        </View>

        {/* Target Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Which language do you want to learn?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
            {allLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageCard,
                  selectedLanguage === lang && styles.languageCardSelected
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text style={styles.languageEmoji}>{LANGUAGE_TOPICS[lang].icon}</Text>
                <Text style={styles.languageName}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Native Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is your native language?</Text>
          <Text style={styles.sectionSubtitle}>This helps us provide better explanations in your language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
            {allLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageCard,
                  nativeLanguage === lang && styles.languageCardSelected
                ]}
                onPress={() => setNativeLanguage(lang)}
              >
                <Text style={styles.languageEmoji}>{LANGUAGE_TOPICS[lang].icon}</Text>
                <Text style={styles.languageName}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Proficiency Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How would you rate your current level?</Text>
          <View style={styles.proficiencyContainer}>
            {proficiencyLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.proficiencyButton,
                  proficiency === level.value && styles.proficiencyButtonSelected
                ]}
                onPress={() => setProficiency(level.value)}
              >
                <Text style={styles.proficiencyValue}>{level.value}</Text>
                <Text style={styles.proficiencyLabel}>{level.label.split(' - ')[1]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Learning Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What are your learning goals?</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          <View style={styles.goalsContainer}>
            {learningStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.goalCard,
                  learningGoals.includes(style.id) && styles.goalCardSelected
                ]}
                onPress={() => toggleGoal(style.id)}
              >
                <Ionicons 
                  name={style.icon} 
                  size={24} 
                  color={learningGoals.includes(style.id) ? '#53C691' : '#888'} 
                />
                <Text style={styles.goalLabel}>{style.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Learning Style Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred learning style</Text>
          <View style={styles.styleContainer}>
            {['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'].map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  styles.styleButton,
                  preferredLearningStyle === style && styles.styleButtonSelected
                ]}
                onPress={() => setPreferredLearningStyle(style)}
              >
                <Text style={styles.styleText}>{style}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Start Learning</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C67F2' },
  header: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 24, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 },
  sectionSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  languageScroll: { flexDirection: 'row' },
  languageCard: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 12, marginRight: 12, minWidth: 80 },
  languageCardSelected: { backgroundColor: '#53C691', borderWidth: 0 },
  languageEmoji: { fontSize: 32, marginBottom: 8 },
  languageName: { color: '#fff', fontSize: 14, fontWeight: '500' },
  proficiencyContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  proficiencyButton: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 40, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', minWidth: 70 },
  proficiencyButtonSelected: { backgroundColor: '#53C691' },
  proficiencyValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  proficiencyLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  goalsContainer: { gap: 12 },
  goalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, gap: 12 },
  goalCardSelected: { backgroundColor: 'rgba(83, 198, 145, 0.2)', borderWidth: 1, borderColor: '#53C691' },
  goalLabel: { color: '#fff', fontSize: 16 },
  styleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  styleButton: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 30, paddingHorizontal: 20, paddingVertical: 12 },
  styleButtonSelected: { backgroundColor: '#53C691' },
  styleText: { color: '#fff', fontSize: 14 },
  submitButton: { backgroundColor: '#53C691', borderRadius: 16, marginHorizontal: 24, marginVertical: 32, paddingVertical: 16, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});