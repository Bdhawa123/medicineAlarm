import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

const CriticalToggle = ({ isCritical, onValueChange }) => {
  // 1. Setup the animated value (0 for false, 1 for true)
  const animatedValue = useRef(new Animated.Value(isCritical ? 1 : 0)).current;

  // 2. Run the animation whenever the value changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isCritical ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // Background color doesn't support native driver
    }).start();
  }, [isCritical]);

  // 3. Interpolate background color: Gray -> Red
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E1E8ED", "#FF5252"],
  });

  // 4. Interpolate the circle position
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26], // Moves the circle across the track
  });

  return (
    <View style={styles.settingRow}>
      <View>
        <Text style={styles.settingText}>Mark as Critical</Text>
        <Text style={styles.settingSubtext}>
          Prioritize alerts for this med
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onValueChange(!isCritical)}
      >
        <Animated.View style={[styles.toggleTrack, { backgroundColor }]}>
          <Animated.View
            style={[styles.toggleCircle, { transform: [{ translateX }] }]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  settingText: { fontSize: 16, fontWeight: "600", color: "#333" },
  settingSubtext: { fontSize: 12, color: "#999", marginTop: 2 },
  toggleTrack: {
    width: 54,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    padding: 2,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default CriticalToggle;
