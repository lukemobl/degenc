import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CasinoIcon from "@material-ui/icons/Casino";

import ProvablyModal from "../modals/shuffle/ProvablyModal";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  container: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 120,
  },
  box: {
    marginBottom: 5,
  },
  round: {
    display: "grid",
    height: "auto",
    width: "100%",
    padding: "30px",
    fontFamily: "Rubik",
    fontWeight: 500, 
    background: "rgb(34, 39, 44)",
    boxShadow: "rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px",
    color: "rgb(210, 217, 223)",
    marginBottom: 20,
    position: "relative",
    border: "1px solid rgb(76, 175, 80)",
    borderRadius: 5,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  provably: {
    background: "#272b2f",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px 0 0 5px",
    height: "100%",
    width: "3rem",
    [theme.breakpoints.down("sm")]: {
      height: "fit-content",
      position: "absolute",
      margin: "1rem",
      borderRadius: "100%",
    },
    "& span": {
      color: "#5f6368",
    },
    "& svg": {
      transform: "rotate(45deg)",
    },
  },
  callBot: {
    transform: "rotate(0deg) !important",
  },
  calledBot: {
    color: "#4caf50",
    marginLeft: "6px",
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    maxWidth: "3rem",
    marginRight: "8rem",
    alignItems: "flex-start",
    marginLeft: "3rem",
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "1rem",
      marginRight: "3rem",
      marginBottom: "1rem",
      justifyContent: "flex-end",
    },
    justifyContent: "center",
    "& h1": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".1em",
      fontSize: 20,
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#5f6368",
    },
  },
  players: {
    width: "100%",
    //margin: "0 5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0",
      alignItems: "center",
      display: "unset",
      padding: "1.2rem",
    },
    [theme.breakpoints.down("md")]: {
      margin: "0 1rem",
      alignItems: "center",
    },
  },
  player: {
    display: "flex",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
      marginBottom: "25px",
    },
    "& img": {
      height: "auto",
    },
    "& > span": {
      marginLeft: "1rem",
      fontSize: "12px",
      textTransform: "uppercase",
      [theme.breakpoints.down("xs")]: {
        //display: "none",
      },
    },
  },
  result: {
    background: "#272b2f",
    borderRadius: "40px",
    width: "110%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
    },
    "& > div": {
      height: "auto",
    },
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  avatar: {
    marginLeft: "1rem",
    backgroundColor: "#272b2f",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      borderRadius: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      //display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      borderRadius: "100%",
    },
  },
  waitingResult: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100% !important",
    width: "100%",
    zIndex: 1,
  },
}));

const Game = ({ game, user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);

  return (
    <Box
      key={game._id}
      className={classes.round}
    >
      <ProvablyModal
        game={game}
        handleClose={() => setProvablyModalVisible(state => !state)}
        open={provablyModalVisible}
      />

      <div style={{ padding: "30px", marginBottom: "20px", background: "#1e2225", borderRadius: "10px", boxShadow: "0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", }}>
      <span style={{fontSize: "24px", fontWeight: "600", }}><span style={{color: "#4caf50", }}>{game.winner.username}</span></span> <span style={{color: "#c9d0d6", fontSize: "24px", fontWeight: "600", }}>won</span> <span style={{ fontSize: "24px", }}>🏆</span> <span style={{color: "#44474c", fontSize: "24px", fontWeight: "600", }}>({game.winner.winningPercentage.toFixed(2)}%)</span>
      <br/>
      <span style={{color: "#7b7d7e", }}>Game ID: <span style={{color: "#9e9e9e", }}>{game._id}</span></span>
      <br/>
      <span><span style={{color: "#9e9e9e", }}>🏷️</span> <span style={{color: "rgb(210 217 223)", }}>{game.randomModule}</span>%</span>
      <IconButton
          onClick={() => setProvablyModalVisible(state => !state)}
          color="primary"
        >
          <CasinoIcon style={{color: "#5f5c5c", }} />
      </IconButton>
      </div>

      <div style={{ flexWrap: "wrap", display: "flex",  }}>{game.players.map(player => (<div style={{ maxWidth: "100px", paddingBottom: "30px", paddingLeft: "30px", paddingRight: "30px", }}>
        <Avatar
          className={classes.avatar2}
          style={{marginBottom: "10px", borderRadius: "100%", }}
          src={player.avatar}
          variant="rounded"
        />
        <span>{player.username} <br/><span style={{color: "#605d5d", }}>{player.winningPercentage.toFixed(2)}%</span></span>
      </div>))}</div>

    </Box>
  );
};

Game.propTypes = {
  game: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Game);
