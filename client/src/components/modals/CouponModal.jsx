import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { claimCouponCode } from "../../services/api.service";
import { changeWallet } from "../../actions/auth";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import success from "../../assets/success.wav";
import error from "../../assets/error.wav";

  const errorAudio = new Audio(error);
  const successAudio = new Audio(success);

  const playSound = audioFile => {
    audioFile.play();
  };

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#212529",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      [theme.breakpoints.down("xs")]: {
        width: "80%",
      },
    },
  },
  vipTitle: {
    fontFamily: "Rubik",
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".05em",
    margin: "2rem auto",
    "& > a": {
      color: "#2196F3",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
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
}));

const Coupon = ({ open, handleClose, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [redeeming, setRedeeming] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setCouponCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const response = await claimCouponCode(couponCode);

      // Update state
      setRedeeming(false);
      addToast(response.message, { appearance: "success" });
      changeWallet({ amount: response.payout });
      playSound(successAudio);
    } catch (error) {
      setRedeeming(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
          playSound(errorAudio);
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log("There was an error while claiming coupon:", error);
        addToast(
          "There was an error while claiming this coupon code. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", }}><b><span style={{ fontWeight: "500", }}>🏷️</span> ENTER COUPON</b></span>
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <TextField
            className="input"
            variant="outlined"
            label="CODE"
            onChange={onChange}
            value={couponCode}
          />
          <Button
            className={classes.buttontest}
            style={{ fontFamily: "Rubik", }}
            className="saveBtn"
            variant="contained"
            onClick={onClick}
            disabled={redeeming}
          >
            {redeeming ? "REDEEMING..." : "REDEEM"}
          </Button>
        </Box>
        <h4 className={classes.vipDesc}>
          You can find coupons by being active on our social media. You can find us on <a target="_blank" href="https://twitter.com/DegenCups">Twitter</a> or via <a href="https://discord.gg/AvnaPpnhJX" target="_blank">Discord</a>.
        </h4>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Coupon.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Coupon);