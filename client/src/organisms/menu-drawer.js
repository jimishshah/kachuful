import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ChatIcon from "@material-ui/icons/Chat";
import Link from "@material-ui/core/Link";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import Divider from "@material-ui/core/Divider";
import logo from "../images/logo.png";
import styled from "@emotion/styled";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

const StyledListItem = styled(ListItem)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: -8px;
  justify-content: center;
`;

export default function MenuDrawer({
  drawer,
  toggleDrawer,
  leaveTheTable,
  toggleHelpDialog,
  messageUs,
}) {
  const classes = useStyles();

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <StyledListItem button key={"logo"}>
          <img src={logo} width="150" alt="judment game logo" />
        </StyledListItem>
        <ListItem button key={"Help"} onClick={toggleHelpDialog}>
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary={"Help"} />
        </ListItem>
        <ListItem button key={"Message us"} onClick={messageUs}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText>
            <Link
              href="https://m.me/110348247329359?fbclid=IwAR3XTGmmGvw3RRKzv--41FAQjJ75q0KJhfGM54LBUBWMz372DZ6FQn6x_x8"
              target="_blank"
              color="inherit"
            >
              Contact Us
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem button key={"Exit Game"} onClick={leaveTheTable}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={"Exit Game"} />
        </ListItem>
        <Divider />
        <ListItem button key={"Follow us"}>
          <ListItemIcon></ListItemIcon>
          <ListItemText>
            <Link
              href="https://www.facebook.com/thecardgames"
              target="_blank"
              color="inherit"
            >
              <FacebookIcon fontSize="large" color="secondary" />
              <Link
                href="https://www.instagram.com/thecardgames/"
                target="_blank"
                color="inherit"
              >
                <InstagramIcon fontSize="large" color="secondary" />
              </Link>
            </Link>
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      {["left", "right", "top", "bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={drawer[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
