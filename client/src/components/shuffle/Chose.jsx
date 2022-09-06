import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core";

// MUI Components
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

// Custom Styles
const useStyles = makeStyles(theme => ({
  contain: {
    width: "90%",
    overflow: "visible",
    padding: "2rem 0",
    position: "relative",
    zIndex: 3,
  },
  rolling: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "30px",
    fontWeight: 500,
    letterSpacing: ".1em",
    position: "absolute",
    width: "100%",
	  height: "100%",
    textAlign: "center",
    zIndex: 100,
    color: "white",
    top: -50,
    [theme.breakpoints.down("sm")]: {
      top: -75,
    },
  },
}));

// Custom Styled Component
const Roll = withStyles({
  root: {
    display: "flex",
    transform: props => props.position,
    transition: props => props.animation,
    justifyContent: "center",
    zIndex: 90,
    "& img": {
      width: 100,
      zIndex: 90,
    },
  },
})(Box);

// Custom Styled Component
const ArrowTop = withStyles({
  root: {
    margin: "auto",
    position: "relative",
    zIndex: 100,
    top: 15,
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: props => props.borderSide,
  },
})(Box);

// Custom Styled Component
const ArrowBottom = withStyles({
  root: {
    margin: "auto",
    position: "relative",
    zIndex: 100,
    top: 105,
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: props => props.borderSide,
  },
})(Box);

  const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const Chose = ({ color, images, transform, animation, repeat, finalCountdown }) => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.contain}>
      <h3 className={classes.rolling}>
        <span style={{ color: "rgb(76, 175, 80)", }}>STARTING SOON...</span><br/> {finalCountdown != "" ? finalCountdown : ''}<br/><br/>
		<ColorCircularProgress style={{ color: "#ffffff", }} />
      </h3>
    </Box>
  );
};

export default Chose;
