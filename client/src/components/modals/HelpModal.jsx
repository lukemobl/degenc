import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Custom Styles
const useStyles = makeStyles({
  modal: {
    "& div > div": {
      background: "#212529",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: ".1em",
    },
    "& b": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  titlerubik: {
    fontFamily: "Rubik",
  },
  numbers: {
    color: "#9e9e9e",
    fontFamily: "Rubik",
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: ".1em",
  },
});

const Help = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      style={{ fontFamily: "Rubik", height: "90%", }}
      onClose={handleClose}
      fullScreen={fullScreen}
      open={open}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", color: "#4caf50", }}><b>HELP</b></span>
      </DialogTitle>
      <DialogContent dividers>
      <b>📉 How "Crash" works:</b>
        <p>
          1. Place the amount you'd like to bet
          <br />
          2. Decide when to cashout before the multiplier crashes.
          <br />
          3. If you cashout before the multiplier crashes you win.
          <br />
          4. Your bet amount will be multiplied.
        </p>
        <br/>
        <b>🥤 How "Cups" work:</b>
        <p>
          1. Choose the number of players, from 2-4
          <br />
          2. Pick the color of your cup
          <br />
          3. The amount you'd like to bet
          <br />
          4. Once all players have participated in the game, a random cup will
          have a ball underneath it that determines the winner.
        </p>
        <br/>
        <b>🎲 How "Shuffle" works:</b>
        <p>
          1. Place the amount you'd like to bet
          <br />
          2. 2 players or more must participate
          <br />
          3. Once all players have participated, random participants will be
          picked and chosen a cup for
          <br />
          4. Cups will begin to shuffle and one of those cups contain a ball
          that will reveal the winner
        </p>
        <br/>
        <b>🎡 How "Roulette" works:</b>
        <p>
          1. Place the amount you'd like to bet on any multiplier.
          <br />
          2. You can place your bet on multiple multipliers.
          <br />
          3. If the spinner lands on the multiplier you bet, your bet amount will be multiplied with that multiplier.
        </p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Help;
