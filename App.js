import { StyleSheet, Text, TextInput } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerForPushNotificationsAsync } from "./utils/notifications";

import AlarmScreen from "./screens/AlarmScreen";
import MedicationDetail from "./screens/MedicalDetailScreen";
import AddMedicationScreen from "./screens/AddMedicationScreen";
import MedicationEditScreen from "./screens/MedicationEditScreen";

import { Provider as MedicationProvider } from "./context/MedicationContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

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
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

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
