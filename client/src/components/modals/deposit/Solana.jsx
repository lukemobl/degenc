import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getUserCryptoInformation } from "../../../services/api.service";
import { depositSol } from "../../../services/api.service";
import { CopyToClipboard } from "react-copy-to-clipboard";
import gif from "../../../assets/loading.gif";
import bs58 from "bs58";
import store from "../../../store";
import { changeWallet } from "../../../actions/auth";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

import {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

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
    // backgroundColor: "#1d76bd !important",
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

  inputField: {
    display: "flex",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
    width: "100%",
  },

  loadingGif: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
}));

const Solana = () => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [cryptoData, setCryptoData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(0);
  const [verifyingTx, setverifyingTx] = useState(false);

  const handleDeposit = async () => {
    try {
      if (amount <= 0 || !amount || isNaN(amount)) return;
      setverifyingTx(true);

      await window.solana.connect().then(async res => {
        const connection = new Connection(process.env.REACT_APP_NODE_URL);
        let arrayAddress = bs58.decode(process.env.REACT_APP_DEPOSIT_ADDRESS);
        let pk = new PublicKey(arrayAddress);

        const transaction = await new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: res.publicKey,
            toPubkey: pk,
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );

        transaction.feePayer = res.publicKey;

        let { blockhash } = await connection.getRecentBlockhash();
        transaction.recentBlockhash = blockhash;

        const { signature } = await window.solana
          .signAndSendTransaction(transaction)
          .catch(e => console.log(e));

        if (!signature || !transaction) {
          return;
        }

        let data = {
          signature,
          amount,
          blockhash,
        };

        const result = await depositSol(data);

        if (result.success) {
          addToast("Deposit successful.", { appearance: "success" });
          setverifyingTx(false);
          store.dispatch(changeWallet({ amount: result.amount }));
        } else {
          addToast("Deposit failed.", { appearance: "error" });
          setverifyingTx(false);
        }
      });
    } catch (e) {
      setverifyingTx(false);
      console.log(e);
    }
  };

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <Box className={classes.inputs}>
            {verifyingTx ? (
              <>
                <div
                  style={{
                    color: "white",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span>Awaiting tx verification...</span>

                  <img
                    style={{ height: "50px", width: "50px" }}
                    src={gif}
                    alt="loading"
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    color: "white",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "transparent !important",
                    backgroundColor: "transparent !important",
                    gap: "10px",
                  }}
                >
                  <span style={{ color: "white" }}>Amount (SOL)</span>

                  <span style={{ fontSize: "small", color: "#a3a3a3" }}>
                    Enter the amount of SOL (Solana) you would like to deposit
                    below. This deposit is in SOL, not USD. Your transaction
                    will confirm after 31 confirmations. Note: Phantom Wallet
                    needed.
                  </span>

                  <input
                    className={classes.inputField}
                    type="number"
                    min={0}
                    step={0.001}
                    placeholder="Deposit Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />

                  <Button
                    style={{
                      display: "flex",
                      width: "50%",
                      backgroundColor: "#1D77BC",
                      color: "white",
                    }}
                    onClick={() => handleDeposit()}
                  >
                    Deposit SOL
                  </Button>
                </div>
              </>
            )}
          </Box>
        </Box>
      </Fragment>
    </Box>
  );
};

export default Solana;
