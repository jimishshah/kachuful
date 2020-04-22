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

const StyledForm = styled.form`
  padding-top: 8px;
`;

function BidWin({ bidWins }) {
  const [bid, setBid] = useState();

  const bidWinsHandler = (e) => {
    e.preventDefault();

    console.log(Boolean(bid), bid);
    if (Boolean(bid)) {
      bidWins(bid);
      setBid("");
    }
  };
  return (
    <StyledForm onSubmit={bidWinsHandler} autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <StyledTextField
            type="number"
            variant="outlined"
            id="standard-basic"
            label="Enter bid"
            onChange={(e) => setBid(e.target.value)}
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <StyledButton variant="contained" color="secondary" type="submit">
            Go
          </StyledButton>
        </Grid>
      </Grid>
    </StyledForm>
  );
}

export default BidWin;
