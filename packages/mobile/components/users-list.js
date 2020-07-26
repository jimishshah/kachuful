import React from "react";
import { View, StyleSheet } from "react-native";
import Avatar from "./avatar";
import { DEFAULT_WINS } from "@kachuful/common";

function UsersList({ users }) {
  return (
    <View style={styles.usersList}>
      {users.map(({ playerName, wins: { currentWins, expectedWins }, ID }) => (
        <Avatar
          key={ID}
          playerName={playerName}
          badgeText={
            expectedWins === DEFAULT_WINS
              ? "..."
              : `${currentWins}/${expectedWins}`
          }
        />
      ))}
    </View>
  );
}

export default React.memo(UsersList);

const styles = StyleSheet.create({
  usersList: {
    paddingRight: 32,
    paddingTop: 8,
  },
});
