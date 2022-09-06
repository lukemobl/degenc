import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#212529",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      [theme.breakpoints.down("xs")]: {
        width: "80%",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#3a3f64",
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      background: "#141629",
    },
    "& .MuiFormHelperText-root.Mui-disabled": {
      color: "#4960ed",
    },
  },
  vipTitle: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#507afd",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#373c5c",
    textAlign: "center",
    margin: "2rem auto",
    "& > a": {
      color: "#5f679a",
      textDecoration: "none",
    },
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      background: "rgba(44, 48, 84, 0.45)",
      "& > input": {
      },
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#fff",
      },
      "& label.Mui-focused": {
        color: "#5f6368",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#5f6368",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#5f6368",
        },
        "&:hover fieldset": {
          borderColor: "#5f6368",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#5f6368",
        },
      },
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#4e7afd",
      color: "white",
      "&:hover": {
        background: "#4e7afd",
      },
      "& .MuiButton-label": {
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
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
}));

const Field = withStyles({
  root: {
    width: "100%",
    marginBottom: 20,
    "& label": {
      color: "#5f6368",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& label.Mui-focused": {
      color: "#5f6368",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#5f6368",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#5f6368",
      },
      "&:hover fieldset": {
        borderColor: "#5f6368",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#5f6368",
      },
    },
  },
})(TextField);

const Provably = ({ open, handleClose, game }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", }}>
      <span style={{ fontFamily: "Rubik", color: "#4caf50", }}><b><span style={{ fontWeight: "500", }}>⚖️</span> PROVABLY FAIR</b></span>
      </DialogTitle>
      <DialogContent dividers>
        <Field
          className={classes.field}
          label="Round ID"
          value={game._id}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Private Hash"
          value={game.privateHash}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Private Seed"
          value={game.privateSeed ? game.privateSeed : "Not Revealed"}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Public Seed"
          value={game.publicSeed ? game.publicSeed : "Not Generated"}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="Round Ticket"
          value={game.randomModule + ` (${game.winner.username})`}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Provably;
