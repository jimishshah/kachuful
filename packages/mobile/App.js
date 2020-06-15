import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useFonts, Rubik_400Regular } from "@expo-google-fonts/rubik";
import Card from "./components/card";
import CardsList from "./components/cards-list";
import Avatar from "./components/avatar";
import StyleGuideDivider from "./components/styleguide-divider";
import ScoreCard from "./components/score-card";
import ActionBar from "./components/action-bar";

const fontSize = 14;
const paddingVertical = 6;

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });
  console.log(fontsLoaded);
  return (
    fontsLoaded && (
      <ScrollView style={styles.container}>
        <ActionBar />

        <CardsList title="Play Table">
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
          <Card text="K" type="clubPng" badge="KK" />
        </CardsList>
        <StyleGuideDivider />
        <Avatar />
        <StyleGuideDivider />
        <ScoreCard />
        <StyleGuideDivider />
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Rubik_400Regular",
    fontSize,
    paddingVertical,
    paddingTop: 24,
    paddingBottom: 24,
  },
});
