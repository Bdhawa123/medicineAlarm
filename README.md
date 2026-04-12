# Medicine Alarm App 💊

An elegant and reliable React Native (Expo) application designed to track medication prescriptions and ensure you never miss a dose through robust, background push notification alarms.

## Features

- **Medication Tracking:** Keep detailed records of your medications, including names, dosages, and specific doctor instructions.
- **Dynamic Scheduling:** Set a unique interval (e.g., every 8 hours). The app automatically calculates your *next* dose using the exact moment you took your last dose.
- **Inventory Management:** Automatically subtracts from your remaining pill count every time you record taking a dose.
- **Reliable Push Notifications:** Delivers OS-level background notifications (iOS & Android) that persist on your screen.
- **Interactive Alerts:** "Take Now" and "Snooze (15 Min)" action buttons built directly into the notification banners. Actioning an alarm automatically records the dose or reschedules it without even opening the app.
- **Custom UI Alerts:** Built-in beautiful, fully-themed modal components for confirming critical actions (like deleting a prescription).

## Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
- **State Management:** React Context API + Reducers
- **Notifications:** `expo-notifications` 
- **Routing:** `@react-navigation/native-stack`
- **Component Styling:** React Native StyleSheet

## Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo Server:**
   ```bash
   npx expo start
   ```

3. **Run on Device / Simulator:**
   - Scan the QR code using the Expo Go app on your phone.
   - Or press `i` to open in iOS simulator, or `a` to open in Android emulator.

## Notes on Notifications
*Push notifications are notoriously difficult to test accurately on PC simulators. For the best experience testing the "Sticky" notifications and the "Take Dose / Snooze" interaction buttons, it is highly recommended to run the Expo server and test it on a physical device.*
