import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";

// MUI Components
import CircularProgress from "@material-ui/core/CircularProgress";

// Assets
import cups from "./assets/logonew.svg";

// Custom styles
const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  img: {
    height: "6rem",
    marginBottom: "2rem",
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#439646",
  },
})(CircularProgress);

const Preloader = () => {
  // Declare State
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={cups} className={classes.img} alt="degencups.io Logo" />
      <ColorCircularProgress />
    </div>
  );
};

export default Preloader;
