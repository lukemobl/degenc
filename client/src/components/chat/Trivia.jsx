import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";

// MUI Components
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";

// Assets
import triviaCircle from "../../assets/triviaCircle.png";

// Custom styles
const useStyles = makeStyles({
  root: {
    padding: 20,
    width: "100%",
    height: "8rem",
    position: "relative",
  },
  content: {
    background: "#282c33",
    borderRadius: 6,
    border: "1px solid #428a45",
    height: "100%",
    width: "100%",
    padding: 17,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "& img": {
      position: "absolute",
      right: 8,
      top: 6,
    },
  },
  title: {
    color: "#e0e0e0",
    fontSize: 13,
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  question: {
    color: "#e0e0e0",
    fontSize: 11,
    fontFamily: "Rubik",
    fontWeight: 400,
    letterSpacing: ".1em",
    marginTop: 7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    userSelect: "none",
  },
  info: {
    color: "#e0e0e0",
    fontSize: 10,
    fontFamily: "Rubik",
    fontWeight: 400,
    letterSpacing: ".1em",
    position: "absolute",
    right: 5,
    bottom: 3,
  },
});

const Trivia = ({ trivia }) => {
  // Declare state
  const classes = useStyles();

  return (
    <Slide in={trivia.active} direction={"right"}>
      <Box className={classes.root}>
        <Box className={classes.content}>
          <img src={triviaCircle} alt="triviaCircle" />
          <div className={classes.title}>Trivia time!</div>
          <div className={classes.question}>{trivia.question}</div>
          <div className={classes.info}>
            ${parseCommasToThousands(cutDecimalPoints(trivia.prize.toFixed(7)))}{" "}
            x {trivia.winnerAmount}
          </div>
        </Box>
      </Box>
    </Slide>
  );
};

export default Trivia;
