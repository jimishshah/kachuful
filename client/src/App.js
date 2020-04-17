import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { ThemeProvider } from "emotion-theming";
import Game from "./pages/game";
import styled from "@emotion/styled";
import { StylesProvider } from "@material-ui/core/styles";
import Home from "./pages/home";

const defaultTheme = createMuiTheme();

const StyledContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.spacing(2)}px;
`;

function App() {
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
                <Route path="/game">
                  <Game />
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
  );
}

export default App;
