import React from "react";
import { StyleSheet, TextInput as TI, Text, View } from "react-native";

function TextInput({ onChangeText, value, placeholder, helperText }) {
  return (
    <View style={styles.container}>
      <TI
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
      />
      <Text style={styles.helperText}>{helperText}</Text>
    </View>
  );
}

export default TextInput;

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  input: {
    height: 40,
    borderColor: "rgb(195, 195, 195)",
    borderWidth: 1,
    paddingVertical: 10.5,
    paddingHorizontal: 14,
    borderRadius: 4,
    fontFamily: "Rubik_400Regular",
  },
  helperText: {
    fontFamily: "Rubik_400Regular",
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.54)",
    padding: 4,
  },
});
