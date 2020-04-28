import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ProfilePic from "../images/profile-pic.jpg";
import styled from "@emotion/styled";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

const StyledAvatar = styled(Avatar)`
  width: ${({ theme }) => theme.spacing(12)}px;
  height: ${({ theme }) => theme.spacing(12)}px;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledLinkedInIcon = styled(LinkedInIcon)`
  margin-left: -4px;
`;
function Home() {
  const history = useHistory();
  return (
    <>
      <StyledAvatar alt="Jimish Shah" src={ProfilePic} />
      <List dense={true}>
        <ListItem>
          <ListItemText>Hello Everyone,</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            My name is Jimish Shah. I am a software developer from Manchester,
            UK.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Due to current situation with coronavirus it has not been possible
            to meet our friends but that should not stop us from playing games
            with them and keep us entertained.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            I created thecardgames.net to bring unique and entertaining card
            games that can be played with friends and family.
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>I hope you all enjoy it.</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            Thank you,
            <br />
            Jimish Shah
            <br />
            <a href="https://www.linkedin.com/in/jimishshah/" target="_blank">
              <StyledLinkedInIcon fontSize="large" color="action" />
            </a>
          </ListItemText>
        </ListItem>
      </List>
      <br />
      <StyledButton
        variant="contained"
        color="secondary"
        onClick={() => {
          history.push("/judgement");
        }}
      >
        Play Judgement Now
      </StyledButton>
    </>
  );
}

export default Home;
