import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MyTextBold } from "./my-text";

function CardsList({ children, title }) {
  return (
    <View style={styles.container}>
      <View style={styles.childrenContainer}>{children}</View>
      <MyTextBold>
        <Text style={styles.text}>{title}</Text>
      </MyTextBold>
    </View>
  );
}

export default CardsList;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#0a2463",
    flex: 1,
    alignItems: "center",
  },
  childrenContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "flex-start",
    flexWrap: "wrap",
  },
  text: {
    fontWeight: "bold",
    color: "#ffff",
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    textAlign: "center",
  },
});
