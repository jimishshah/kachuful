import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Badge from "./badge";
function Avatar({ badgeText, playerName }) {
  return (
    <View style={styles.container}>
      <Badge text={badgeText} color="primary" />
      <Text style={styles.text}>{playerName.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bdbdbd",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  text: {
    fontSize: 20,
    color: "#fafafa",
  },
});

export default Avatar;
