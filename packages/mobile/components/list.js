import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from "react-native";

export function List({ children }) {
  return <View style={styles.list}>{children}</View>;
}

export function ListItem({ children, onPress }) {
  return (
    <TouchableHighlight onPress={onPress}>
      <View style={styles.listItem}>{children}</View>
    </TouchableHighlight>
  );
}

export function ListIcon({ icon }) {
  return (
    <View style={styles.listIcon}>
      <Image style={styles.listIconImage} source={icon} />
    </View>
  );
}

export function ListItemText({ children }) {
  return <Text style={styles.listText}>{children}</Text>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  list: {
    // paddingVertical: 8,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
  },
  listIcon: {
    minWidth: 56,
  },
  listIconImage: {
    height: 24,
    width: 24,
  },

  listText: {
    paddingVertical: 4,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
});
