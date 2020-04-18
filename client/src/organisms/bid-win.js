import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

function BidWin({ bidWins }) {
  const [bid, setBid] = useState();

  const bidWinsHandler = () => {
    bidWins(bid);
  };
  return (
    <>
      <TextField
        id="standard-basic"
        label="Enter you bid"
        onChange={(e) => setBid(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={bidWinsHandler}>
        Bid Wins
      </Button>
      ;
    </>
  );
}

export default BidWin;
