import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import ListComponent from "../components/ListComponent";
import MedicationCard from "../components/MedicationCard";
import DBjson from "../mockDB/DBjson.json";

const AlarmScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.appWrapper}>
      <ListComponent data={[DBjson]} />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddMedication")}
        activeOpacity={0.8}
      >
        <Entypo name="plus" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fab: {
    position: "absolute", // Key for floating
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 30, // Adjust this based on your bottom tab bar if you have one
    backgroundColor: "#2196f3",
    borderRadius: 35,
    elevation: 8, // Stronger shadow for the FAB
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default AlarmScreen;
