import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AlarmScreen from "./screens/AlarmScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <AlarmScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
