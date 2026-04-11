import { StyleSheet, Text, View, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AlarmScreen from "./screens/AlarmScreen";
import MedicationDetail from "./screens/MedicalDetailScreen";
import MedicationEditScreen from "./screens/MedicationEditScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Provider as MedicationProvider } from "./context/MedicationContext";
import AddMedicationScreen from "./screens/AddMedicationScreen";

const Stack = createNativeStackNavigator();

// To force scaling across the whole app:
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = true;
} else {
  Text.defaultProps = { allowFontScaling: true };
}

if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = true;
} else {
  TextInput.defaultProps = { allowFontScaling: true };
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MedicationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AlarmScreen" component={AlarmScreen} />
            <Stack.Screen
              name="MedicationDetail"
              component={MedicationDetail}
            />
            <Stack.Screen
              name="EditMedication"
              component={MedicationEditScreen}
            />
            <Stack.Screen
              name="AddMedication"
              component={AddMedicationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MedicationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
