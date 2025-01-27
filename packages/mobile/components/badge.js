import React from "react";
import { StyleSheet, View, Text } from "react-native";
function Badge({ text, color }) {
  return (
    <>
      {Boolean(text) && (
        <View
          style={[styles.badge, color === "primary" && styles.badgePrimary]}
        >
          <Text style={styles.badgeText}>{text}</Text>
        </View>
      )}
    </>
  );
}

export default Badge;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#f50057",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    top: 0,
    right: 0,
    marginTop: -19,
    marginRight: -44,
  },
  badgePrimary: {
    backgroundColor: "#0a2463",
  },
  badgeText: {
    color: "#fff",
  },
});
