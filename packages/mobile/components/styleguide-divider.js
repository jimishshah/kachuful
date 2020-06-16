import React from "react";
import { StyleSheet, View } from "react-native";
function StyleGuideDivider() {
  return <View style={styles.base} />;
}

export default StyleGuideDivider;

const styles = StyleSheet.create({
  base: {
    marginTop: 12,
    marginBottom: 12,
  },
});
