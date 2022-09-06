import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getUserCryptoInformation } from "../../../services/api.service";
import { CopyToClipboard } from "react-copy-to-clipboard";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    margin: 25,
    padding: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 10,
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    marginTop: "25px",
    "& > div": {
      "& label": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
      "& label.Mui-focused": {
        color: "#e4e4e4",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#191b1e",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#191b1e",
        },
        "&:hover fieldset": {
          borderColor: "#191b1e",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#191b1e",
        },
      },
      "& > div > input": {},
    },
    "& > div > div": {
      background: "#191b1e !important",
    },
  },
  value: {
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#191b1e !important",
      },
      "& > div > input": {
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      backgroundColor: "#1d76bd !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  Depvalue: {
    position: "relative",
    // width: "75%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#191b1e !important",
      },
      "& > div > input": {
        width: "70%",
        color: "#4CAF50",
        fontSize: "14px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      backgroundColor: "#1d76bd !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  withdraw: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "#1d76bd !important",
    width: "100%",
    marginTop: "1rem",
    height: "3rem",
  },
  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
      marginTop: "30px",
      marginBottom: "-55px",
      marginLeft: "-5px",
    },
  },
  cryptocolor: {
    color: "#f8931a",
  },
}));

const Bitcoin = () => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);
  const [copied, setCopied] = useState(false);

  // componentDidMount
  useEffect(() => {
    // Fetch crypto information from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCryptoInformation();

        // Update state
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while fetching user crypto information:",
          error
        );

        // If this was user generated error
        if (error.response && error.response.status === 400) {
          addToast(error.response.data.error, { appearance: "error" });
        } else {
          addToast(
            "There was an error while fetching your crypto deposit information. Please try again later!",
            { appearance: "error" }
          );
        }
      }
    };

    fetchData();
  }, [addToast]);

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <Box className={classes.inputs}>
            <Box className={classes.cryptocolor}>
              Send your desired amount of Bitcoin (BTC) to the following
              address.
              <br />
              You will be credited after 1 confirmation. You might need to
              refresh the site once it is confirmed.
              <br />
              Deposited funds must be wagered once before withdrawing.
              <br />
              <br />
              Minimum deposit (TxOut) 0.0002 BTC
            </Box>
            {loading ? (
              <Skeleton
                height={56}
                width={504}
                animation="wave"
                variant="rect"
              />
            ) : (
              <Box className={classes.Depvalue}>
                <TextField
                  label="BITCOIN DEPOSIT ADDRESS"
                  variant="outlined"
                  color="#4F79FD"
                  value={cryptoData.btc.address}
                />
                <CopyToClipboard
                  text={cryptoData.btc.address}
                  onCopy={() => setCopied(true)}
                >
                  <Button
                    style={{
                      borderRadius: "10px",
                      border: "0px solid #272c2e",
                    }}
                  >
                    {copied ? "COPIED!" : "COPY"}
                  </Button>
                </CopyToClipboard>
              </Box>
            )}
          </Box>
          {loading ? (
            <Skeleton
              height={140}
              width={140}
              animation="wave"
              variant="rect"
              style={{ marginLeft: "2em" }}
            />
          ) : (
            <img
              className={classes.qrcopy}
              src={cryptoData.btc.dataUrl}
              alt="QR Code"
            />
          )}
        </Box>
      </Fragment>
    </Box>
  );
};

export default Bitcoin;
