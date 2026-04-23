// components/QuizComponent.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

export const QuizComponent = ({ quiz, onSubmit, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentQuestion = quiz[currentIndex];
  const totalQuestions = quiz.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };
  
  const handleNext = () => {
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const newAnswers = [...answers, { 
      question: currentQuestion.question,
      selected: selectedOption,
      correct: isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation
    }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      onSubmit(newAnswers);
    }
  };
  
  const getOptionStyle = (option) => {
    if (!showExplanation) {
      return selectedOption === option ? styles.optionSelected : styles.option;
    }
    
    if (option === currentQuestion.correctAnswer) {
      return styles.optionCorrect;
    }
    
    if (selectedOption === option && option !== currentQuestion.correctAnswer) {
      return styles.optionIncorrect;
    }
    
    return styles.option;
  };
  
  if (completed) {
    const finalScore = Math.round((score / totalQuestions) * 100);
    return (
      <View style={styles.completedContainer}>
        <View style={styles.completedHeader}>
          <Ionicons name="trophy" size={60} color="#FFD700" />
          <Text style={styles.completedTitle}>Quiz Complete!</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{score}/{totalQuestions}</Text>
          <Text style={styles.scorePercent}>{finalScore}%</Text>
        </View>
        
        <ScrollView style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>Review Answers:</Text>
          {answers.map((answer, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Ionicons 
                  name={answer.correct ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={answer.correct ? "#53C691" : "#ff4444"} 
                />
                <Text style={styles.reviewQuestion}>
                  {index + 1}. {answer.question}
                </Text>
              </View>
              {!answer.correct && (
                <Text style={styles.reviewExplanation}>{answer.explanation}</Text>
              )}
            </View>
          ))}
        </ScrollView>
        
        <TouchableOpacity style={styles.doneButton} onPress={() => onComplete(score, totalQuestions)}>
          <Text style={styles.doneButtonText}>Continue Learning</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>
      </View>
      
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => !showExplanation && handleSelectOption(option)}
            disabled={showExplanation}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        {!showExplanation && selectedOption && (
          <TouchableOpacity 
            style={styles.checkButton} 
            onPress={() => setShowExplanation(true)}
          >
            <Text style={styles.checkButtonText}>Check Answer</Text>
          </TouchableOpacity>
        )}
        
        {showExplanation && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 === totalQuestions ? 'Finish Quiz' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  progressContainer: {
    marginBottom: 20
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#53C691',
    borderRadius: 2
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center'
  },
  questionCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28
  },
  optionsContainer: {
    gap: 12
  },
  option: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  optionSelected: {
    backgroundColor: 'rgba(83,198,145,0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#53C691'
  },
  optionCorrect: {
    backgroundColor: 'rgba(83,198,145,0.3)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#53C691'
  },
  optionIncorrect: {
    backgroundColor: 'rgba(255,68,68,0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ff4444'
  },
  optionText: {
    color: '#fff',
    fontSize: 16
  },
  explanationContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(83,198,145,0.1)',
    borderRadius: 12
  },
  explanationTitle: {
    color: '#53C691',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  explanationText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20
  },
  buttonContainer: {
    marginTop: 24
  },
  checkButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  nextButton: {
    backgroundColor: '#53C691',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  completedContainer: {
    flex: 1,
    padding: 20
  },
  completedHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40
  },
  completedTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  scoreValue: {
    color: '#53C691',
    fontSize: 48,
    fontWeight: 'bold'
  },
  scorePercent: {
    color: '#fff',
    fontSize: 24,
    marginTop: 8
  },
  reviewContainer: {
    flex: 1,
    marginBottom: 20
  },
  reviewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  reviewItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  reviewQuestion: {
    color: '#fff',
    fontSize: 14,
    flex: 1
  },
  reviewExplanation: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 28,
    lineHeight: 16
  },
  doneButton: {
    backgroundColor: '#53C691',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});