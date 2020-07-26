import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { MyTextRegular } from "./my-text";

function ScoreCard({ scores }) {
  const [firstPlayer] = scores;
  return (
    <ScrollView horizontal={true} contentContainerStyle={styles.scrollview}>
      <View style={styles.mainContainer}>
        <MyTextRegular
          fontSize={18.72}
          flex={1}
          marginVertical={18.72}
          fontWeight="700"
        >
          Score Card
        </MyTextRegular>
        <View style={styles.container}>
          <View style={styles.cell}>
            <MyTextRegular fontWeight="700" fontSize={16}>
              Name
            </MyTextRegular>
          </View>
          <View style={styles.cell}>
            <MyTextRegular fontWeight="700" fontSize={16}>
              Total
            </MyTextRegular>
          </View>
          {firstPlayer.scoreCard.map((score, index) => (
            <View style={styles.cell}>
              <MyTextRegular fontWeight="700" fontSize={16}>
                Level {firstPlayer.scoreCard.length - index}
              </MyTextRegular>
            </View>
          ))}
        </View>
        <View style={styles.container}>
          {scores.map(({ playerName, scoreCard, totalScore }) => (
            <>
              <View style={styles.cell}>
                <MyTextRegular>{playerName}</MyTextRegular>
              </View>
              <View style={styles.cell}>
                <MyTextRegular>{totalScore}</MyTextRegular>
              </View>
              {scoreCard.map((score, index) => (
                <View style={styles.cell}>
                  <MyTextRegular>{score}</MyTextRegular>
                </View>
              ))}
            </>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default React.memo(ScoreCard);

const styles = StyleSheet.create({
  scrollview: {
    // flexDirection: "column",
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
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
    width: 80,
    textAlign: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgb(224, 224, 224)",
  },
});
