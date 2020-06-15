import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";

function ActionBar() {
  return <Text style={styles.container}>Action bar</Text>;
}

export default ActionBar;

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#0a2463",
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
