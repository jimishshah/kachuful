import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
function ProgressSteps({ activeStep, isCreate }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      <Step>
        <StepLabel>{isCreate ? "Create Game" : "Join Game"}</StepLabel>
      </Step>
      <Step>
        <StepLabel>Invite Friends & Start Game</StepLabel>
      </Step>
      <Step>
        <StepLabel>Play</StepLabel>
      </Step>
    </Stepper>
  );
}

export default ProgressSteps;
