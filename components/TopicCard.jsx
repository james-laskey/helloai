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
    style={[styles.topicCard, { borderLeftColor: languageColor || '#007AFF' }]}
    onPress={() => onPress(topic)}
    activeOpacity={0.7}
  >
    <View style={styles.topicHeader}>
      <View style={[styles.topicBadge]}>
        <Text style={styles.topicBadgeText}>{topic.concept || 'Grammar'}</Text>
      </View>
      {topic.level && <Text style={styles.topicLevel}>{topic.level}</Text>}
    </View>
    
    <Text style={styles.topicName}>{topic.name}</Text>
    <Text style={styles.topicDescription}>{topic.description}</Text>
    
    {topic.example && (
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleLabel}>Example</Text>
        <Text style={styles.topicExample}>"{topic.example}"</Text>
      </View>
    )}
    
    <Text style={styles.startButton}>Start Lesson →</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  topicCardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 12 },
  topicBadge: {color: 'red'},
  topicIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2a2a3e', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  topicIcon: { fontSize: 24 },
  topicContent: { flex: 1 },
  topicName: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 4 },
  topicDescription: { fontSize: 13, color: '#F267A7' },
  topicBadgeText: {color: '#383838'},
  startButton: {color: "#383838", textAlign: "right"},
  exampleLabel: {color: "#383838"},
  topicExample: {fontStyle: 'italic'},
  topicCard: {marginHorizontal: 10, padding: 10, marginBottom:10, borderRadius: 10, backgroundColor: '#fff'}
});