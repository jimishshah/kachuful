import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { gameRules } from "@kachuful/common";

function GameRules() {
  return (
    <>
      <Typography variant="h5" align="center">
        How to play
      </Typography>
      <List dense={true}>
        {gameRules.map((rule) => (
          <ListItem>
            <ListItemText>{rule}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default GameRules;
