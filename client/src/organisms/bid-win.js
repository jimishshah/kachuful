import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "@emotion/styled";
import { Grid, Button } from "@material-ui/core";

const StyledTextField = styled(TextField)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  width: 100%;
`;

function BidWin({ bidWins }) {
  const [bid, setBid] = useState();

  const bidWinsHandler = (e) => {
    e.preventDefault();
    bidWins(bid);
    setBid("");
  };
  return (
    <form onSubmit={bidWinsHandler} autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <StyledTextField
            type="number"
            variant="outlined"
            id="standard-basic"
            label="Enter your bid"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <StyledButton variant="contained" color="primary" type="submit">
            Submit Bid
          </StyledButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default BidWin;
