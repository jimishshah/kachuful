import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Typography from "@material-ui/core/Typography";
import styled from "@emotion/styled";
import { DEFAULT_WINS, cardColours } from "../constants";
import AppBar from "@material-ui/core/AppBar";
import BidWin from "../organisms/bid-win";

const StyledGrid = styled(Grid)`
  flex-grow: 0;
  text-align: center;
`;

const StyledAppBar = styled(AppBar)`
  top: auto;
  bottom: 0;
  /* background-color: #d9d7d6; */
`;

const BoxContainer = styled(Box)`
  padding: 8px 0;
`;

const StyledImg = styled.img`
  width: 35px;
  display: block;
  margin: 0 auto;
  background-color: white;
  padding: 5px;
`;
function ActionBar({ bidWins, currentUser, openDialogHandler }) {
  return (
    <StyledAppBar position="fixed" color="primary">
      <Container maxWidth="sm">
        <StyledAppBar position="fixed" color="primary">
          <Container maxWidth="sm">
            <BoxContainer display="flex">
              {/* <Box pr={2} pt={2}>
          <PowerSettingsNewRoundedIcon
            variant="outlined"
            color="secondary"
            onClick={leaveTheTable}
          />
        </Box> */}
              <Box pr={2} pt={2}>
                <HelpOutlineIcon
                  variant="outlined"
                  color="secondary"
                  onClick={openDialogHandler}
                />
              </Box>
              {currentUser.hasLevelStarted && (
                <Box pr={2}>
                  <StyledGrid item xs={12}>
                    <StyledImg
                      src={cardColours[currentUser.lastTrumpColour]}
                      alt={currentUser.lastTrumpColour}
                    />
                  </StyledGrid>
                  <StyledGrid item xs={12}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Trump
                    </Typography>
                  </StyledGrid>
                </Box>
              )}
              {/* <Button variant="contained" color="primary" onClick={sendMessage}>
          Send message
        </Button> */}
              {currentUser.wins.currentWins === DEFAULT_WINS &&
                currentUser.hasLevelStarted && (
                  <Box flexGrow={1}>
                    <BidWin bidWins={bidWins} />
                  </Box>
                )}
            </BoxContainer>
          </Container>
        </StyledAppBar>
      </Container>
    </StyledAppBar>
  );
}

export default ActionBar;
