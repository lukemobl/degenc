import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import {
  getActiveCupsGames,
  getCupsPrivateGame,
  getUserPrivateCupsGames,
} from "../services/api.service";
import { cupsSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { NavLink as Link } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Popover from "@material-ui/core/Popover";
import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import RefreshIcon from '@material-ui/icons/Refresh';

// Components
import Game from "../components/cups/Game";
import RoundSkeleton from "../components/RoundSkeleton";
import Color from "../components/controls/Color";
import Players from "../components/controls/Players";
import PrivateGameModal from "../components/modals/cups/PrivateGameModal";

import error from "../assets/error.wav";

  const errorAudio = new Audio(error);

  const playSound = audioFile => {
    audioFile.play();
  };

// import fakeBets from "../libs/fakeBets";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      //paddingBottom: "100%",
    },
  },
  container: {
    width: "100%",
    minHeight: "32.5rem",
    paddingTop: 50,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 25,
    },
    "& > div": {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "auto",
      },
    },
  },
  box: {
    marginBottom: 5,
  },
  round: {
    display: "flex",
    height: "10rem",
    width: "100%",
    marginBottom: 10,
    border: "1px solid #111729",
    borderRadius: 5,
  },
  logo: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "19px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
    },
  },
  provably: {
    background: "#111729",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "3rem",
    "& span": {
      color: "#232b42",
    },
    "& svg": {
      transform: "rotate(45deg)",
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    alignItems: "center",
    justifyContent: "center",
    "& h1": {
      margin: 0,
      color: "white",
      fontSize: 20,
      fontWeight: "100",
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#191c30",
    },
  },
  players: {
    width: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    "& img": {
      width: "2rem",
      height: "auto",
      marginRight: "1rem",
    },
    "& span": {
      marginLeft: "1rem",
    },
  },
  controls: {
    background: "#1e2225",
    padding: "1rem 5rem",
    paddingTop: "2rem",
    borderBottom: "2px solid #2a4e2b",
    [theme.breakpoints.down("sm")]: {
      background: "#212529",
      borderBottom: "0px",
      padding: "1rem",
      paddingTop: "3rem",
      display: "grid",
    },
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
    [theme.breakpoints.down("sm")]: {
      //width: "100%",
      marginBottom: "100px",
      display: "flex",
      flexWrap: "wrap",
    },
  },
  create: {
    backgroundColor: "#3386c9",
    borderColor: "#3386c9",
    boxShadow: "0 1.5px #191e24",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0 2rem",
    textTransform: "capitalize",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      padding: "6px 16px",
    },
    "&:hover": {
      backgroundColor: "#3386c9",
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#4fa0d8",
    background: "transparent !important",
  },
  multiplier: {
    backgroundColor: "#32363c",
    borderColor: "#32363c",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      marginTop: "15px",
      marginBottom: "25px",
    },
  },
  multiplier2: {
    backgroundColor: "#32363c",
    borderColor: "#32363c",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      //marginBottom: "10px",
    },
  },
  gamesdesign: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      marginBottom: "200px",
    },
  },
  result: {
    background: "#070A15",
    width: "30%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  private: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      display: "inherit",
    },
    "& > span:nth-child(2)": {
      marginLeft: 10,
      marginRight: 40,
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0,
        //display: "none",
        marginRight: 40,
        marginTop: "5px",
      },
    },
    "& > span:nth-child(1)": {
      [theme.breakpoints.down("sm")]: {
        //display: "none",
      },
    },
  },
  reverse: {
  },
  popover: {
    marginTop: 10,
    position: "relative",
    "& > .MuiPopover-paper": {
      background: "#32363c",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: ".1em",
      width: 300,
      overflow: "visible",
      padding: "1rem 2rem",
    },
    "& .MuiSlider-markLabel": {
      color: "white",
      opacity: 0.5,
      transition: "0.5s ease",
      fontSize: 10,
    },
    "& .MuiSlider-markLabelActive": {
      color: "white",
      opacity: 1,
      transition: "0.5s ease",
      fontSize: 12,
    },
  },
  noGames: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
}));

// Custom Styled Component
const AntSwitch = withStyles(theme => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#4f79fd",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    borderRadius: 16 / 2,
    opacity: 0.5,
    backgroundColor: "#57618d",
  },
  checked: {},
}))(Switch);

