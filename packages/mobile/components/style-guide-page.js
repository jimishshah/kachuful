import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Card from "./card";
import CardsList from "./cards-list";
import Avatar from "./avatar";
import StyleGuideDivider from "./styleguide-divider";
import ScoreCard from "./score-card";
import { PageContainer } from "./page-container";
import ProgressSteps from "./progress-steps";
import Button from "./button";
import { MyTextRegular } from "./my-text";
import whatsappPng from "@kachuful/common/png/whatsapp.png";
import Alert from "./alert";

const fontSize = 14;

function StyleGuide() {
  return (
    <PageContainer>
      <ProgressSteps activeStep="2" />
      <View style={styles.topContainer}>
        <View style={styles.usersList}>
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
        </View>
        <View style={styles.cardListContainer}>
          <Button title="START GAME" color="primary" />
          <MyTextRegular>
            <Text style={styles.textsm}>
              Share the link below and invite your friends to join your game,
              players are not allowed to join once the game is started. Only
              Host can start the game.
            </Text>
          </MyTextRegular>
          <View style={styles.linkBox}>
            <MyTextRegular>
              <Text style={styles.textsm}>
                http://localhost:3000/judgement/1594290337734-607?utm_source=app&utm_medium=whatsapp&utm_campaign=invite
              </Text>
            </MyTextRegular>
          </View>
          <Button title="COPY LINK" color="secondary" />
          <View style={styles.whatsappIconContainer}>
            <MyTextRegular>Send on:</MyTextRegular>
            <Image source={whatsappPng} style={styles.social} />
          </View>
        </View>
      </View>
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />

      <View style={styles.topContainer}>
        <View style={styles.usersList}>
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
          <Avatar badgeText="..." playerName="kk" />
        </View>
        <View style={styles.cardListContainer}>
          <CardsList title="Play Table">
            <Card text="Q" type="diamondPng" badge="KK" />
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
          <CardsList title="My Cards">
            <Card text="J" type="diamondPng" badge="KK" />
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
        </View>
      </View>

      <StyleGuideDivider />
      <StyleGuideDivider />
      <ScoreCard />
      <StyleGuideDivider />
      <Alert severity="success">Success</Alert>
      <Alert severity="error">Error</Alert>
      <Alert severity="info">Info</Alert>
      <StyleGuideDivider />
      <StyleGuideDivider />
      <StyleGuideDivider />
    </PageContainer>
  );
}

export default StyleGuide;

const containerCss = {
  fontFamily: "Rubik_400Regular",
  fontSize,
  paddingVertical: 48,
  paddingHorizontal: 16,
  backgroundColor: "white",
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  container: containerCss,
  containerOnMenuOpened: {
    ...containerCss,
    opacity: 0.2,
    backgroundColor: "grey",
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  usersList: {
    paddingRight: 32,
    paddingTop: 8,
  },
  cardListContainer: {
    flex: 1,
  },
  textsm: {
    fontSize: 13,
  },
  linkBox: {
    backgroundColor: "rgb(224, 224, 224)",
    padding: 8,
    textAlign: "center",
    marginTop: 8,
  },
  social: {
    height: 45,
    width: 45,
    marginTop: 8,
  },
  whatsappIconContainer: {
    alignItems: "center",
  },
});
