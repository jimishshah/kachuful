import React from "react";
import { Text, StyleSheet } from "react-native";
import {
  useFonts,
  Rubik_400Regular,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";

export function MyTextRegular({ children, textAlign = "center", ...rest }) {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  return (
    fontsLoaded && (
      <Text style={[styles.textRegular, { textAlign, ...rest }]}>
        {children}
      </Text>
    )
  );
}
export function MyTextBold({ children, textAlign = "center", ...rest }) {
  const [fontsLoaded] = useFonts({
    Rubik_700Bold,
  });
  return (
    fontsLoaded && (
      <Text style={[styles.textBold, { textAlign, ...rest }]}>{children}</Text>
    )
  );
}

const styles = StyleSheet.create({
  textRegular: {
    fontFamily: "Rubik_400Regular",
  },
  textBold: {
    fontFamily: "Rubik_700Bold",
  },
});
