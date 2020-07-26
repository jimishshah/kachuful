import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { MyTextRegular } from "./my-text";

function ProgressSteps({ activeStep, isCreate }) {
  return (
    <View style={styles.container}>
      <Step
        number="1"
        text={isCreate ? "Create Game" : "Join Game"}
        isActive={activeStep === "1"}
      />
      <Line />
      <Step
        number="2"
        text="Invite Friends & Start Game"
        isActive={activeStep === "2"}
      />
      <Line />
      <Step number="3" text="Play" isActive={activeStep === "3"} />
    </View>
  );
}

export default ProgressSteps;

function Step({ number, text, isActive }) {
  return (
    <View style={styles.step}>
      <View style={[styles.number, isActive && styles.numberActive]}>
        <Text style={styles.numberText}>
          <MyTextRegular>{number}</MyTextRegular>
        </Text>
      </View>
      <Text style={[styles.text, isActive && styles.textActive]}>
        <MyTextRegular>{text}</MyTextRegular>
      </Text>
    </View>
  );
}

function Line() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  number: {
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  numberActive: {
    backgroundColor: "#0a2463",
  },
  numberText: {
    color: "#fafafa",
  },
  text: {
    color: "rgba(0, 0, 0, 0.54)",
  },

  textActive: {
    color: "rgba(0, 0, 0, 0.87)",
  },

  step: {
    alignItems: "center",
    width: 100,
  },
  line: {
    borderTopColor: "#bdbdbd",
    marginLeft: -30,
    marginRight: -30,
    width: 60,
    borderTopWidth: 1,
    marginTop: 12,
  },
});
