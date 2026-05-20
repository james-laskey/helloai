// components/FloatingControls.js

import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const FloatingControls = ({
  isMuted,
  isListening,
  onToggleMute,
  onManualVoiceToggle,
  onStopSpeaking,
  onEndCall
}) => {
  // Start position: middle-right of the screen
  // X: 20px from right edge, Y: center of screen
  const initialX = SCREEN_WIDTH - 300; // 80 = widget width approx
  const initialY = SCREEN_HEIGHT / 2 - 60; // Center vertically minus half widget height
  
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only start pan responder if touching the drag handle area
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
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        pan.flattenOffset();
        
        let newX = pan.x._value;
        let newY = pan.y._value;
        
        // Keep within screen bounds
        newX = Math.min(Math.max(newX, 10), SCREEN_WIDTH - 70);
        newY = Math.min(Math.max(newY, 100), SCREEN_HEIGHT - 150);
        
        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const handleButtonPress = (action) => {
    if (!isDragging) {
      action();
    }
  };

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Drag Handle - only this area triggers dragging */}
      <View style={styles.dragHandle}>
        <View style={styles.dragIndicator} />
        <Text style={styles.dragHint}>Drag to move</Text>
      </View>
      
      <View style={styles.controlsGrid}>
        {/* Mute Button */}
        <TouchableOpacity
          style={[styles.floatingButton, isMuted && styles.activeButton]}
          onPress={() => handleButtonPress(onToggleMute)}
          activeOpacity={0.7}
          disabled={isDragging}
        >
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={22} color="#fff" />
          <Text style={styles.buttonLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>

        {/* Voice Button */}
        <TouchableOpacity
          style={[styles.floatingButton, isListening && styles.activeButton]}
          onPress={() => handleButtonPress(onManualVoiceToggle)}
          activeOpacity={0.7}
          disabled={isDragging}
        >
          <Ionicons name={isListening ? "stop-circle" : "ear"} size={22} color="#fff" />
          <Text style={styles.buttonLabel}>{isListening ? "Stop" : "Voice"}</Text>
        </TouchableOpacity>

        {/* End Call Button */}
        <TouchableOpacity
          style={[styles.floatingButton, styles.endCallButton]}
          onPress={() => handleButtonPress(onEndCall)}
          activeOpacity={0.7}
          disabled={isDragging}
        >
          <Ionicons name="call" size={22} color="#fff" />
          <Text style={styles.buttonLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  dragHandle: {
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
  controlsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  floatingButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    gap: 4,
  },
  activeButton: {
    backgroundColor: '#53C691',
  },
  endCallButton: {
    backgroundColor: '#ff3b30',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
});