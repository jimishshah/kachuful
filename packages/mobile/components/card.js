import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { MyTextBold } from "./my-text";
import Badge from "./badge";
import { cardColours } from "@kachuful/common";

function Card({ text, type, badge, onClick = () => {} }) {
  return (
    <View style={styles.container}>
      <Badge text={badge} />
      <MyTextBold>
        <Text style={styles.text}>{text}</Text>
      </MyTextBold>
      <Image source={cardColours[type]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 8,
    width: 64,
    maxWidth: 64,
    minWidth: 64,
    minHeight: 69,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 4,
    margin: 4,
    alignItems: "center",
  },
  text: {
    color: "rgba(0, 0, 0, 0.54)",
  },
  image: {
    height: 48,
    width: 48,
  },
});

export default Card;
