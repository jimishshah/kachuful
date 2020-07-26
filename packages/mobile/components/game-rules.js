import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { gameRules } from "@kachuful/common";

function GameRules() {
  return (
    <View>
      <Text style={styles.heading}>How to play</Text>
      {gameRules.map((rule) => (
        <Text style={styles.text}>{rule}</Text>
      ))}
    </View>
  );
}

export default GameRules;

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
    fontFamily: "Rubik_400Regular",
    fontSize: 24,
    paddingVertical: 16,
  },
  text: {
    fontFamily: "Rubik_400Regular",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
