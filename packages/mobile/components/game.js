import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  Clipboard,
} from "react-native";
import * as Linking from "expo-linking";
import Card from "./card";
import CardsList from "./cards-list";
import Avatar from "./avatar";
import StyleGuideDivider from "./styleguide-divider";
import ScoreCard from "./score-card";
import { PageContainer } from "./page-container";
import { linkBase, useGame, DEFAULT_WINS } from "@kachuful/common";
import ProgressSteps from "./progress-steps";
import Button from "./button";
import { MyTextRegular } from "./my-text";
import whatsappPng from "@kachuful/common/png/whatsapp.png";
import UsersList from "./users-list";

const fontSize = 14;

function Game({ connectionId: currentUserId, setConnectionId }) {
  const {
    currentUser,
    users,
    leaveTheTable,
    bidWins,
    throwCard,
    startGameButton,
    showAlert,
    scores,
    clearShowAlert,
    hostPlayer,
    helpDialog,
    toggleHelpDialog,
    drawer,
    toggleDrawer,
    messageUs,
    shouldDisableMyCards,
    cardsThrown,
    cardsInHand,
  } = useGame({ currentUserId, setConnectionId });
  const linkToShare = `${linkBase}/judgement/${currentUser.tableId}?utm_source=app&utm_medium=whatsapp&utm_campaign=invite`;

  const { hasGameStarted } = currentUser;
  const pageContainerProps = {
    hasGameStarted,
    bidWins,
    currentUser,
    showAlert,
    clearShowAlert,
    leaveTheTable,
  };

  const copyToClipboard = useCallback(() => Clipboard.setString(linkToShare), [
    linkToShare,
  ]);
  return (
    <PageContainer hasGameStarted={hasGameStarted} {...pageContainerProps}>
      {!hasGameStarted && currentUser.playerName && (
        <ProgressSteps activeStep={1} isCreate={currentUser.isHost} />
      )}
      <View style={styles.topContainer}>
        <UsersList users={users} />
        {hasGameStarted && (
          <View style={styles.cardListContainer}>
            <CardsList title="Play Table" cards={cardsThrown} />
            <StyleGuideDivider />
            <CardsList
              title="My Cards"
              cards={cardsInHand}
              clickHandler={throwCard}
            />
          </View>
        )}
      </View>
      {!hasGameStarted && (
        <>
          {currentUser.isHost ? (
            <Button title="START GAME" color="primary" {...startGameButton} />
          ) : (
            <MyTextRegular>
              {Boolean(hostPlayer.playerName)
                ? `Waiting for ${hostPlayer.playerName} to start the game`
                : "Loading..."}
            </MyTextRegular>
          )}
          <MyTextRegular>
            <Text style={styles.textsm}>
              Share the link below and invite your friends to join your game,
              players are not allowed to join once the game is started. Only
              Host can start the game.
            </Text>
          </MyTextRegular>
          <View style={styles.linkBox}>
            <MyTextRegular>
              <Text style={styles.textsm}>{linkToShare}</Text>
            </MyTextRegular>
          </View>
          <Button
            title="COPY LINK"
            color="secondary"
            onPress={() => copyToClipboard()}
          />
          <View style={styles.whatsappIconContainer}>
            <MyTextRegular>Send on:</MyTextRegular>
            <TouchableHighlight
              onPress={() =>
                Linking.openURL(
                  `https://api.whatsapp.com/send?text=Join our game ${linkToShare}`
                )
              }
            >
              <Image source={whatsappPng} style={styles.social} />
            </TouchableHighlight>
          </View>
        </>
      )}
      {hasGameStarted && (
        <>
          <StyleGuideDivider />
          <ScoreCard scores={scores} />
        </>
      )}
      <StyleGuideDivider />
    </PageContainer>
  );
}

export default Game;

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
