import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { cardColours, DEFAULT_WINS } from "@kachuful/common";
import { MyTextRegular } from "./my-text";
import BurgerIcon from "../assets/burger-icon.png";

function ActionBar({
  onMenuButtonClick: menuButtonClickHandler,
  bidWins,
  currentUser: {
    hasLevelStarted,
    lastTrumpColour,
    wins: { currentWins },
  },
}) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.burgerIconContainer}
        onPress={() => menuButtonClickHandler(true)}
      >
        <Image source={BurgerIcon} style={styles.burgerIcon} />
      </TouchableHighlight>
      {hasLevelStarted && (
        <View style={styles.trump}>
          <View style={styles.trumpImageContainer}>
            <Image
              style={styles.trumpImage}
              source={cardColours[lastTrumpColour + "Png"]}
            />
          </View>
          <MyTextRegular>
            <Text style={styles.trumpText}>Trump</Text>
          </MyTextRegular>
        </View>
      )}
      {currentWins === DEFAULT_WINS && hasLevelStarted && (
        <TextInput
          style={styles.input}
          placeholder="My Bid"
          placeholderTextColor="rgba(255,255,255, 0.4)"
          maxLength={1}
          keyboardType="number-pad"
          enablesReturnKeyAutomatically={true}
          returnKeyType="done"
          onSubmitEditing={({ nativeEvent: { text, eventCount, target } }) => {
            if (Boolean(text)) {
              bidWins(Number(text));
            }
          }}
        />
      )}
    </View>
  );
}

export default React.memo(ActionBar);

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: "#0a2463",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  trumpImageContainer: {
    backgroundColor: "#fff",
    padding: 5,
    marginBottom: 4,
  },
  trumpImage: {
    height: 35,
    width: 35,
  },
  trumpText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 60,
  },

  trump: {
    flexDirection: "column",
    alignItems: "center",
    paddingRight: 16,
    paddingTop: 10,
  },

  input: {
    height: 35,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 4,
    flex: 1,
    color: "#fff",
    padding: 8,
    fontFamily: "Rubik_400Regular",
  },

  burgerIcon: {
    height: 24,
    width: 24,
  },

  burgerIconContainer: {
    paddingRight: 16,
  },
});
