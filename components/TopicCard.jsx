// components/TopicCard.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export const TopicCard = ({ topic, languageColor, onPress }) => (
  <TouchableOpacity 
    style={[styles.topicCard, { borderLeftColor: languageColor || '#53C691' }]}
    onPress={() => onPress(topic)}
    activeOpacity={0.7}
  >
    <View style={styles.topicHeader}>
      <View style={[styles.topicBadge, { backgroundColor: languageColor || '#53C691' }]}>
        <Text style={styles.topicBadgeText}>{topic.concept || 'Grammar'}</Text>
      </View>
      {topic.level && <Text style={styles.topicLevel}>{topic.level}</Text>}
    </View>
    
    <Text style={styles.topicName}>{topic.name}</Text>
    <Text style={styles.topicDescription}>{topic.description}</Text>
    
    {topic.example && (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleLabel}>📖 Example</Text>
        <Text style={styles.topicExample}>"{topic.example}"</Text>
      </View>
    )}
    
    <View style={styles.startButtonContainer}>
      <Text style={styles.startButton}>Start AI Tutor →</Text>
      <Ionicons name="chatbubbles" size={16} color="#53C691" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  topicCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#53C691',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  topicBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#53C691',
  },
  topicBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  topicLevel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '500',
  },
  topicName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  topicDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  exampleContainer: {
    backgroundColor: '#0f0f0f',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  exampleLabel: {
    color: '#53C691',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  topicExample: {
    color: '#aaa',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  startButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  startButton: {
    color: '#53C691',
    fontSize: 14,
    fontWeight: '600',
  },
});