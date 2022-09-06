import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Custom Styles
const useStyles = makeStyles(theme => ({
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
  buttontesttt: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginLeft: "20px", 
    marginTop: "10px",
    [theme.breakpoints.up("sm")]: {
    marginLeft: "0px",
    },
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      background: "#212529",
      "& > input": {
      },
    },
    "& > div": {
      width: "100%",
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
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#264d68",
      color: "#e4e4e4",
      "&:hover": {
        background: "#264d68",
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
  titlerubik: {
    fontFamily: "Rubik",
  }
}));

const TipModal = ({ open, userId, handleClose }) => {
  const classes = useStyles();

  const [amountTip, setAmountTip] = useState("");

  const onChange = e => {
    setAmountTip(e.target.value);
  };

  const onClick = () => {
    chatSocket.emit(
      "send-chat-message",
      `/tip ${userId} ${amountTip}`
    );
    handleClose();
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", padding: "10px", }}><b><span style={{ fontWeight: "500", }}>🎁</span> TIP USER: <span style={{color: "#4caf50", }}><strong>{userId}</strong></span></b></span>
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <TextField
            className="input"
            variant="outlined"
            label="AMOUNT"
            onChange={onChange}
            value={amountTip}
          />
          <Button
            className={classes.buttontesttt}
            style={{ fontFamily: "Rubik", }}
            className="saveBtn"
            variant="contained"
            onClick={onClick}
          >
          SEND
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TipModal;
