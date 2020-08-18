import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { ThemeProvider } from "emotion-theming";
import Game from "./pages/game";
import styled from "@emotion/styled";
import { StylesProvider } from "@material-ui/core/styles";
import HomeJudgement from "./pages/home-judgement";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import useApp from "@kachuful/common/controllers/use-app";

const GameMock = React.lazy(() => import("./pages/game-mock"));
const Home = React.lazy(() => import("./pages/home"));

const trackingId = "UA-164323461-1"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId, {
  gaOptions: { cookieFlags: "max-age=31536000;secure;samesite=none" },
});
// ReactGA.initialize(trackingId);

const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});
const defaultTheme = createMuiTheme({
  palette: {
    primary: { main: "#0a2463" }, // 254E70 2274A5 // use rubik fonts
  },
  typography: {
    fontFamily: ["Rubik"],
  },
});
// const defaultTheme = createMuiTheme();

const StyledContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(2)}px;
  padding-bottom: 90px;
`;

function App() {
  const props = useApp();
  return (
    <MuiThemeProvider theme={defaultTheme}>
      <ThemeProvider theme={defaultTheme}>
        <StylesProvider injectFirst>
          <StyledContainer maxWidth="sm">
            <Router>
              <div>
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                  <Route path="/judgement/game-mock">
                    <Suspense fallback={<div>Loading...</div>}>
                      <GameMock {...props} />
                    </Suspense>
                  </Route>
                  <Route path="/judgement/game">
                    <Game {...props} />
                  </Route>
                  <Route path="/judgement/:tableId?">
                    <HomeJudgement {...props} />
                  </Route>
                  <Route path="/">
                    <Suspense fallback={<div>Loading...</div>}>
                      <Home />
                    </Suspense>
                  </Route>
                </Switch>
              </div>
            </Router>
          </StyledContainer>
        </StylesProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
