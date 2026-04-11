import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const FormHeader = ({ title, onSave, onCancel, actionText = "Save" }) => {
  return (
    <View style={styles.header}>

      <TouchableOpacity onPress={onCancel} style={styles.iconContainer}>
        <MaterialIcons name="close" size={24} color="#333" />
      </TouchableOpacity>


      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity onPress={onSave} style={styles.actionContainer}>
        <Text style={styles.actionBtn}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  iconContainer: {
    width: 50,
    alignItems: "flex-start",
  },
  actionContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  actionBtn: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FormHeader;
