import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { MyTextBold, MyTextRegular } from "./my-text";
import Badge from "./badge";
import { cardColours } from "@kachuful/common";

function Card({ text, type, badge, onClick = () => {} }) {
  return (
    <View style={styles.container}>
      <Badge text={badge} />
      {cardColours[type] ? (
        <MyTextBold>
          <Text style={styles.text}>{text}</Text>
        </MyTextBold>
      ) : (
        <MyTextRegular>
          <Text style={styles.text}>{text}</Text>
        </MyTextRegular>
      )}
      {cardColours[type] && (
        <Image style={styles.image} source={cardColours[type]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 8,
    width: 64,
    minHeight: 81,
    backgroundColor: "#fff",
    borderRadius: 4,
    margin: 4,
    alignItems: "center",
    textAlign: "center",
  },
  text: {
    color: "rgba(0, 0, 0, 0.54)",
    textAlign: "center",
  },
  image: {
    height: 48,
    width: 48,
  },
});

export default Card;
