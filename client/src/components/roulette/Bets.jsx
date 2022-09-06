import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    borderRadius: 5,
    width: "43%",
    height: "75vh",
    maxHeight: "800px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 20,
      marginBottom: 50,
    },
  },
  betAmount: {
    width: "100%",
    height: "2.1rem",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& span": {
      display: "flex",
      marginLeft: "auto",
      color: "#4caf50",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
  bets: {
    display: "flex",
    color: "white",
    height: "100%",
    flexDirection: "column",
    overflowY: "auto",
  },
  bet: {
    display: "flex",
    alignItems: "center",
    borderRadius: 3,
    marginBottom: 5,
    width: "100%",
    padding: 10,
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    background: "#212529",
    position: "relative",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: "100%",
  },
  multiplier: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  // Get multiplier from color
  const getMultiplier = color => {
    switch (color) {
      case "blue":
        return 2;
      case "green":
        return 3;
      case "purple":
        return 5;
      case "yellow":
        return 20;
      default:
        return "Invalid";
    }
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.betAmount}>
      🎲 ALL BETS
        <span>
          {loading
            ? "LOADING..."
            : "$" +
              players
                .map(player => parseFloat(player.betAmount))
                .reduce((a, b) => a + b, 0)
                .toFixed(2)}
        </span>
      </Box>

      <Box className={classes.bets}>
        {players
          .sort((a, b) => b.betAmount - a.betAmount)
          .map(player => (
            <Box key={player.betId} padding="0 1rem">
              <Box className={classes.bet}>
                <Avatar
                  className={classes.avatar}
                  src={player.avatar}
                  variant="rounded"
                />
                <Box ml={2}>{player.username}</Box>
                <Box className={classes.multiplier}>
                  {getMultiplier(player.color)}x
                </Box>
                <Box ml="auto">${player.betAmount.toFixed(2)}</Box>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

Bets.propTypes = {
  players: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Bets;
