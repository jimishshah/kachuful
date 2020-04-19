import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

function BidWin({ bidWins }) {
  const [bid, setBid] = useState();

  const bidWinsHandler = (e) => {
    e.preventDefault();
    bidWins(bid);
    setBid("");
  };
  return (
    <form onSubmit={bidWinsHandler} autoComplete="off">
      <TextField
        type="number"
        variant="outlined"
        id="standard-basic"
        label="Enter your bid"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
      />
    </form>
  );
}

export default BidWin;
