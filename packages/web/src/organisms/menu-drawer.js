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
import GooglePlayStoreLogo from "../images/google-play-badge.png";
import AppleStoreLogo from "../images/apple-store-logo.png";
import ReactGA from "react-ga";

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

function MenuDrawer({
  drawer,
  toggleDrawer,
  leaveTheTable,
  toggleHelpDialog,
  messageUs,
  reCreateConnectionManuallyHandler,
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
        {/* <ListItem
          button
          key={"Reconnect"}
          onClick={reCreateConnectionManuallyHandler}
        >
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary={"Reconnect"} />
        </ListItem> */}
        <ListItem button key={"Contact us"} onClick={messageUs}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText
            onClick={() =>
              ReactGA.event({
                category: "Menu",
                action: "Contact Us",
              })
            }
          >
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
        <ListItem button key={"Download App"}>
          <ListItemText
            onClick={() =>
              ReactGA.event({
                category: "Menu",
                action: "Android App Link",
              })
            }
          >
            <Link
              href="https://play.google.com/store/apps/details?id=net.thecardgames.twa"
              target="_blank"
              color="inherit"
            >
              <img
                src={GooglePlayStoreLogo}
                width="150"
                alt="Google player store logo"
              />
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText
            onClick={() =>
              ReactGA.event({
                category: "Menu",
                action: "Apple store Link",
              })
            }
          >
            <img src={AppleStoreLogo} width="150" alt="Apple store logo" />
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem button key={"Follow us"}>
          <ListItemText>
            <Link
              href="https://www.facebook.com/thecardgames"
              target="_blank"
              color="inherit"
              onClick={() =>
                ReactGA.event({
                  category: "Menu",
                  action: "Facebook Link",
                })
              }
            >
              <FacebookIcon fontSize="large" color="secondary" />
              <Link
                href="https://www.instagram.com/thecardgames/"
                target="_blank"
                color="inherit"
                onClick={() =>
                  ReactGA.event({
                    category: "Menu",
                    action: "Instagram Link",
                  })
                }
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

export default React.memo(MenuDrawer);
