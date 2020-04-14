import React from "react";
import styled from "@emotion/styled";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import ClubLogo from "../svg/club.svg";
import DiamondLogo from "../svg/diamond.svg";
import SpadeLogo from "../svg/spade.svg";
import HeartLogo from "../svg/heart.svg";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";

const cardColours = {
  club: ClubLogo,
  diamond: DiamondLogo,
  spade: SpadeLogo,
  heart: HeartLogo,
};

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)}px;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  width: ${({ theme }) => theme.spacing(6)}px;
`;

const StyledGrid = styled(Grid)`
  flex-grow: 0;
`;

const StyledDivder = styled(Divider)`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  margin-bottom: ${({ theme }) => theme.spacing(3)}px;
`;

function GameTemplate({
  currentUserId,
  users,
  currentLevel,
  onEveryonePlayed,
}) {
  const userIds = users.map(({ userId }) => userId);
  return (
    <>
      <StyledGrid container spacing={3}>
        <StyledGrid item xs={3}>
          <StyledGrid container spacing={3}>
            {users.map(({ name, userId }) => (
              <StyledGrid item xs>
                <Badge
                  color="primary"
                  badgeContent={`
                    ${currentLevel.users[userId].wins.currentWins}/${currentLevel.users[userId].wins.expectedWins}
                  `}
                  showZero
                >
                  <Avatar>{name.slice(0, 2).toUpperCase()}</Avatar>
                </Badge>
              </StyledGrid>
            ))}
          </StyledGrid>
        </StyledGrid>
        <StyledGrid item xs={9}>
          <StyledGrid container spacing={3}>
            {userIds.map((userId) => (
              <StyledGrid item xs>
                <StyledPaper>
                  {currentLevel.users[userId].cardThrown ? (
                    <>
                      <strong>
                        {currentLevel.users[userId].cardThrown.number}
                      </strong>
                      <img
                        src={
                          cardColours[
                            currentLevel.users[userId].cardThrown.type
                          ]
                        }
                        alt="club"
                      />
                    </>
                  ) : (
                    `Waiting card from ${getName(userId, users)}`
                  )}
                </StyledPaper>
              </StyledGrid>
            ))}
          </StyledGrid>
        </StyledGrid>
      </StyledGrid>
      <StyledDivder />
      <StyledGrid container spacing={4}>
        {currentLevel.users[currentUserId].cardsInHand.map(
          ({ number, type }) => (
            <StyledGrid item xs>
              <StyledPaper>
                {number}
                <img src={cardColours[type]} alt="club" />
              </StyledPaper>
            </StyledGrid>
          )
        )}
      </StyledGrid>
    </>
  );
}

function getName(userId, users) {
  const user = users.find((user) => user.userId === userId);
  return user.name;
}

export default GameTemplate;
