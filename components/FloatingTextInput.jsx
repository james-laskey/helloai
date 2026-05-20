// components/DraggableTextInput.js

import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Text
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FloatingTextInput = ({
  inputText,
  onInputChange,
  onSendMessage,
  isLoading,
  isListening,
  placeholder = "Type a message..."
}) => {
  // Draggable position - start at bottom-left
  const pan = useRef(new Animated.ValueXY({ x: 20, y: SCREEN_HEIGHT - 180 })).current;
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      // Only start pan responder if touching the drag handle area (top 30 pixels)
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { locationY } = gestureState;
        return locationY < 30;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event(
          [
            null,
            { dx: pan.x, dy: pan.y }
          ],
          { useNativeDriver: false }
        )(evt, gestureState);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        pan.flattenOffset();
        
        let newX = pan.x._value;
        let newY = pan.y._value;
        
        // Keep within screen bounds
        newX = Math.min(Math.max(newX, 10), SCREEN_WIDTH - 320);
        newY = Math.min(Math.max(newY, 80), SCREEN_HEIGHT - 150);
        
        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const handleSend = () => {
    if (inputText.trim() && !isLoading && !isListening) {
      onSendMessage();
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
    >
      {/* Drag Handle - only this area triggers dragging */}
      <View 
        style={styles.dragHandle}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragIndicator} />
        <Text style={styles.dragHint}>Drag to move</Text>
      </View>
      
      {/* Text Input Area - not draggable */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={onInputChange}
          placeholder={placeholder}
          placeholderTextColor="#666"
          multiline
          maxLength={500}
          editable={!isLoading && !isListening}
        />
        
        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading || isListening) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading || isListening}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Character Counter */}
      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {inputText.length}/500
        </Text>
        {isListening && (
          <View style={styles.listeningBadge}>
            <Ionicons name="mic" size={12} color="#53C691" />
            <Text style={styles.listeningText}>Voice Active</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 300,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(83, 198, 145, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 4,
  },
  dragHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#53C691',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  charCount: {
    color: '#666',
    fontSize: 10,
  },
  listeningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(83, 198, 145, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  listeningText: {
    color: '#53C691',
    fontSize: 10,
    fontWeight: '500',
  },
});