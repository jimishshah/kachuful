import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Game from "../pages/game";
import { ThemeProvider } from "emotion-theming";
import { createMuiTheme } from "@material-ui/core/styles";
import socket from "../socket";

jest.useFakeTimers();
const defaultTheme = createMuiTheme();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
jest.mock("react-ga", () => ({
  initialize: jest.fn(),
  set: jest.fn(),
  pageview: jest.fn(),
}));
jest.mock("../socket", () => {
  const instance = {
    send: jest.fn(),
    close: jest.fn(),
  };
  return {
    getInstance: () => Promise.resolve(instance),
    hasInstance: () => true,
    instance,
  };
});

test("should be able to throw correct card", async () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 1, currentWins: 0 },
      cardsInHand: [
        { type: "heart", number: "3" },
        { type: "heart", number: "4" },
      ],
      sequenceNumber: 1,
      hasLevelStarted: true,
    },
  ]);
  const { getByAltText } = renderComponent(props);
  fireEvent.click(getByAltText("heart 3"));
  const ws = await socket.getInstance();
  expect(ws.send).toHaveBeenCalledWith(
    '{"action":"throwCard","message":{"cardThrown":{"type":"heart","number":"3"}}}'
  );
  ws.send.mockClear();
});
test("should finish round if everyone have thrown the card and current user is on first sequence", async () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 1, currentWins: 0 },
      cardThrown: { type: "club", number: "2" },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: true,
      tableId: "test-tableId",
    },
  ]);
  renderComponent(props);
  jest.runAllTimers();
  const ws = await socket.getInstance();
  expect(ws.send).toHaveBeenCalledWith(
    '{"action":"finishRound","message":{"tableId":"test-tableId"}}'
  );
  ws.send.mockClear();
});
test("should finish level if server says so and current user is on first sequence", async () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 1, currentWins: 0 },
      cardThrown: { type: "club", number: "2" },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: true,
      tableId: "test-tableId",
      shouldShowFinishLevel: true,
    },
  ]);
  renderComponent(props);
  jest.runAllTimers();
  const ws = await socket.getInstance();
  expect(ws.send).toHaveBeenCalledWith(
    '{"action":"finishLevel","message":{"tableId":"test-tableId"}}'
  );
  ws.send.mockClear();
});

test("should be able to submit my bid", async () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 99, currentWins: 99 },
      cardsInHand: [{ type: "club", number: "3" }],
      sequenceNumber: 2,
      hasLevelStarted: true,
    },
  ]);
  const { getByPlaceholderText, getByTestId } = renderComponent(props);
  fireEvent.change(getByPlaceholderText("My Bid"), { target: { value: "1" } });
  fireEvent.submit(getByTestId("bid-wins-form"));
  const ws = await socket.getInstance();
  expect(ws.send).toHaveBeenCalledWith(
    '{"action":"bidWins","message":{"myBid":"1"}}'
  );
  ws.send.mockClear();
});

test("should not be able to submit bid higher than card in hand", async () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 99, currentWins: 99 },
      cardsInHand: [{ type: "club", number: "3" }],
      sequenceNumber: 2,
      hasLevelStarted: true,
    },
  ]);
  const { getByPlaceholderText, getByTestId } = renderComponent(props);
  fireEvent.change(getByPlaceholderText("My Bid"), { target: { value: "7" } });
  fireEvent.submit(getByTestId("bid-wins-form"));
  const ws = await socket.getInstance();
  expect(ws.send).not.toHaveBeenCalled();
  ws.send.mockClear();
});

// test.only("should display message if user goes offline", async () => {
//   const props = getProps([
//     {
//       ID: 123,
//       playerName: "test-name",
//       wins: { expectedWins: 99, currentWins: 99 },
//       cardsInHand: [{ type: "club", number: "3" }],
//       sequenceNumber: 2,
//       hasLevelStarted: true,
//       setShowAlert: jest.fn(),
//     },
//   ]);
//   const { getByTitle } = renderComponent(props);
//   fireEvent.click(getByTitle("refresh button"));
//   jest.runAllTimers();
//   expect(props.setShowAlert).toHaveBeenCalledWith();
//   ws.send.mockClear();
// });

function getProps(users) {
  return {
    connectionId: 123,
    setUsers: jest.fn(),
    isGameStarted: true,
    setIsGameStarted: jest.fn(),
    showAlert: false,
    setShowAlert: jest.fn(),
    scores: [],
    setScores: jest.fn(),
    users: [...users],
  };
}

function renderComponent(props) {
  return render(
    <ThemeProvider theme={defaultTheme}>
      <Game {...props} />
    </ThemeProvider>
  );
}
