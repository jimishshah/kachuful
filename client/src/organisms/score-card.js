import React from "react";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";

function ScoreCard({ scores }) {
  return (
    <>
      <h3>score card</h3>
      <Table>
        <TableBody>
          {scores.map(({ playerName, scoreCard }) => (
            <TableRow key={playerName}>
              <TableCell>{playerName}</TableCell>
              {scoreCard.map((score) => (
                <TableCell key={score}>{score}</TableCell>
              ))}
              <TableCell>
                {scoreCard.reduce((acc, curr) => acc + curr, 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default ScoreCard;
