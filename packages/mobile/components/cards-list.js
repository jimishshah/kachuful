import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { MyTextRegular } from "./my-text";
import Card from "./card";

function CardsList({ children, title, cards, clickHandler = () => {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.childrenContainer}>
        {cards.map(({ number, type, badge }) => (
          <TouchableHighlight onPress={() => clickHandler({ type, number })}>
            <View>
              <Card
                text={number}
                type={`${type}Png`}
                badge={badge}
                key={`${number}-${type}-${
                  Math.floor(Math.random() * 1000) + 1
                }-${Math.floor(Math.random() * 1000) + 1}`}
              />
            </View>
          </TouchableHighlight>
        ))}
      </View>

      <View style={styles.textContainer}>
        <MyTextRegular>
          <Text style={styles.text}>{title}</Text>
        </MyTextRegular>
      </View>
    </View>
  );
}

export default React.memo(CardsList);

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
    marginTop: 20,
  },
});
