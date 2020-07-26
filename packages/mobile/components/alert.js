import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from "react-native";
import { MyTextRegular } from "./my-text";

function Alert({ onClose, severity, children, clearShowAlert }) {
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      clearShowAlert();
    }, 6000);
  }, [children, severity, clearShowAlert]);
  return (
    <>
      {showAlert && (
        <View style={[styles.container, styles[severity]]}>
          <MyTextRegular>
            <Text style={styles.text}>{children}</Text>
          </MyTextRegular>
        </View>
      )}
    </>
  );
}

export default React.memo(Alert);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  success: {
    backgroundColor: "#4caf50",
  },
  info: {
    backgroundColor: "#2196f3",
  },
  error: {
    backgroundColor: "#f44336",
  },
});
