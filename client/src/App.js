import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { ThemeProvider } from "emotion-theming";
import Game from "./pages/game";
import styled from "@emotion/styled";
import { StylesProvider } from "@material-ui/core/styles";
import Home from "./pages/home";
import GameMock from "./pages/game-mock";

const defaultTheme = createMuiTheme();

const StyledContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(2)}px;
  padding-bottom: 90px;
`;

function App() {
  const [connectionId, setConnectionId] = useState();

  const [users, setUsers] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [roundWinner, setRoundWinner] = useState("");
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
    roundWinner,
    setRoundWinner,
    scores,
    setScores,
  };
  return (
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
                <Route path="/game-mock">
                  <GameMock {...props} />
                </Route>
                <Route path="/game">
                  <Game {...props} />
                </Route>
                <Route path="/:tableId?">
                  <Home {...props} />
                </Route>
              </Switch>
            </div>
          </Router>
        </StyledContainer>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
