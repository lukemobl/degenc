import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserVipData,
  claimRakebackBalance,
} from "../../services/api.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
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
//import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

import ProgressBar from "react-bootstrap/ProgressBar";

// Assets
//import stars from "../../assets/stars.png";

import error from "../../assets/error.wav";

const errorAudio = new Audio(error);

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
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      borderRadius: "0px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      [theme.breakpoints.down("sm")]: {
        width: "80%",
      },
    },
  },
  vipTitle: {
    fontSize: 20,
    fontFamily: "Rubik",
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      fontFamily: "Rubik",
      color: "#4caf50",
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
    margin: "1rem auto",
    "& > a": {
      color: "#4caf50",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
  },
  progressbox: {
    margin: "0 1rem",
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
  progress: {
    height: "2.5rem",
    borderRadius: "0.25rem",
    "& > div": {
      background:
        "-webkit-linear-gradient( 0deg, rgb(52, 63, 68) 0%, #4CAF50 100%) !important",
    },
  },
  rake: {
    color: "#4CAF50",
    background: "#1315184a",
    fontFamily: "Rubik",
    marginLeft: "10px",
    border: "1px solid #4CAF50",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "15rem",
  },
}));

const Vip = ({ open, handleClose, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [vipData, setVipData] = useState(null);

  // Claim user vip rakeback
  const claimRakeback = async () => {
    setClaiming(true);
    try {
      const response = await claimRakebackBalance();

      // Notify user
      addToast(`Successfully claimed your rakeback balance!`);
      changeWallet({ amount: parseFloat(response.clamed) });
    } catch (error) {
      setClaiming(false);
      console.log(
        "There was an error while claiming user rakeback balance:",
        error
      );
      // If this was user error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        window.location.replace("/Update");
        addToast(`Updated balance!`);
        //window.location.reload();
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch vip data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserVipData();

        // Update state
        setVipData(data);
        if (data.wager >= 50000) {
          setCompleted(1);
        } else {
          setCompleted(0);
          //  (data.wager -
          //    data.currentLevel.wagerNeeded) / data.nextLevel.wagerNeeded
          //);
          //setCompleted(
          //  (data.wager - data.currentLevel.wagerNeeded) /
          //    data.nextLevel.wagerNeeded
          //);
        }
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
        addToast(
          "There was an error while getting your VIP data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // If modal is opened, fetch data
    if (open) fetchData();
  }, [addToast, open]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
      style={{ fontFamily: "Rubik" }}
    >
      <DialogTitle
        className={classes.titlerubik}
        onClose={handleClose}
        style={{
          background: "#212529",
          fontFamily: "Rubik",
          borderTop: "12px solid #2ee9361a",
        }}
      >
        <span style={{ fontFamily: "Rubik" }}>
          <b>
            <span style={{ fontWeight: "500" }}>🕹️</span> LEVEL PROGRESS
          </b>
        </span>
      </DialogTitle>
      <DialogContent dividers style={{ background: "#212529" }}>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : (
          <Fragment>
            <h1 className={classes.vipTitle}>
              LEVEL <span>{vipData.currentLevel.name}</span>
            </h1>
            <Box position="relative" className={classes.progressbox}>
              {completed >= 1 ? (
                <span>
                  <h4
                    className={classes.vipDesc}
                    style={{
                      marginTop: "6px",
                      marginLeft: "29px",
                      position: "absolute",
                    }}
                  >
                    <span style={{ color: "#e0e0e0" }}>50000 / 50000 EXP</span>
                  </h4>
                  <ProgressBar
                    style={{ borderRadius: "5px" }}
                    variant="success"
                    animated
                    min={48500}
                    max={50000}
                    now={50000}
                  />
                </span>
              ) : completed < 1 ? (
                <span>
                  <h4
                    className={classes.vipDesc}
                    style={{
                      marginTop: "6px",
                      marginLeft: "29px",
                      position: "absolute",
                    }}
                  >
                    <span style={{ color: "#e0e0e0" }}>
                      {vipData.wager.toFixed()} /{" "}
                      {vipData.nextLevel.wagerNeeded.toFixed()} EXP
                    </span>
                  </h4>
                  <ProgressBar
                    style={{ borderRadius: "5px" }}
                    variant="success"
                    animated
                    min={vipData.currentLevel.wagerNeeded.toFixed()}
                    max={vipData.nextLevel.wagerNeeded.toFixed()}
                    now={vipData.wager.toFixed()}
                  />
                </span>
              ) : null}
            </Box>
            <h4 className={classes.vipDesc}>
              <span style={{ color: "#707070" }}>RANKS: </span>
              <br />
              <span style={{ color: "#c6cac6", fontSize: "13px" }}>
                🛡️ GAMBLER (lvl 0-24),{" "}
              </span>
              <span style={{ color: "#C27C0E", fontSize: "13px" }}>
                🥉 BRONZE (lvl 25-60),{" "}
              </span>
              <span style={{ color: "#95A5A6", fontSize: "13px" }}>
                {" "}
                🥈 SILVER (lvl 61-80),{" "}
              </span>
              <br />
              <span style={{ color: "#b99309", fontSize: "13px" }}>
                🥇 GOLD (81-93),{" "}
              </span>
              <span style={{ color: "#3498DB", fontSize: "13px" }}>
                💎 DIAMOND (94-100)
              </span>
            </h4>
            <h4 className={classes.vipDesc}>
              YOUR CURRENT RAKEBACK:{" "}
              <a href="#!">{vipData.currentLevel.rakebackPercentage}%</a>
            </h4>
            <Box justifyContent="center" display="flex" textAlign="center">
              <h2>
                ${parseCommasToThousands(vipData.rakebackBalance.toFixed(2))}
              </h2>
              <Button
                className={classes.rake}
                disabled={claiming}
                onClick={claimRakeback}
              >
                {claiming ? "CLAIMING..." : "CLAIM RAKE"}
              </Button>
            </Box>
          </Fragment>
        )}
      </DialogContent>
      <DialogActions style={{ background: "#212529" }}>
        <Button
          autoFocus
          onClick={handleClose}
          className={classes.buttontest}
          color="primary"
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Vip.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Vip);
