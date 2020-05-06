import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { ThemeProvider } from "emotion-theming";
import Game from "./pages/game";
import styled from "@emotion/styled";
import { StylesProvider } from "@material-ui/core/styles";
import HomeJudgement from "./pages/home-judgement";
import GameMock from "./pages/game-mock";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import Home from "./pages/home";

const trackingId = "UA-164323461-1"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(trackingId);

const history = createBrowserHistory();
history.listen((location) => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});
// const defaultTheme = createMuiTheme({
//   palette: {
//     primary: { main: "#175676" }, // 2274A5 // use rubik fonts
//   },
// });
const defaultTheme = createMuiTheme();

const StyledContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(2)}px;
  padding-bottom: 90px;
`;

function App() {
  const [connectionId, setConnectionId] = useState();

  const [users, setUsers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showAlert, setShowAlert] = useState({});
  const [scores, setScores] = useState([]);

  const assignConnectionId = (assignedConnectionId) => {
    setConnectionId(assignedConnectionId);
  };

  const props = {
    connectionId,
    assignConnectionId,
    users,
    setUsers,
    isGameStarted,
    setIsGameStarted,
    showAlert,
    setShowAlert,
    scores,
    setScores,
  };
  return (
    <MuiThemeProvider theme={defaultTheme}>
      <ThemeProvider theme={defaultTheme}>
        <StylesProvider injectFirst>
          <StyledContainer maxWidth="sm">
            <Router>
              <div>
                {/* <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/game">Start Games</Link>
                </li>
              </ul>
            </nav> */}

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                  <Route path="/judgement/game-mock">
                    <GameMock {...props} />
                  </Route>
                  <Route path="/judgement/game">
                    <Game {...props} />
                  </Route>
                  <Route path="/judgement/:tableId?">
                    <HomeJudgement {...props} />
                  </Route>
                  <Route path="/">
                    <Home />
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
