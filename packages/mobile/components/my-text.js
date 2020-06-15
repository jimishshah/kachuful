import React from "react";
import { Text, StyleSheet } from "react-native";
import {
  useFonts,
  Rubik_400Regular,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";

const fontSize = 14;
export function MyTextRegular({ children }) {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  return fontsLoaded && <Text style={styles.textRegular}>{children}</Text>;
}
export function MyTextBold({ children }) {
  const [fontsLoaded] = useFonts({
    Rubik_700Bold,
  });
  return fontsLoaded && <Text style={styles.textBold}>{children}</Text>;
}

const styles = StyleSheet.create({
  textRegular: {
    fontFamily: "Rubik_400Regular",
    fontSize,
  },
  textBold: {
    fontFamily: "Rubik_700Bold",
    fontSize,
  },
});
