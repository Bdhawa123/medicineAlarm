import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialIcons,
  FontAwesome5,
  CommunityIcons,
} from "@expo/vector-icons";

const MedicationDetail = ({ route, navigation }) => {
  const { med } = route.params;

  const formatTime = (isoString) => {
    if (!isoString) return "Not set";

    const date = new Date(isoString);

    // Formats to: "Apr 07, 08:05 AM"
    return date.toLocaleString([], {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Set to false if you prefer 24-hour time
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medication Info</Text>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={24} color="#2196f3" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Info Section */}
        <View style={styles.mainInfo}>
          <Text style={styles.medName}>{med.name}</Text>
          <Text style={styles.medType}>
            {med.dosage} • {med.type}
          </Text>
        </View>

        {/* Stats Grid: Inventory & Progress */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="inventory" size={20} color="#2196f3" />

            {/* Access 'remaining' and 'total' from the object */}
            <Text style={styles.statValue}>
              {med.inventory?.remaining} / {med.inventory?.total}
            </Text>

            <Text style={styles.statLabel}>Inventory Left</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="event-available" size={20} color="#4CAF50" />
            <Text style={styles.statValue}>
              {med.schedule?.activeDays?.join(", ") || "None"}
            </Text>
            <Text style={styles.statLabel}>Active Days</Text>
          </View>
        </View>

        {/* Schedule Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Schedule & History</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <MaterialIcons
                name="notifications-active"
                size={18}
                color="#FF9800"
              />
            </View>
            <View>
              <Text style={styles.timelineLabel}>Next Scheduled</Text>
              <Text style={styles.timelineValue}>
                {/* If it's an object, get the .time property. If it's a string, use it directly */}
                {formatTime(med.nextScheduled) || "Not set"}
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, { backgroundColor: "#E8F5E9" }]}>
              <MaterialIcons name="history" size={18} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.timelineLabel}>Last Taken</Text>
              <Text style={styles.timelineValue}>
                {formatTime(med.lastTaken) || "Never"}
              </Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Instructions</Text>
          <Text style={styles.descriptionText}>
            {med.instructions ||
              "No specific instructions provided for this medication."}
          </Text>
        </View>

        {med.notificationConfig?.isCritical && (
          <View style={styles.criticalBox}>
            <MaterialIcons name="warning" size={20} color="#D32F2F" />
            <Text style={styles.criticalText}>CRITICAL MEDICATION</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  content: { padding: 20 },
  mainInfo: { marginBottom: 25 },
  medName: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a" },
  medType: { fontSize: 16, color: "#777", marginTop: 4 },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    width: "48%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 8 },
  statLabel: { fontSize: 12, color: "#999", marginTop: 2 },

  section: { marginBottom: 25 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  timelineLabel: { fontSize: 12, color: "#999" },
  timelineValue: { fontSize: 15, fontWeight: "600", color: "#444" },

  descriptionText: { fontSize: 15, color: "#555", lineHeight: 22 },

  criticalBox: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  criticalText: { color: "#D32F2F", fontWeight: "bold", marginLeft: 8 },
});

export default MedicationDetail;
