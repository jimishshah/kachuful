import React from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import styled from "@emotion/styled";
import { DEFAULT_WINS } from "../constants";

const StyledGrid = styled(Grid)`
  flex-grow: 0;
`;
function UsersList({ users }) {
  return users.map(
    ({ playerName, wins: { currentWins, expectedWins }, ID }) => {
      const badgeText =
        expectedWins === DEFAULT_WINS
          ? "..."
          : `${currentWins}/${expectedWins}`;
      return (
        <StyledGrid item xs key={ID}>
          <Badge color="primary" badgeContent={badgeText} showZero>
            <Avatar>{playerName.slice(0, 2).toUpperCase()}</Avatar>
          </Badge>
        </StyledGrid>
      );
    }
  );
}

export default UsersList;
