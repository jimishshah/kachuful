import "react-native-gesture-handler";
import React from "react";
import { useFonts, Rubik_400Regular } from "@expo-google-fonts/rubik";
import HomeJudgement from "./components/home-judgement";
import { NativeRouter, Route, Link, Switch } from "react-router-native";
import Game from "./components/game";
import useApp from "@kachuful/common/controllers/use-app";

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
  });

  const props = useApp();

  return (
    fontsLoaded && (
      <NativeRouter>
        <Switch>
          <Route path="/judgement/game">
            <Game {...props} />
          </Route>
          <Route path="/judgement/:tableId?">
            <HomeJudgement {...props} />
          </Route>
          <Route path="/">
            <HomeJudgement {...props} />
          </Route>
        </Switch>
      </NativeRouter>
    )
  );
}
