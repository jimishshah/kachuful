import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import styled from "@emotion/styled";
import { DEFAULT_WINS, cardColours } from "../constants";
import AppBar from "@material-ui/core/AppBar";
import BidWin from "../organisms/bid-win";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

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
function ActionBar({
  bidWins,
  currentUser: {
    hasLevelStarted,
    lastTrumpColour,
    wins: { currentWins },
  },
  toggleDrawer,
}) {
  return (
    <StyledAppBar position="fixed" color="primary">
      <Container maxWidth="sm">
        <StyledAppBar position="fixed" color="primary">
          <Container maxWidth="sm">
            <BoxContainer display="flex">
              <Box pr={2} pt={1.1}>
                <IconButton color="inherit">
                  <MenuIcon onClick={toggleDrawer("left", true)} />
                </IconButton>
              </Box>
              {hasLevelStarted && (
                <Box pr={2} pt={1} textAlign="center">
                  <StyledImg
                    src={cardColours[lastTrumpColour]}
                    alt={lastTrumpColour}
                  />
                  <Typography variant="caption" display="block">
                    Trump
                  </Typography>
                </Box>
              )}
              {currentWins === DEFAULT_WINS && hasLevelStarted && (
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
