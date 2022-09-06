import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CopyBlock, obsidian } from "react-code-blocks";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Import code samples
import pfCodeSamples from "../pfCodeSamples";
import { useState } from "react";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    // overflow: "auto",
    padding: "2rem 0",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    color: "#5f6368",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "100px",
    },
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "19px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  openBtn: {
    color: "white",
    border: "none",
    fontFamily: "inherit",
    padding: ".4rem .6rem",
    borderRadius: ".2rem",
    marginLeft: "1rem",
    backgroundColor: "#365f37",
    cursor: "pointer",
    transition: "all .3s ease",
    "&:hover": {
      background: "#365f37",
    },
  },
}));

const Fair = () => {
  // Declare State
  const classes = useStyles();
  const [open, setOpen] = useState({
    cups: false,
    crash: false,
    shuffle: false,
    roulette: false,
  });

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <br/>
        <h1>⚖️ PROVABLY FAIR</h1>
        <br/>
        <section>
          <b>How can I know that a game is fair?</b>
          <p>
            For each game we use an EOS Blockchain's Block that has been
            generated after all players have joined. We use that block's unique
            ID as our games "public seed". That means we cannot know the outcome
            of the game before it has rolled.
          </p>
        </section>
        <br/>
        <section>
          <b>Verifying Cups Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.cups ? (
              <ProvablyCodeBlock text={pfCodeSamples.cups} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, cups: !state.cups }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <br/>
        <section>
          <b>Verifying Shuffle Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.shuffle ? (
              <ProvablyCodeBlock text={pfCodeSamples.shuffle} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, shuffle: !state.shuffle }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <br/>
        <section>
          <b>Verifying Crash Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each round:
            {open.crash ? (
              <ProvablyCodeBlock text={pfCodeSamples.crash} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, crash: !state.crash }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <br/>
        <section>
          <b>Verifying Roulette Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.roulette ? (
              <ProvablyCodeBlock text={pfCodeSamples.roulette} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, roulette: !state.roulette }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
      </Container>
    </Box>
  );
};

const ProvablyCodeBlock = ({ text }) => {
  return (
    <CopyBlock
      text={text}
      language="javascript"
      showLineNumbers={false}
      theme={obsidian}
      wrapLines
    />
  );
};

export default Fair;
