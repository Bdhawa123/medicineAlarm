import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ScheduleSection = ({ form, updateNested, setForm }) => {
  const [showPicker, setShowPicker] = useState(false);

  // 1. Fixed onTimeChange: Saves the time AND updates the next schedule
  const onTimeChange = (event, selectedDate) => {
    console.log("Selected Time:", selectedDate);
    setShowPicker(false);
    if (selectedDate) {
      const timeISO = selectedDate.toISOString();
      console.log("Time in ISO Format:", timeISO);

      setForm((prev) => {
        // const interval = parseInt(prev.schedule.intervalHours, 10) || 0;
        let nextDate = new Date(selectedDate);
        if (prev.schedule.intervalHours) {
          nextDate.setHours(
            nextDate.getHours() + parseInt(prev.schedule.intervalHours, 10),
          );
        } else {
          nextDate = null; // No interval means we can't calculate the next dose
        }
        console.log("Calculated Next Dose Time:", nextDate);

        return {
          ...prev,
          lastTaken: timeISO, // Save the start time at root
          nextScheduled: nextDate ? nextDate.toISOString() : null, // Save calculated next dose
        };
      });
    }
  };

  const toggleDay = (day) => {
    const currentDays = form.schedule.activeDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    updateNested("schedule", "activeDays", newDays);
  };

  // 2. Fixed setIntervalTime: No quotes, correct variable path
  const setIntervalTime = (Interval) => {
    const intervalNum = parseInt(Interval, 10);

    setForm((prev) => {
      // Use lastTaken if it exists, otherwise use "now"
      let baseDate = prev.lastTaken ? new Date(prev.lastTaken) : new Date();
      let nextDate = new Date(baseDate);

      if (!isNaN(intervalNum)) {
        nextDate.setHours(nextDate.getHours() + intervalNum);
      }

      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          intervalHours: Interval,
        },
        // Only update if the number is valid
        nextScheduled: !isNaN(intervalNum)
          ? nextDate.toISOString()
          : prev.nextScheduled,
      };
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>SCHEDULE</Text>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.smallLabel}>Start Time</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: form.lastTaken ? "#333" : "#aaa" }}>
              {form.lastTaken
                ? new Date(form.lastTaken).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Select Start Time"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={form.lastTaken ? new Date(form.lastTaken) : new Date()}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onTimeChange}
            />
          )}
        </View>

        <View style={{ width: 40 }} />

        <View style={styles.flex}>
          <Text style={styles.smallLabel}>Interval (Hours)</Text>
          <TextInput
            placeholder="e.g. 8"
            keyboardType="numeric" // Use numeric keyboard
            value={
              form.schedule.intervalHours
                ? String(form.schedule.intervalHours)
                : ""
            }
            onChangeText={setIntervalTime}
            style={styles.input}
          />
        </View>
      </View>

      {/* Active Days Multi-Select code remains the same... */}
      <Text style={styles.smallLabel}>Repeat on</Text>
      <View style={styles.daysContainer}>
        {DAYS.map((day) => {
          const isActive = form.schedule.activeDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              style={[styles.dayChip, isActive && styles.dayChipActive]}
            >
              <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#aaa",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  row: { flexDirection: "row" },
  flex: { flex: 1 },
  smallLabel: { fontSize: 10, color: "#999", marginBottom: 5 },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F0F2F5",
    marginBottom: 10,
    minWidth: 45,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  dayChipActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  dayText: { fontSize: 12, color: "#666" },
  dayTextActive: { color: "#fff", fontWeight: "bold" },
});

export default ScheduleSection;
