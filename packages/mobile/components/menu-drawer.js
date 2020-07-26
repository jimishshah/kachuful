import React from "react";
import { StyleSheet, View, Image } from "react-native";
import * as Linking from "expo-linking";
import { List, ListItem, ListItemText, ListIcon, Divider } from "./list";
import { MyTextRegular } from "./my-text";
import logoPng from "@kachuful/common/png/logo.png";
import helpPng from "@kachuful/common/png/help.png";
import chatPng from "@kachuful/common/png/chat.png";
import exitPng from "@kachuful/common/png/exit.png";
import facebookPng from "@kachuful/common/png/facebook.png";
import instagramPng from "@kachuful/common/png/instagram.png";
import SideMenu from "react-native-side-menu";
import { TouchableHighlight } from "react-native-gesture-handler";

function MenuDrawer({
  children,
  isMenuOpen,
  onChange: onChangeHandler,
  navigateTo,
  leaveTheTable,
}) {
  const menu = <Menu navigateTo={navigateTo} leaveTheTable={leaveTheTable} />;
  return (
    <SideMenu
      isOpen={isMenuOpen}
      menu={menu}
      onChange={(status) => onChangeHandler(status)}
    >
      {children}
    </SideMenu>
  );
}

const Menu = React.memo(({ leaveTheTable }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoPng} style={styles.logoImage} />
      </View>
      <List>
        {/* <ListItem>
          <ListIcon icon={helpPng} />
          <ListItemText>
            <MyTextRegular fontSize={16}>Help</MyTextRegular>
          </ListItemText>
        </ListItem> */}
        <ListItem>
          <ListIcon icon={chatPng} />
          <TouchableHighlight
            onPress={() =>
              Linking.openURL(
                "https://m.me/110348247329359?fbclid=IwAR3XTGmmGvw3RRKzv--41FAQjJ75q0KJhfGM54LBUBWMz372DZ6FQn6x_x8"
              )
            }
          >
            <ListItemText>
              <MyTextRegular fontSize={16}>Contact Us</MyTextRegular>
            </ListItemText>
          </TouchableHighlight>
        </ListItem>
        <ListItem>
          <ListIcon icon={exitPng} />
          <TouchableHighlight onPress={leaveTheTable}>
            <ListItemText>
              <MyTextRegular fontSize={16}>Exit</MyTextRegular>
            </ListItemText>
          </TouchableHighlight>
        </ListItem>
        <ListItem>
          <Divider />
        </ListItem>
        <ListItem>
          <ListIcon />
          <TouchableHighlight
            onPress={() => {
              console.log("calling facebook");
              Linking.openURL("https://www.facebook.com/thecardgames");
            }}
          >
            <Image source={facebookPng} style={styles.social} />
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() =>
              Linking.openURL("https://www.instagram.com/thecardgames/")
            }
          >
            <Image source={instagramPng} style={styles.social} />
          </TouchableHighlight>
        </ListItem>
      </List>
    </View>
  );
});

export default MenuDrawer;

const styles = StyleSheet.create({
  container: {
    // paddingTop: 48,
    borderColor: "red",
    backgroundColor: "white",
    flex: 1,
  },
  logoContainer: {
    backgroundColor: "#0a2463",
    alignItems: "center",
    paddingVertical: 8,
  },
  logoImage: {
    width: 200,
    height: 50,
    resizeMode: "contain",
  },
  social: {
    height: 35,
    width: 35,
    marginRight: 8,
  },
});
