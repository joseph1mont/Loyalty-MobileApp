import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

import { useColorScheme } from "@/hooks/useColorScheme";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDBh-Kd2ilFUHiunWALPtpxGQDITwLqPE",
  authDomain: "loyalty-21f09.firebaseapp.com",
  projectId: "loyalty-21f09",
  storageBucket: "loyalty-21f09.appspot.com",
  appId: "1:127832336749:web:c68d35d81712c488295264",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Device.isDevice) {
        try {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;

          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          if (finalStatus !== "granted") {
            console.warn("Push notification permission denied!");
            return;
          }

          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log("Expo Push Token:");
          console.log(token);
          setPushToken(token);
        } catch (error) {
          console.error("Error during push notification registration:", error);
        }
      } else {
        console.warn("Push notifications are not supported on simulators.");
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (pushToken) {
      savePushTokenToWordPress(pushToken);
    }
  }, [pushToken]);

  const savePushTokenToWordPress = async (token: string) => {
    const apiUrl =
      "https://your-wordpress-site.com/wp-json/myplugin/v1/save-push-token";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        console.log("Push token saved successfully.");
      } else {
        const errorText = await response.text();
        console.warn("Failed to save push token:", errorText);
      }
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
