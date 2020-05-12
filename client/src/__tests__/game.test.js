import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Game from "../pages/game";
import WS from "jest-websocket-mock";
import { ThemeProvider } from "emotion-theming";
import { createMuiTheme } from "@material-ui/core/styles";

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

const server = new WS("ws://localhost:3001");
test("show loading message and call refresh if players are empty", async () => {
  const props = {
    ...getProps([]),
  };
  const { getByText } = renderComponent(props);
  const loadingMessage = getByText("Loading.....");
  expect(loadingMessage).toBeInTheDocument();
  await expect(server).toReceiveMessage(
    '{"action":"refreshData","message":""}'
  );
});

test("should not show enter bid if player has already bidded", () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 1, currentWins: 0 },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: true,
      hasGameStarted: true,
    },
  ]);
  const { queryByPlaceholderText } = renderComponent(props);
  const bidwinsComponent = queryByPlaceholderText("My Bid");
  expect(bidwinsComponent).toBeNull();
});

test("should show enter bid if player has already bidded", () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 99, currentWins: 99 },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: true,
      hasGameStarted: true,
    },
  ]);
  const { getByPlaceholderText } = renderComponent(props);
  const bidwinsComponent = getByPlaceholderText("My Bid");
  expect(bidwinsComponent).toBeInTheDocument();
});

test("should show not enter bid if the level has not yet started", () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "test-name",
      wins: { expectedWins: 1, currentWins: 1 },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: false,
      hasGameStarted: true,
    },
  ]);
  const { queryByPlaceholderText } = renderComponent(props);
  const bidwinsComponent = queryByPlaceholderText("My Bid");
  expect(bidwinsComponent).toBeNull();
});

test("should display correct users lists", () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "p1",
      wins: { expectedWins: 1, currentWins: 1 },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: false,
      hasGameStarted: true,
    },
    {
      ID: 456,
      playerName: "p2",
      wins: { expectedWins: 1, currentWins: 1 },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: false,
      hasGameStarted: true,
    },
  ]);
  const { getByText } = renderComponent(props);
  expect(getByText("P1")).toBeInTheDocument();
  expect(getByText("P2")).toBeInTheDocument();
});

test("should display correct cards on play table and correct waiting for card message", () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "p1",
      wins: { expectedWins: 1, currentWins: 1 },
      cardThrown: { type: "club", number: "3" },
      cardsInHand: [],
      sequenceNumber: 1,
      hasLevelStarted: false,
      hasGameStarted: true,
    },
    {
      ID: 456,
      playerName: "p2",
      wins: { expectedWins: 1, currentWins: 1 },
      cardsInHand: [],
      sequenceNumber: 2,
      hasLevelStarted: false,
      hasGameStarted: true,
    },
  ]);
  const { getByAltText, getByText } = renderComponent(props);
  expect(getByAltText("club 3")).toBeInTheDocument();
  expect(getByText("2. Waiting for p2")).toBeInTheDocument();
});

test("should display correct cards in hand", () => {
  const props = getProps([
    {
      ID: 123,
      playerName: "p1",
      wins: { expectedWins: 1, currentWins: 1 },
      cardsInHand: [
        { type: "club", number: "3" },
        { type: "spade", number: "3" },
      ],
      sequenceNumber: 1,
      hasLevelStarted: false,
      hasGameStarted: true,
    },
  ]);
  const { getByAltText } = renderComponent(props);
  expect(getByAltText("club 3")).toBeInTheDocument();
  expect(getByAltText("spade 3")).toBeInTheDocument();
});

test("should display correct data in score card", () => {
  const props = {
    ...getProps([
      {
        ID: 123,
        playerName: "p1",
        wins: { expectedWins: 1, currentWins: 1 },
        cardsInHand: [
          { type: "club", number: "3" },
          { type: "spade", number: "3" },
        ],
        sequenceNumber: 1,
        hasLevelStarted: false,
        hasGameStarted: true,
      },
    ]),
    scores: [{ playerName: "p1", scoreCard: [10, 15, 17, 18, 19, 20, 21] }],
  };
  const { getByTestId } = renderComponent(props);
  expect(getByTestId("score-card")).toMatchSnapshot();
});

// test("should be able to throw correct card", async () => {
//   const props = getProps([
//     {
//       ID: 123,
//       playerName: "test-name",
//       wins: { expectedWins: 1, currentWins: 0 },
//       cardsInHand: [
//         { type: "heart", number: "3" },
//         { type: "heart", number: "4" },
//       ],
//       sequenceNumber: 1,
//       hasLevelStarted: true,
//     },
//   ]);
//   const { getByAltText } = renderComponent(props);
//   fireEvent.click(getByAltText("heart 3"));
//   await expect(server).toReceiveMessage(
//     '{"action":"throwCard","message":{"cardThrown":{"type":"heart","number":"3"}}}'
//   );
// });

function getProps(users) {
  return {
    connectionId: 123,
    setUsers: jest.fn(),
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
