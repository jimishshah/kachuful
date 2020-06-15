import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { MyTextBold } from "./my-text";

function ScoreCard() {
  const scores = [
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
    "level 1",
  ];
  return (
    <ScrollView horizontal={true} style={styles.scrollview}>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        {scores.map(() => (
          <View style={styles.cell}>
            <MyTextBold>Hello</MyTextBold>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default ScoreCard;

const styles = StyleSheet.create({
  scrollview: {
    // flexDirection: "column",
  },
  container: {
    flex: 1,
    alignContent: "center",
    flexWrap: "wrap",
  },
  container2: {
    flex: 1,
    alignContent: "center",
    flexWrap: "wrap",
  },
  break: {
    flexBasis: 10,
    width: 0,
  },

  cell: {
    width: 55,
    textAlign: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(224, 224, 224)",
  },
});
