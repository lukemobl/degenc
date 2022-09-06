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
    maxHeight: "800px", //new
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 20,
    },
  },
  userlevel: {
    background: "#31363c",
    fontSize: 10,
    padding: "5px 10px",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".15em",
    marginTop: "-4px",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
    borderRight: "1px solid #272b2f",
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
  winningAmount: {
    color: "#6afe43",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: "100%",
  },
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.betAmount}>
      🎲 ALL BETS
        <span>
          {loading
            ? "Loading..."
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
                <Box
                  style={{
                    width: "40%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    className={classes.avatar}
                    src={player.avatar}
                    variant="rounded"
                  />
                  {<span 
                  style={{background: "#272b2f", padding: "5px", color: "#ffffff", marginRight: "-10px", marginLeft: "10px", }}
                  className="userlevel">{player.level.name}</span>}
                  <Box ml={2}>{player.username}</Box>
                </Box>
                <Box ml="auto" style={{ width: "20%" }}>
                  {player.stoppedAt &&
                    `${(player.stoppedAt / 100).toFixed(2)}x`}
                </Box>
                <Box ml="auto" style={{ width: "20%" }}>
                  ${player.betAmount.toFixed(2)}
                </Box>
                <Box
                  ml="auto"
                  style={{ width: "20%" }}
                  className={classes.winningAmount}
                >
                  {player.winningAmount &&
                    `+$${player.winningAmount.toFixed(2)}`}
                </Box>
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
