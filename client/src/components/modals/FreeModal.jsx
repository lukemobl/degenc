import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserAffiliatesData,
  redeemAffiliateCode,
} from "../../services/api.service";
import { changeWallet } from "../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import success from "../../assets/success.wav";
import error from "../../assets/error.wav";

  const errorAudio = new Audio(error);
  const successAudio = new Audio(success);

  const playSound = audioFile => {
    audioFile.play();
  };

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

// Custom Styles
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
    fontSize: 20,
    textAlign: "right",
    fontFamily: "Rubik",
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
    textAlign: "center",
    margin: "2rem auto",
    "& > a": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
    "& b": {
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#2196f3",
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
      background: "#37743a",
      color: "#e4e4e4",
      "&:hover": {
        background: "#37743a",
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
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "15rem",
  },
}));

const Free = ({ open, handleClose, changeWallet, code: suppliedCode }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);
  const [code, setCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const affiliator = await redeemAffiliateCode(code);

      // Update state
      setAffiliateData(state => ({
        ...state,
        currentlySupporting: affiliator,
      }));
      setRedeeming(false);

      // If free money was claimed (first redeem)
      if (affiliator.freeMoneyClaimed) {
        addToast("You have successfully claimed your free $0.10!", {
          appearance: "success",
        });
        changeWallet({ amount: 0.1 });
        playSound(successAudio);
      } else {
        addToast("Successfully updated your dynamic affiliator code!", {
          appearance: "success",
        });
        playSound(successAudio);
      }
    } catch (error) {
      setRedeeming(false);
      console.log(
        "There was an error while trying to redeem affiliate code:",
        error
      );

      // If this was validation error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through errors
        error.response.data.errors.forEach(error =>
          addToast(error.msg, { appearance: "error" })
        );
        playSound(errorAudio);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        // If this was user caused error
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        addToast("Unknown error happened, please contact administrators!", {
          appearance: "error",
        });
        playSound(errorAudio);
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch current affiliate data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserAffiliatesData();

        // If user has claimed affiliate code
        if (data.currentlySupporting) {
          // Make sure it's not set by affiliate link
          setCode(state =>
            state === "" ? data.currentlySupporting.code : state
          );
        }

        // Update state
        setAffiliateData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while loading user affiliate data:",
          error
        );
        addToast(
          "There was an error while getting your affiliate data, please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    };

    // If modal is opened, fetch data
    if (open) {
      fetchData();
    } else {
      // When modal is closed, reset code
      setCode("");
    }
  }, [addToast, open]);

  // If affiliate code was supplied
  useEffect(() => {
    if (suppliedCode) {
      setCode(suppliedCode);
      addToast("Detected affiliate link! Redirected you to affiliates page!", {
        appearance: "success",
      });
      playSound(successAudio);
    }
  }, [addToast, suppliedCode]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
      style={{ fontFamily: "Rubik", }}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", }}><b><span style={{ fontWeight: "500", }}>💰</span> FREE CASH</b></span>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : (
          <Fragment>
            {affiliateData.currentlySupporting && (
              <h4 className={classes.vipDesc}>
                You are currently supporting{" "}
                <b>{affiliateData.currentlySupporting.username}</b>.
              </h4>
            )}
            <Box position="relative" className={classes.progressbox}>
              <TextField
                className="input"
                variant="outlined"
                label="CODE"
                value={code}
                onChange={onChange}
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
              Enter a code to support your affiliate and gain a free 0.10$
            </h4>
          </Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Free.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Free);
