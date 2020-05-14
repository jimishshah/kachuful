import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

function GameRules() {
  return (
    <>
      <Typography variant="h5" align="center">
        How to play
      </Typography>
      <List dense={true}>
        <ListItem>
          <ListItemText>
            1. Each Player gets 1 card in Level 1, 2 cards in Level 2 and so on
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            2. Trump type changes on every level. In rotational order of Spade,
            Diamond, Club & Heart.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            3. Each Player need to predict wins in the level before first player
            throws card
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            4. Each player throws one card, first player's card decides the type
            other players should throw, highest card player wins the round
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            5. If player don't have same type card then Trump type could be
            thrown and that takes precedence, if player don't have Trump type
            card then any card can be thrown
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            6. Each player that wins exact same rounds as predicted, wins the
            level
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            7. Every Level winning player will get 10 + predicted win points. eg
            if predicted win was 2, player gets 10 + 2 = 12 points
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            8. Player with the highest total points in the score card wins.
          </ListItemText>
        </ListItem>
      </List>
    </>
  );
}

export default GameRules;
