import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// First, set the handler that will cause the notification
// to show the alert even when the app is active
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();

  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }

  await Notifications.setNotificationCategoryAsync('medication_reminder', [
    {
      identifier: 'taken',
      buttonTitle: 'Verify & Take',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'snooze',
      buttonTitle: 'Push back 15 min',
      options: { opensAppToForeground: false },
    },
  ]);

  if (Platform.OS === 'android') {

    const { status } = await Notifications.getPermissionsAsync();
    console.log("Notification status", status)
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    return true;
  } else {
    // Push notifications don't perfectly work on some iOS Simulators
    return false;
  }
}

export async function cancelMedicationAlarm(medicationId) {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.medicationId === medicationId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error("Error cancelling alarm:", error);
  }
}

export async function scheduleMedicationAlarm(medication) {
  // Always cancel any existing alarms for this med first to avoid duplicates
  await cancelMedicationAlarm(medication.id);

  if (!medication.nextScheduled) {
    console.log("No next scheduled time found for medication:", medication.name);
    return;
  }

  const scheduledTime = new Date(medication.nextScheduled);
  if (isNaN(scheduledTime.getTime())) {
    console.log("Invalid scheduled time for medication:", medication.name);
    return;
  }

  const seconds = Math.floor((scheduledTime.getTime() - new Date().getTime()) / 1000);

  if (seconds <= 0) {
    console.log("Scheduled time is in the past, skipping alarm:", scheduledTime);
    return;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder! 💊",
        body: `It's time to take ${medication.name} (${medication.dosage})`,
        sound: true,
        categoryIdentifier: 'medication_reminder',
        data: { medicationId: medication.id, medication },
        autoDismiss: false,
        sticky: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: seconds,
        channelId: 'default', // Android: must match registered channel
      },
    });

    console.log(`Scheduled notification for ${medication.name} in ${seconds} seconds`);
    return notificationId;
  } catch (error) {
    console.error("Failed to schedule alarm:", error);
  }
}

export async function resyncAllMedicationAlarms(medications) {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const scheduledIds = scheduled.map(n => n.content.data?.medicationId).filter(Boolean);

    for (const med of medications) {
      if (!scheduledIds.includes(med.id) && med.nextScheduled) {
        console.log(`Missing alarm for ${med.name}, auto-scheduling now...`);
        await scheduleMedicationAlarm(med);
      }
    }
  } catch (error) {
    console.error("Failed to resync alarms:", error);
  }
}

export async function snoozeMedicationAlarm(medication, minutes = 15) {
  try {
    const seconds = minutes * 60;
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder (Snoozed)! 💊",
        body: `It's time to take ${medication.name} (${medication.dosage})`,
        sound: true,
        categoryIdentifier: 'medication_reminder',
        data: { medicationId: medication.id, medication },
        autoDismiss: false,
        sticky: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: seconds,
        channelId: 'default', // Android: must match registered channel
      },
    });

    console.log(`Snoozed notification for ${medication.name} in ${seconds} seconds`);
    return notificationId;
  } catch (error) {
    console.error("Failed to schedule snoozed alarm:", error);
  }
}
