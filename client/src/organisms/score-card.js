import React from "react";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

function ScoreCard({ scores }) {
  return (
    <>
      <h3>score card</h3>
      <Table>
        {scores.map(({ playerName, scoreCard }) => (
          <TableRow>
            <TableCell>{playerName}</TableCell>
            {scoreCard.map((score) => (
              <TableCell>{score}</TableCell>
            ))}
            <TableCell>
              {scoreCard.reduce((acc, curr) => acc + curr, 0)}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </>
  );
}

export default ScoreCard;
