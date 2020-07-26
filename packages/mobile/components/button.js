import React from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";

function Button({ onPress, title, color = "primary" }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.button, color === "primary" && styles.buttonPrimary]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f50057",
    borderRadius: 4,
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginVertical: 12,
  },
  buttonPrimary: {
    backgroundColor: "#0a2463",
  },
  text: {
    color: "white",
    fontFamily: "Rubik_400Regular",
    fontSize: 16,
  },
});
