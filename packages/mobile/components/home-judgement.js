import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { PageContainer } from "./page-container";
import ProgressSteps from "./progress-steps";
import TextInput from "./text-input";
import Button from "./button";
import GameRules from "./game-rules";
import useHomeJudgment from "@kachuful/common/controllers/use-home-judgement";
import { MyTextBold } from "./my-text";

function HomeJudgement(props) {
  const {
    tableId,
    setPlayerName,
    joinTableButton,
    resumeGameButton,
    endOldGameButton,
  } = useHomeJudgment(props);
  const { connectionId } = props;
  return (
    <PageContainer>
      {!connectionId ? (
        <>
          <ProgressSteps activeStep="1" isCreate={tableId ? false : true} />
          <TextInput
            maxLength={6}
            placeholder="Enter your name"
            helperText="* Maximum 6 characters"
            onChangeText={(text) => setPlayerName(text)}
          />
          <Button title="CREATE GAME" color="secondary" {...joinTableButton} />
          <GameRules />
        </>
      ) : (
        <>
          <MyTextBold>
            You did not end your previous game, What do you want to do ?
          </MyTextBold>
          <Button title="RESUME GAME" color="secondary" {...resumeGameButton} />
          <Button title="END GAME" color="primary" {...endOldGameButton} />
        </>
      )}
    </PageContainer>
  );
}

export default HomeJudgement;
