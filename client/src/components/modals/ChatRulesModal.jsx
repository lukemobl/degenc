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
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "15px",
      fontWeight: 400,
      letterSpacing: ".1em",
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

const ChatRulesModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", }}><b>CHAT RULES</b></span>
      </DialogTitle>
      <DialogContent dividers>
        <p><span className={classes.numbers}>1.</span> No racism allowed in chat whether its a word or a gif</p>
        <p><span className={classes.numbers}>2.</span> Do not talk about bans / mutes in chat</p>
        <p><span className={classes.numbers}>3.</span> Do not promote your affiliate code in chat</p>
        <p><span className={classes.numbers}>4.</span> You can also report mods by making a ticket</p>
        <p><span className={classes.numbers}>5.</span> Do not advertise other sites</p>
        <p><span className={classes.numbers}>6.</span> Do not spam</p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatRulesModal;
