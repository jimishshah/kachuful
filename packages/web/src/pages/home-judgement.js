import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import styled from "@emotion/styled";
import ProgressSteps from "../organisms/progress-steps";
import GameRules from "../organisms/game-rules";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import useHomeJudgment from "@kachuful/common/controllers/use-home-judgement";

const StyledTextField = styled(TextField)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  width: 100%;
`;
function HomeJudgement(props) {
  const {
    tableId,
    setPlayerName,
    joinTableButton,
    resumeGameButton,
    endOldGameButton,
  } = useHomeJudgment(props);
  const { connectionId } = props;
  return (
    <Typography>
      {!connectionId ? (
        <>
          <ProgressSteps activeStep={0} isCreate={tableId ? false : true} />
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  variant="outlined"
                  label="Enter your name"
                  size="small"
                  inputProps={{
                    maxLength: 6,
                  }}
                  helperText="* Maximum 6 characters"
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  variant="contained"
                  color="secondary"
                  type="submit"
                  {...joinTableButton}
                >
                  {tableId ? "Join Game" : "Create Game"}
                </StyledButton>
              </Grid>
            </Grid>
          </form>
          <Box pt={4} mb={1}>
            <GameRules />
          </Box>
        </>
      ) : (
        <>
          <Box pt={4} mb={1} textAlign="center">
            <h4>
              You did not end your previous game, What do you want to do ?
            </h4>
            <Box mb={1}>
              <StyledButton
                variant="contained"
                color="secondary"
                {...resumeGameButton}
              >
                Resume Game
              </StyledButton>
            </Box>
            <Box mb={1}>
              <StyledButton
                variant="contained"
                color="primary"
                {...endOldGameButton}
              >
                End game
              </StyledButton>
            </Box>
          </Box>
        </>
      )}
    </Typography>
  );
}
export default HomeJudgement;
