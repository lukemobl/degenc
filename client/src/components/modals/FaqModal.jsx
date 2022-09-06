import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
      //maxHeight: "50rem",
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

const FaqModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      open={open}
      style={{ fontFamily: "Rubik", height: "90%", }}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", color: "#4caf50", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", color: "#4caf50", }}><b>FAQ - FREQUENTLY ASKED QUESTIONS</b></span>
      </DialogTitle>
      <DialogContent dividers>
        <br/>
        <b>💰 1. Which deposit methods do you accept?</b>
        <p>- Bitcoin<br/>- Ethereum<br/>- Litecoin</p>
        <br/>
        <b>2. How to contact the support team?</b>
        <p>
          There is a live support button in the footer or you can join our discord server and open a ticket.
        </p>
        <br/>
        <b>🍰 3. What is the house edge?</b>
        <p>The house edge is 5%.</p>
        <br/>
        <b>4. My winnings are missing:</b>
        <p>
          If your winnings are missing try to refresh the page, if it didn't fix
          the issue, please contact us.
        </p>
        <br/>
        <b>⌛ 5. How long does it take to process a withdrawal?</b>
        <p>
          Withdrawals are usually processed withing minutes. Sometimes it can take longer to process withdraws.
          If you experience any issues, please contact us.
        </p>
        <br/>
        <b>6. How does the affiliates work?</b>
        <p>
          When using affiliator's code while betting, the affiliator gets 10% of
          every bet's house edge.
        </p>
        <p>
          Once you refer a new user to the site, they can use your affiliate code and claim the free $0.1
        </p>
        <p>
          The affiliates are dynamic and the user can support any user they
          want, but the free money can be only claimed once.
        </p>
        <br/>
        <b>💎 7. What is VIP?</b>
        <p>
          Once you reach a certain amount of wager, you will be welcomed in our
          vip program which includes:
        </p>
        <p>- Custom Rank in chat<br />- Rakeback<br />- Weekly coupon codes<br />- Monthly promotion</p>
        <p>The higher your vip rank is the higher rewards you will receive.</p>
        <br/>
        <b>🏁 8. What is Race?</b>
        <p>
          It's a way to earn money by playing on the site! You need to battle
          your friends and the rest of the community to win.
        </p>
        <p>
          Simply wager and play on cryptosplash.live! Once you have wagered, you have
          directly entered to the race!
        </p>
        <br/>
        <b>🚧 9. Can I deposit and withdraw directly?</b>
        <p>
        To prevent trading on site deposited funds must be wagered once before withdrawing.
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

export default FaqModal;
