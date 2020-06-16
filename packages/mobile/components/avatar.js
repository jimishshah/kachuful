import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Badge from "./badge";
function Avatar() {
  return (
    <View style={styles.container}>
      <Badge text="6/8" />
      <Text style={styles.text}>KK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#bdbdbd",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 20,
    color: "#fafafa",
  },
});

export default Avatar;
