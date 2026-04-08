import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const MedicationCard = ({ item, index, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  // 2. Interpolate values for height and opacity
  const bodyHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust 100 to fit your content
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.dosageText}>{item.dosage}</Text>
        </View>
        <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* 3. The Animated View wraps the content */}
      <Animated.View
        style={{ height: bodyHeight, opacity: opacity, overflow: "hidden" }}
      >
        <View style={styles.divider} />
        <Text style={styles.label}>INSTRUCTIONS</Text>
        <Text style={styles.descriptionText}>{item.instructions}</Text>
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          style={styles.deleteBtn}
        >
          <MaterialIcons name="delete" size={20} color="#FF5252" />
          <Text style={{ color: "#FF5252", marginLeft: 5 }}>Remove</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  indexContainer: {
    backgroundColor: "#e3f2fd",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  indexText: { color: "#2196f3", fontWeight: "bold" },
  nameContainer: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: "700" },
  dosageText: { color: "#666" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  label: { fontSize: 10, fontWeight: "bold", color: "#aaa", marginBottom: 4 },
  descriptionText: { fontSize: 14, color: "#444" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end",
  },
});

export default MedicationCard;
