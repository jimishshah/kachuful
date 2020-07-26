import React, { useState } from "react";

import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import MenuDrawer from "./menu-drawer";
import ActionBar from "./action-bar";
import Alert from "./alert";
const fontSize = 14;

export function GamePageContainer({ children }) {
  const [isMenuOpen, toggleMenuOpen] = useState(false);
  return (
    <SafeAreaView style={styles.app}>
      <MenuDrawer isMenuOpen={isMenuOpen} onChange={toggleMenuOpen}>
        <ScrollView
          style={[isMenuOpen ? styles.containerOnMenuOpened : styles.container]}
        >
          {children}
        </ScrollView>
        <ActionBar onMenuButtonClick={toggleMenuOpen} />
      </MenuDrawer>
    </SafeAreaView>
  );
}
export function PageContainer({
  children,
  hasGameStarted,
  bidWins,
  currentUser,
  showAlert,
  clearShowAlert,
  leaveTheTable,
}) {
  const [isMenuOpen, toggleMenuOpen] = useState(false);
  const actionBarProps = { bidWins, currentUser };

  return (
    <>
      {hasGameStarted ? (
        <SafeAreaView style={styles.app}>
          <MenuDrawer
            isMenuOpen={isMenuOpen}
            onChange={toggleMenuOpen}
            leaveTheTable={leaveTheTable}
          >
            <ScrollView
              style={[
                isMenuOpen ? styles.containerOnMenuOpened : styles.container,
              ]}
            >
              {children}
            </ScrollView>
            {showAlert && clearShowAlert && (
              <Alert
                severity={showAlert.severity}
                clearShowAlert={clearShowAlert}
              >
                {showAlert.message}
              </Alert>
            )}
            <ActionBar onMenuButtonClick={toggleMenuOpen} {...actionBarProps} />
          </MenuDrawer>
        </SafeAreaView>
      ) : (
        <ScrollView style={[styles.container]}>{children}</ScrollView>
      )}
    </>
  );
}

const containerCss = {
  fontFamily: "Rubik_400Regular",
  fontSize,
  // paddingBottom: 48,
  // paddingTop: 12,
  paddingVertical: 48,
  paddingHorizontal: 16,
  backgroundColor: "white",
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  container: containerCss,
  containerOnMenuOpened: {
    ...containerCss,
    opacity: 0.2,
    backgroundColor: "grey",
  },
});
