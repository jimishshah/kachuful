import React, { useState } from "react";
import styled from "@emotion/styled";
import Box from "@material-ui/core/Box";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const StyledForm = styled.form`
  /* padding-top: 8px; */
`;

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 0.5, 0, 0),
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: "0px",
    top: "0",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 0, 1, 1),
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function BidWin({ bidWins }) {
  const [bid, setBid] = useState();

  const bidWinsHandler = (e) => {
    e.preventDefault();

    if (Boolean(bid)) {
      bidWins(bid);
      setBid("");
    }
  };
  const classes = useStyles();
  return (
    <StyledForm onSubmit={bidWinsHandler} autoComplete="off">
      <Box pt={2}>
        <div className={classes.search}>
          <InputBase
            placeholder="My Bid"
            type="number"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={(e) => setBid(e.target.value)}
            inputProps={{ "aria-label": "my bid" }}
          />
          <ArrowForwardIosIcon
            onClick={bidWinsHandler}
            className={classes.searchIcon}
          />
        </div>
      </Box>
    </StyledForm>
  );
}

export default BidWin;
