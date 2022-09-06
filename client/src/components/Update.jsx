import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

//assets
import logo from "./../assets/logonew.svg";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    alignItems: "center",
    justifyContent: "center",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "15px",
    textAlign: "center",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "10rem",
      marginBottom: "1rem",
    },
    "& h1": {
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "50px",
      fontWeight: 500,
      letterSpacing: ".1em",
      margin: 0,
    },
  },
});

const Err = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <img src={logo} alt="degencups.io" />
        <h1>RAKEBACK UPDATED</h1>
        <span>You can go now and gamble. Good luck!</span>
      </Container>
    </Box>
  );
};

export default Err;
