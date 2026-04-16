import { StyleSheet, Text, TextInput } from "react-native";
import React, { useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerForPushNotificationsAsync, snoozeMedicationAlarm } from "./utils/notifications";

import AlarmScreen from "./screens/AlarmScreen";
import MedicationDetail from "./screens/MedicalDetailScreen";
import AddMedicationScreen from "./screens/AddMedicationScreen";
import MedicationEditScreen from "./screens/MedicationEditScreen";
import LogsScreen from "./screens/LogsScreen";

import { Provider as MedicationProvider, Context as MedicationContext } from "./context/MedicationContext";
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

function Main() {
  const { takeMedication } = useContext(MedicationContext);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const responseListener = Notifications.addNotificationResponseReceivedListener(async response => {
      const actionId = response.actionIdentifier;
      const medication = response.notification.request.content.data?.medication;
      const notificationId = response.notification.request.identifier;

      if (actionId === 'snooze' && medication) {
        await Notifications.dismissNotificationAsync(notificationId);
        await snoozeMedicationAlarm(medication, 15);
      } else if (actionId === 'taken' || actionId === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        await Notifications.dismissNotificationAsync(notificationId);
        
        // Trigger context update to actually take the medication
        if (medication) {
          takeMedication(medication);
        }
      }
    });

    return () => {
      responseListener.remove();
    };
  }, []);

  return (
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
          name="LogsScreen"
          component={LogsScreen}
        />
        <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MedicationProvider>
        <Main />
      </MedicationProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