// Custom Styled Component
const BetInput = withStyles(theme => ({
  root: {
    width: "10rem",
    marginTop: "auto",
    marginRight: "1rem",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      marginBottom: "10px",
    },
    "& :before": {
      //display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 1rem",
    },
    "& div": {
      background: "#32363c",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
}))(TextField);

// Custom Styled Component
const ArrowTop = withStyles({
  root: {
    margin: "auto",
    position: "absolute",
    top: -5,
    left: 125,
    width: 0,
    height: 0,
    borderLeft: "20px solid transparent",
    borderRight: "20px solid transparent",
  },
})(Box);

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

const Cups = ({ user, match, history, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [games, setGames] = useState([]);
  const [privateGame, setPrivateGame] = useState(false);
  const [betAmount, setBetAmount] = useState("0.00");
  const [playerAmount, setPlayerAmount] = useState(2);
  const [costMultiplier, setCostMultiplier] = useState(0);
  const [color, setColor] = useState("red");
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [privateLink, setPrivateLink] = useState(null);

  // TextField onChange event handler
  const onChange = e => {
    const value = e.target.value;
    setBetAmount(value);
  };

  // Button switch onChange event handler
  const playerAmountOnChange = newAmount => {
    setPlayerAmount(newAmount);
  };

  // Slider onChange event handler
  const sliderOnChange = (e, newValue) => {
    setCostMultiplier(newValue);
  };

  // Button switch onChange event handler
  const colorOnChange = e => {
    setColor(e.target.value);
  };

  // Add new game
  const addGame = game => {
    setCreating(false);
    setGames(state => (state ? [game, ...state] : null));
  };

  // Show private game invite link
  const addPrivateGame = inviteLink => {
    setCreating(false);
    setPrivateLink(inviteLink);
    setPrivateGameModalVisible(true);
  };

  // Button onClick event handler
  const onClick = () => {
    setCreating(true);
    cupsSocket.emit(
      "create-new-game",
      playerAmount,
      color,
      parseFloat(betAmount),
      privateGame,
      costMultiplier / 100
    );
  };

  // Handle player join event
  const gameJoined = data => {
    const { _id, newPlayer } = data;

    // Update State
    setGames(state =>
      state.map(game =>
        game._id === _id
          ? { ...game, players: [...game.players, newPlayer] }
          : game
      )
    );
  };

  // Handle game called bot event
  const gameBotCalled = data => {
    const { _id, playerId } = data;

    // Update State
    setGames(state =>
      state.map(game =>
        game._id === _id
          ? { ...game, voteBot: [...game.voteBot, playerId] }
          : game
      )
    );
  };

  // Handle game end event
  const gameRolled = newData => {
    console.log(
      "[CUPS] Game",
      newData._id,
      "rolled. Result:",
      newData.winningCup
    );

    // Update State
    setTimeout(() => {
    setGames(state =>
      state.map(game =>
        game._id === newData._id ? { ...game, ...newData, status: 3 } : game
      )
    );
  }, 1000);
    // Wait for the animation
    setTimeout(() => {
      // Make the game disabled
      setGames(state =>
        state.map(game =>
          game._id === newData._id ? { ...game, ended: true } : game
        )
      );
    }, 6000);
  };

  // Handle game rolling event
  const gameRolling = gameId => {
    console.log("[CUPS] Game", gameId, "rolling...");
    // Update State
    setGames(state =>
      state.map(game => (game._id === gameId ? { ...game, status: 2 } : game))
    );
  };

  // componentDidMount
  useEffect(() => {
    // Fetch active games from the API
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getActiveCupsGames();

        // Update state
        setGames(games);
        setLoading(false);
      } catch (error) {
        addToast(
          "There was an error while loading games data, please try again later!",
          { appearance: "error" }
        );
        console.log("There was an error while loading cups games:", error);
      }
    };

    // Fetch private game data from API
    const fetchPrivateGameData = async inviteCode => {
      setLoading(true);
      try {
        const game = await getCupsPrivateGame(inviteCode);

        // Update State
        setGames([game]);
        setLoading(false);
      } catch (error) {
        // If game was not found
        if (error.response && error.response.status === 400) {
          addToast("Couldn't find any active games with that invite link!", {
            appearance: "error",
          });
          playSound(errorAudio);
          history.push("/cups");
        } else {
          addToast(
            "There was an error while loading that private game data, please try again later!",
            { appearance: "error" }
          );
          playSound(errorAudio);
          history.push("/cups");
        }
        console.log(
          "There was an error while loading private game data:",
          error
        );
      }
    };

    // There was an error while creating a game
    const creationError = msg => {
      // Update state
      setCreating(false);

      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Joining a game was successfull
    const joinSuccess = () => {
      //addToast("Successfully joined a game!", { appearance: "success" });
    };

    // There was an error while joining a game
    const joinError = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Calling a bot was successfull
    const callingBotSuccess = () => {
      //addToast("Successfully called a bot!", { appearance: "success" });
    };

    // There was an error while calling a bot
    const callingBotError = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // If game id was passed (private game route)
    if (match.params.inviteCode) {
      // Fetch private game data
      fetchPrivateGameData(match.params.inviteCode);
    } else {
      // Fetch games when component mounts
      fetchData();
    }

    // Listeners
    cupsSocket.on("game-creation-error", creationError);
    cupsSocket.on("new-cups-game", addGame);
    cupsSocket.on("game-joined", gameJoined);
    cupsSocket.on("game-called-bot", gameBotCalled);
    cupsSocket.on("game-rolled", gameRolled);
    cupsSocket.on("game-rolling", gameRolling);
    cupsSocket.on("private-game-created", addPrivateGame);
    cupsSocket.on("game-join-error", joinError);
    cupsSocket.on("game-join-success", joinSuccess);
    cupsSocket.on("game-call-bot-error", callingBotError);
    cupsSocket.on("game-call-bot-success", callingBotSuccess);

    // componentDidUnmount
    return () => {
      // Remove listeners
      cupsSocket.off("game-creation-error", creationError);
      cupsSocket.off("new-cups-game", addGame);
      cupsSocket.off("game-joined", gameJoined);
      cupsSocket.off("game-called-bot", gameBotCalled);
      cupsSocket.off("game-rolled", gameRolled);
      cupsSocket.off("game-rolling", gameRolling);
      cupsSocket.off("private-game-created", addPrivateGame);
      cupsSocket.off("game-join-error", joinError);
      cupsSocket.off("game-join-success", joinSuccess);
      cupsSocket.off("game-call-bot-error", callingBotError);
      cupsSocket.off("game-call-bot-success", callingBotSuccess);
    };
    // eslint-disable-next-line
  }, [addToast, match.params]);

  // When user is loaded, fetch private games
  useEffect(() => {
    // Fetch private games from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getUserPrivateCupsGames();

        // Update state
        setGames(state => [...games, ...state]);
        setLoading(false);
      } catch (error) {
        addToast(
          "There was an error while loading your private games data, please try again later!",
          { appearance: "error" }
        );
        console.log(
          "There was an error while loading private cups games:",
          error
        );
      }
    };

    // If game id was not passed (general route)
    if (!match.params.inviteCode && isAuthenticated) {
      fetchData();
    }
  }, [addToast, isAuthenticated, match.params]);

  // When player amount is changed, reset colors
  useEffect(() => {
    setColor("red");
  }, [playerAmount]);
  return (
    <div>
      <PrivateGameModal
        open={privateGameModalVisible}
        handleClose={() => setPrivateGameModalVisible(state => !state)}
        link={privateLink}
      />
      <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          <Box className={classes.private}>
            <span onClick={event => setAnchorEl(event.currentTarget)}>
            🔒 Private Game
            </span>
            <AntSwitch
              onClick={event => setAnchorEl(event.currentTarget)}
              checked={privateGame}
              onChange={() => setPrivateGame(!privateGame)}
              name="checkedC"
            />
          </Box>
          {/*
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            className={classes.popover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <ArrowTop />
            <Box
              marginTop="9px"
              width="100%"
              textAlign="center"
              fontSize="10px"
            >
              TAKE OVER COMPETITOR'S COSTS
            </Box>
            <Slider
              defaultValue={20}
              aria-labelledby="continuous-slider"
              valueLabelDisplay="auto"
              marks={marks}
              onChange={sliderOnChange}
              value={costMultiplier}
            />
          </Popover>
          */}
        </Box>
        <Box>
        <Link
          style={{ textDecoration: "none", }}
          exact
          to="/cups"
        >
          <Button style={{ textDecoration: "none", }} className={classes.multiplier}>
          <RefreshIcon style={{ fontSize: "1rem", marginTop: "-2px", }} />
            <span style={{ textDecoration: "none", }} className={classes.reverse}>
             REFRESH
            </span>
          </Button>
        </Link>
        </Box>
        <Box className={classes.right}>
          <Players value={playerAmount} onChange={playerAmountOnChange} />
          <Color
            value={color}
            playerAmount={playerAmount}
            onChange={colorOnChange}
          />
          <BetInput
            label=""
            variant="filled"
            onChange={onChange}
            value={betAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  className={classes.inputIcon}
                  position="start"
                >
                  <AttachMoneyIcon style={{ fontSize: 16 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={classes.multiplier2}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() =>
              setBetAmount(state => (parseFloat(state) / 2).toFixed(2))
            }
          >
            <span className={classes.reverse}>1/2</span>
          </Button>
          <Button
            className={classes.multiplier2}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() =>
              setBetAmount(state => (parseFloat(state) * 2).toFixed(2))
            }
          >
            <span className={classes.reverse}>2x</span>
          </Button>
          <Button
            className={classes.multiplier2}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(user ? user.wallet : 0)}
          >
            <span className={classes.reverse}>Max</span>
          </Button>
          <Button
            className={classes.create}
            size="medium"
            color="primary"
            variant="contained"
            onClick={onClick}
          >
            <span className={classes.reverse}>
              {creating ? (
                "CREATING..."
              ) : (
                <Fragment>
                  CREATE{" "}
                  {privateGame &&
                  costMultiplier &&
                  !isNaN(betAmount) &&
                  !isNaN(costMultiplier) &&
                  !isNaN(playerAmount)
                    ? `($${(
                        (parseFloat(betAmount) || 0) +
                        betAmount * (costMultiplier / 100) * (playerAmount - 1)
                      ).toFixed(2)})`
                    : ""}
                </Fragment>
              )}
            </span>
          </Button>
        </Box>
      </Toolbar>

      <Box className={classes.root}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {loading ? (
              <RoundSkeleton />
            ) : games.length > 0 ? (
              <div className={classes.gamesdesign}>
                {games.map(game => (
                  <Game key={game._id} game={game} user={user} />
                ))}
              </div>
            ) : (
              <Container className={classes.noGames}>
                <p>NO CURRENTLY ACTIVE GAMES!</p>
              </Container>
            )}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

Cups.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Cups);
