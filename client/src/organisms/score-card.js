import React from "react";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";
import styled from "@emotion/styled";
import Paper from "@material-ui/core/Paper";

const StoreCardContainer = styled.div`
  width: 100%;
  overflow: scroll;
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  min-width: 48px;
`;

function ScoreCard({ scores: initialScores }) {
  const [firstPlayer] = initialScores;

  const scores = initialScores
    .map(({ playerName, scoreCard: initialScoreCard }) => {
      const totalScore = initialScoreCard.reduce((acc, curr) => acc + curr, 0);
      const scoreCard = [...initialScoreCard].reverse();
      return {
        playerName,
        scoreCard,
        totalScore,
      };
    })
    .sort((a, b) => (a.totalScore < b.totalScore ? 1 : -1));

  return (
    <>
      {firstPlayer && (
        <StoreCardContainer data-testid="score-card">
          <h3>Score Card</h3>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Total</StyledTableCell>
                  {firstPlayer.scoreCard.map((score, index) => (
                    <StyledTableCell align="center" key={index}>
                      Level {firstPlayer.scoreCard.length - index}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {scores.map(({ playerName, scoreCard, totalScore }) => (
                  <TableRow key={playerName}>
                    <TableCell align="center">{playerName}</TableCell>
                    <TableCell align="center">{totalScore}</TableCell>
                    {scoreCard.map((score, index) => (
                      <TableCell align="center" key={index}>
                        {score}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StoreCardContainer>
      )}
    </>
  );
}

export default ScoreCard;
