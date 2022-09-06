import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

// Components
import Solana from "./withdraw/Solana";

// Assets
import bitcoin from "../../assets/bitcoin.png";
import bitcoinICO from "../../assets/bitcoin-icon.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      background: "#1e2023",
      minWidth: "300px",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".005em",
      maxWidth: "1000px",
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
      },
    },
  },
  cryptos: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
    "& div:nth-child(1)": {
      position: "relative",
      marginBottom: "30px",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#e38b08",
      borderRadius: "0px",
      border: "5px solid #272c2e",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#3f51b5",
      borderRadius: "0px",
      border: "5px solid #272c2e",
      margin: "0 14px",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#e3e3e3",
      borderRadius: "0px",
      border: "5px solid #272c2e",
      marginRight: "14px",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(4)": {
      backgroundColor: "#000000",
      borderRadius: "0px",
      border: "5px solid #272c2e",
      marginRight: "14px",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(5)": {
      backgroundColor: "#565656",
      borderRadius: "0px",
      border: "5px solid #272c2e",
      "& img": {
        width: "6rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
  },
  crypto: {
    width: "20%",
    height: "2.9rem",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "3rem",
      padding: "0",
      minWidth: 0,
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  picture: {
    borderBottom: "5px solid #6b706b33",
    paddingBottom: "20px",
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },

  header: {
    display: "flex",
    color: "white",
    justifyContent: "center",
    width: "100%",
  },

  span: {
    fontSize: "large",
  },
}));

const Market = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const [crypto, setCrypto] = useState("btc");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCoupon, setOpenCoupon] = useState(false);

  const openn = Boolean(anchorEl);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogContent
        style={{ borderTop: "12px solid #2ee9361a" }}
        className={classes.cryptos}
        dividers
      >
        <Box
          open={openn}
          onClose={() => setAnchorEl(null)}
          display="flex"
          className={classes.picture}
        >
          <Box className={classes.header}>
            <span className={classes.span}>Withdraw Solana</span>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column">
          <Solana />
        </Box>
      </DialogContent>
      <DialogActions>
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

export default Market;
