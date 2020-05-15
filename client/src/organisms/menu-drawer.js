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

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export default function MenuDrawer({
  drawer,
  toggleDrawer,
  leaveTheTable,
  openDialogHandler,
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
        <ListItem button key={"Help"} onClick={openDialogHandler}>
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary={"Help"} />
        </ListItem>
        <ListItem button key={"Exit Game"} onClick={leaveTheTable}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={"Exit Game"} />
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
              Send Feedback
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
