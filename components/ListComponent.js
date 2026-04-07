import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MedicationCard from "./MedicationCard";

const ListComponent = ({ data }) => {
  // This prevents the "Cannot read property 'medications' of undefined" crash.

  if (!data || data.length === 0 || !data[0]?.medications) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>No medications found...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data[0].medications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <MedicationCard
            item={item}
            index={index}
            onDelete={(id) => console.log("Deleting:", id)}
          />

          //   <TouchableOpacity>
          //     <View style={styles.card}>
          //       <View style={styles.indexContainer}>
          //         <Text style={styles.indexText}>{index + 1}</Text>
          //       </View>

          //       <View style={styles.infoContainer}>
          //         <Text style={styles.nameText}>{item.name}</Text>
          //         <Text style={styles.dosageText}>
          //           {item.dosage} • {item.frequency}
          //         </Text>
          //       </View>

          //       <TouchableOpacity
          //         onPress={() => console.log("Delete ID:", item.id)}
          //         style={styles.deleteButton}
          //       >
          //         <MaterialIcons
          //           name="delete-outline"
          //           size={24}
          //           color="#ff5252"
          //         />
          //       </TouchableOpacity>
          //     </View>
          //   </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 40, // Extra space at the bottom
  },
  card: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    alignItems: "center",
    // Shadow for Android
    elevation: 4,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  indexContainer: {
    backgroundColor: "#e3f2fd",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  indexText: {
    color: "#2196f3",
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  dosageText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default ListComponent;
