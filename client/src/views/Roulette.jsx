import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getRouletteSchema } from "../services/api.service";
import { rouletteSocket } from "../services/websocket.service";
import Spritesheet from "react-responsive-spritesheet";
import Countdown from "react-countdown";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import InputAdornment from "@material-ui/core/InputAdornment";
//import CasinoIcon from "@material-ui/icons/Casino";
import Slider from 'react-input-slider';
import TimerIcon from '@material-ui/icons/Timer';
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

import {TimerBar} from "./TimerBarR.js";

// Components
import Bets from "../components/roulette/Bets";
import Wheel from "../components/roulette/Wheel";
import HistoryEntry from "../components/roulette/HistoryEntry";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

// Assets
//import timer from "../assets/timer.png";
import ani2Cup from "../assets/2xAni.png";
import ani3Cup from "../assets/3xAni.png";
import ani4Cup from "../assets/4xAni.png";

import roll from "../assets/roulleteroll.wav";
import pick from "../assets/roulletepick.wav";
import placebet from "../assets/placebet.wav";
import error from "../assets/error.wav";

  const rollAudio = new Audio(roll);
  const pickAudio = new Audio(pick);
  const errorAudio = new Audio(error);
  const placebetAudio = new Audio(placebet);

  const playSound = audioFile => {
    audioFile.play();
  };



//import fakeBets from "../libs/fakeBets"

const TILE_COUNT = 54;

// Custom Styled Component
const BetInput = withStyles({
  root: {
    marginTop: "auto",
    marginRight: 10,
    "& :before": {
      display: "none",
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
      padding: "0rem 0rem",
    },
    "& div": {
      // background: "#171A28",
      background: "#32363c",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

// Custom Styled Component
const Arrow = withStyles({
  root: {
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "30px solid #e0e0e0",
    position: "absolute",
    top: "1.5rem",
    zIndex: 1000,
    transition: "0.25s ease",
    opacity: props => props.opacity,
  },
})(Box);

// Custom Styled Component
const Prize = withStyles({
  root: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    textShadow: "0px 0px 20px black",
    margin: "auto",
    fontFamily: "Rubik",
    fontSize: "45px",
    fontWeight: 500,
    letterSpacing: ".05em",
    color: "#e0e0e0", //gold
    opacity: props => props.opacity,
    transition: "0.25s ease",
  },
})(Box);

// Custom Styled Component
//const TimerBar = withStyles({
//  root: {
//    height: "0.4rem",
//  },
 // colorPrimary: {
//    backgroundColor: "#212529",
//  },
//  barColorPrimary: {
//   backgroundColor: "#439646",
//  },
//})(LinearProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
      marginBottom: 150,
    },
    "& > div > div": {
      justifyContent: "space-around",
    },
  },
  box: {
    marginBottom: 5,
  },
  logo: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "19px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("xs")]: {
      fontSize: 15,
      marginTop: 5,
    },
  },
  countdown: {
    fontSize: 20,
    marginBottom: "20px",
    marginLeft: "5px",
    marginTop: "-35px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 15,
      marginBottom: "20px",
      marginLeft: "5px",
      marginTop: "0px",
    },
  },
  controls: {
    overflow: "visible",
    background: "#212529",
    marginBottom: "34px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "20px",
      marginTop: "-25px",
    },
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: "-28px",
    marginTop: "25px",
    maxWidth: "56rem",
    maskImage: "linear-gradient(240deg,rgba(0,0,0,1) 34%,rgba(0,0,0,0))",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      marginRight: "-21px",
    },
  },
  game: {
    display: "flex",
    width: "56%",
    height: "75vh",
    maxHeight: "800px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      maxHeight: "500px",
    },
  },
  bets: {
    display: "flex",
    width: "43%",
    height: "75vh",
    maxHeight: "800px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  info: {
    width: "100%",
    display: "flex",
    height: "4rem",
    background: "#272b2f",
    boxShadow: "0 1.5px #191e24",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
  wheel: {
    maxHeight: "470px",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    margin: "auto",
    position: "relative",
    overflow: "hidden",
    background: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 20px)",
    border: "2px solid #282c33",
    boxShadow: "0 1.5px #191e24",
    marginTop: 5,
    borderRadius: 5,
    transition: "1s ease",
    maskImage: "linear-gradient(180deg,rgba(0,0,0,1) 88%,rgba(0,0,0,0) 98%)",
    [theme.breakpoints.down("xs")]: {
      maxHeight: "270px",
    },
  },
  disabled: {
    opacity: 0.25,
    transition: "0.25s ease",
    pointerEvents: "none",
    cursor: "not-allowed",
  },
  regular: {
    opacity: 1,
    transition: "0.25s ease",
    pointerEvents: "all",
    cursor: "pointer",
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#4fa0d8",
    background: "transparent !important",
  },
  placeBet: {
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    borderRadius: 5,
    "& > div": {
      //transform: 'perspective(250px) rotateX(20deg) scale(0.85)',
    },
    "& > div > div": {
      display: "flex",
      alignItems: "center",
      "&:nth-child(1)": {
        "& button:nth-child(1)": {
          background: "#4e789e",
          marginRight: "15px",
          fontFamily: "Rubik",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
        "& button:nth-child(2)": {
          background: "#41b444",
          marginRight: "15px",
          fontFamily: "Rubik",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
        "& button:nth-child(3)": {
          background: "#a960b3",
          fontFamily: "Rubik",
          marginRight: "15px",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
        "& button:nth-child(4)": {
          background: "#cbaa1f",
          fontFamily: "Rubik",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
      },
      "&:nth-child(2)": {
        "& button:nth-child(1)": {
          background: "#a960b3",
          marginRight: "15px",
          fontFamily: "Rubik",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
        "& button:nth-child(2)": {
          background: "#cbaa1f",
          marginRight: "15px",
          fontFamily: "Rubik",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
        "& button:nth-child(3)": {
          background: "#cbaa1f",
          fontFamily: "Rubik",
          fontSize: "33px",
          fontWeight: 500,
          justifyContent: "flex-start",
          letterSpacing: ".1em",
          [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
            justifyContent: "center",
          },
        },
      },
    },
    "& button": {
      width: "30.5%",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&:hover": {
        opacity: 1,
      },
    },
    animation: {
      [theme.breakpoints.down("xs")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(0.2)",
        },
      },
      [theme.breakpoints.up("sm")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(0.6)",
        },
      },
      [theme.breakpoints.up("md")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(0.85)",
        },
      },
      [theme.breakpoints.up("lg")]: {
        "& > img": {
          width: "75%",
        },
        "& .react-responsive-spritesheet": {
          transform: "scale(1)",
        },
      },
    },
  },
  contain: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  multiplier: {
    // backgroundColor: "#181B2B",
    // borderColor: "#181B2B",
    minWidth: "fit-content",
    backgroundColor: "#32363c",
    borderColor: "#32363c",
    color: "white",
    marginRight: 7,
    marginTop: "0.5rem",
  },
  slidertest: {
    marginTop: "12px",
    marginRight: "20px",
    marginLeft: "10px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  playerCont: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    marginLeft: "3px",
    padding: "1rem 1rem",
  },
  hashvalue: {
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontSize: "12px",
    marginTop: "1.5rem",
    marginLeft: "30px",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
  reverse: {
  },
  create: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    marginRight: 7,
    color: "white",
    marginTop: "0.5rem",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#f44336",
    },
  },
  betButtons: {
    padding: "1rem 1rem",
    "& button": {
      height: "4rem",
      marginBottom: 10,
    },
  },
  extra: {
    position: "absolute",
    top: -37,
    right: 7,
    color: "white",
  },
  barContainer: {
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginTop: "1rem",
    },
  },
  bar: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
    [theme.breakpoints.down("xs")]: {
      marginTop: "-8px",
    },
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

// Renderer callback with condition
//const renderer = (start, end) => ({ minutes, seconds, completed, total }) => {
//  const t1 = new Date(start);
//  const t2 = new Date(end);
//  const dif = t1.getTime() - t2.getTime();

//  const Seconds_from_T1_to_T2 = dif / 1000;
// const Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);

//  return (
    //<TimerBar
    //  variant="determinate"
    //  value={(total / (Seconds_Between_Dates * 1000)) * 100}
    ///>
//  );

  // if (completed) {
  //   // Render a completed state
  //   return "PICKING";
  // } else {
  //   // Render a countdown
  //   return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  // }
//};

// Renderer callback with condition
const rendererR = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "ROLLING";
  } else {
    // Render a countdown
    return ` ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

// Same game states as in backend
const GAME_STATES = {
  NotStarted: "Loading...",
  InProgress: "Rolling",
};

const RESET_DEG = -3; // What is the reseted wheel rotation degrees

const Roulette = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameState, setGameState] = useState("Loading...");

  const [loading, setLoading] = useState(true);
  const [wheelAnimationDuration, setWheelAnimationDuration] = useState(10);
  const [joining, setJoining] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [waitTime, setWaitTime] = useState(5000);
  const [color, setColor] = useState("blue");
  const [betAmount, setBetAmount] = useState("0.00");
  const [gameId, setGameId] = useState(null);
  const [privateHash, setPrivateHash] = useState(null);

  // Preloading animations
  const [animations, setAnimations] = useState({});

  const [showExtraMultiplier, setShowExtraMultiplier] = useState(false);
  const [extraMultiplier, setExtraMultiplier] = useState(null);
  const [rotation, setRotation] = useState(RESET_DEG);

  // Fetch roulette schema from API
  const fetchData = async () => {
    setLoading(true);
    setButtonsDisabled(true);
    try {
      const schema = await getRouletteSchema();

      // Update state
      setGameId(schema.current._id);
      setPrivateHash(schema.current.privateHash);
      setPlayers(schema.current.players);
      setWaitTime(Date.now() + schema.current.timeLeft);
      setHistory(schema.history.reverse());
      setLoading(false);
      if(schema.current.timeLeft > 0)
      {
        setGameState("PLACE YOUR BETS");
      }
      setButtonsDisabled(false);
      if(schema.current.rollStatus){
        gameRolled(schema.current.rollStatus.winningIndex, schema.current.rollStatus.winningMultiplier, schema.current.rollStart);
      }
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };

  // Game has rolled, show animation
  const gameRolled = (index, multiplier, start) => {
    // Update state
    setWheelAnimationDuration(10 + (start || 0) / 1000);
    //setGameState("Rolling");
    setGameState(GAME_STATES.InProgress);
    setButtonsDisabled(true);
    //playSound(rollAudio);

    // Calculate degrees
    const degrees = getWheelRotation(index);

    // Set wheel positions
    setRotation(-Math.abs(degrees + 360));

    // Wait for the animation (not to test for 0)
    if (multiplier !== undefined) {
      setTimeout(() => {
        setGameState(
          `ROLLED ${
            multiplier === 0
              ? "MYSTERY! GETTING MULTIPLIER..."
              : multiplier + "x"
          }`
        );
      }, 10000);
    }
  };

  // Add new player to the current game
  const addNewPlayer = player => {
    setPlayers(state => [...state, player]);
  };

  // Button onClick event handler
  const onClick = () => {
    setJoining(true);
    setButtonsDisabled(true);

    // Emit new bet event
    rouletteSocket.emit("join-game", color, parseFloat(betAmount));
  };

  // TextField onChange event handler
  const onChange = e => {
    setBetAmount(e.target.value);
  };

  // Translate color name to HEX code
  const getColorCode = name => {
    switch (name) {
      default:
      case "blue":
        return "#458DBF";
      case "green":
        return "#2ebd50";
      case "purple":
        return "#b157ce";
      case "yellow":
        return "#cbaa1f";
    }
  };

  // New round started event handler
  const newRoundStarted = (countdownTime, gameId, privateHash) => {
    // Update state
    setGameId(gameId);
    setPrivateHash(privateHash);
    setWaitTime(Date.now() + countdownTime);
    setGameState("PLACE YOUR BETS");
    setRotation(RESET_DEG);
    setButtonsDisabled(false);
    //setJoining(false);
    setShowExtraMultiplier(false);
    setExtraMultiplier(null);
    setPlayers([]);
  };

  // Get rotation for the wheel
  const getWheelRotation = index => {
    // const offset = Math.random();
    const offsetDeg = 3; // (offset * 360) / TILE_COUNT
    return (index * 360) / TILE_COUNT + offsetDeg;
  };

  // Multiplier rolled (extra tiles)
  const multiplierRolled = multiplier => {
    // Update state
    setExtraMultiplier(`extra-${multiplier}`);
    setShowExtraMultiplier(true);
    setGameState(`Mystery multiplier ${multiplier}x`);
  };

  // Normal round rolled
  const roundRolled = multiplier => {
    // Update state
    setExtraMultiplier(multiplier);
    setShowExtraMultiplier(true);
  };

  // Add game to history
  const addGameToHistory = game => {
    setHistory(state =>
      state.length >= 50
        ? [...state.slice(1, state.length), game]
        : [...state, game]
    );
  };

  // componentDidMount
  useEffect(() => {
    // Error event handler
    const joinError = msg => {
      setButtonsDisabled(false);
      setJoining(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Success event handler
    const joinSuccess = () => {
      setButtonsDisabled(false);
      setJoining(false);
      //addToast("Successfully joined the game!", { appearance: "success" });
      playSound(placebetAudio);
    };

    // Game has rolled, show animation
    const specialGameRolled = (index, multiplier) => {
      // Update state
      //setGameState("Rolling");
      setGameState(GAME_STATES.InProgress);
      setShowExtraMultiplier(false);
      setButtonsDisabled(true);

      // Calculate degrees
      const degrees = getWheelRotation(index);

      // Set wheel positions
      setRotation(state => {
        // If user missed first roll
        if (state === RESET_DEG) {
          return -Math.abs(degrees + 360);
        } else {
          const previousDegrees = Math.abs(state) - 360;
          const toStart = -Math.abs(360 - previousDegrees);
          const resetAmount = state + toStart;

          return resetAmount - (degrees + 360);
        }
      });
    };

    // Initially, fetch data
    fetchData();

    // Preload animations
    setAnimations({ twoX: ani2Cup, threeX: ani3Cup, fourX: ani4Cup });

    // Listeners
    rouletteSocket.on("new-player", addNewPlayer);
    rouletteSocket.on("game-join-error", joinError);
    rouletteSocket.on("game-join-success", joinSuccess);
    rouletteSocket.on("new-round", newRoundStarted);
    rouletteSocket.on("game-rolled", gameRolled);
    rouletteSocket.on("special-game-rolled", specialGameRolled);
    rouletteSocket.on("multiplier-rolled", roundRolled);
    rouletteSocket.on("additional-multiplier-rolled", multiplierRolled);
    rouletteSocket.on("add-game-to-history", addGameToHistory);

    return () => {
      // Remove Listeners
      rouletteSocket.off("new-player", addNewPlayer);
      rouletteSocket.off("game-join-error", joinError);
      rouletteSocket.off("game-join-success", joinSuccess);
      rouletteSocket.off("new-round", newRoundStarted);
      rouletteSocket.off("game-rolled", gameRolled);
      rouletteSocket.off("special-game-rolled", specialGameRolled);
      rouletteSocket.off("multiplier-rolled", roundRolled);
      rouletteSocket.off("additional-multiplier-rolled", multiplierRolled);
      rouletteSocket.off("add-game-to-history", addGameToHistory);

      // clearInterval(timer);
    };
  }, [addToast]);

  return (
    <div className={classes.barContainer}>
      <Box className={classes.root}>
        <Container maxWidth="lg">
        <Box className={classes.logo}>
        <Toolbar variant="dense" className={classes.controls}>
        <Box className={classes.logo}>
          <div className={classes.bar}>
          {!loading && gameState === "PLACE YOUR BETS" && <TimerBar waitTime={waitTime} gameStates = {GAME_STATES} updateGameState = {(state) => setGameState(state)} />}
          </div>
        </Box>
        <Box className={classes.right}>
          {history.map(game => (
            <HistoryEntry key={game._id} game={game} />
          ))}
        </Box>
      </Toolbar>
          <Box className={classes.countdown} alignItems="center" display="flex">
          <TimerIcon style={{ display: "flex", marginRight: 5, fontSize: 25, color: "#439646", }} />
            {loading ? (
              <Fragment>{gameState}</Fragment>
            ) : gameState === GAME_STATES.InProgress ? (
              <Fragment>ROLLING</Fragment>
            ) : (
              <Fragment>
                <Countdown key={waitTime} date={waitTime} renderer={rendererR} />
              </Fragment>
            )}
          </Box>
        </Box>
          <Grid container className={classes.contain}>
            <Box className={classes.game} flexDirection="column">
              <Box className={classes.info}>
                {loading ? (
                  <Tooltip
                  interactive
                  title={
                    <span>
                      Round ID: {gameId}
                      <br />
                      Private Hash: {privateHash}
                    </span>
                  }
                  placement="top"
                >
                  <span style={{ cursor: "pointer", }}>⚖️ PROVABLY FAIR</span>
                </Tooltip>
                ) : (
                  <Tooltip
                    interactive
                    title={
                      <span>
                        Round ID: {gameId}
                        <br />
                        Private Hash: {privateHash}
                      </span>
                    }
                    placement="top"
                  >
                    <span style={{ cursor: "pointer", }}>⚖️ PROVABLY FAIR</span>
                  </Tooltip>
                )}
              </Box>
              <Box className={classes.wheel}>
                <Prize opacity={showExtraMultiplier ? 1 : 0}>
                  {extraMultiplier === "extra-2" ? (
                    <Spritesheet
                      image={animations.twoX}
                      timeout={0}
                      autoplay={true}
                      widthFrame={690}
                      heightFrame={412}
                      steps={180}
                      fps={60}
                      className={classes.animation}
                      style={{ position: "absolute", zIndex: 100 }}
                    />
                  ) : extraMultiplier === "extra-3" ? (
                    <Spritesheet
                      image={animations.threeX}
                      timeout={0}
                      autoplay={true}
                      widthFrame={690}
                      heightFrame={412}
                      steps={180}
                      fps={60}
                      className={classes.animation}
                      style={{ position: "absolute", zIndex: 100 }}
                    />
                  ) : extraMultiplier === "extra-4" ? (
                    <Spritesheet
                      image={animations.fourX}
                      timeout={0}
                      autoplay={true}
                      widthFrame={690}
                      heightFrame={412}
                      steps={180}
                      fps={60}
                      className={classes.animation}
                      style={{ position: "absolute", zIndex: 100 }}
                    />
                  ) : extraMultiplier ? (
                    String(extraMultiplier).includes("extra-") ? (
                      String(extraMultiplier).replace("extra-", "") + "x"
                    ) : (
                      extraMultiplier + "x"
                    )
                  ) : null}
                </Prize>
                <Arrow opacity={showExtraMultiplier ? 0.5 : 1} />
                {gameState === "Rolling" ? (
                  <Wheel
                    rotate={`rotate(${rotation}deg)`}
                    opacity={showExtraMultiplier ? 0.5 : 1}
                    transition={`transform ${wheelAnimationDuration}s ease`}
                  />
                ) : (
                  <Wheel                  
                    opacity={showExtraMultiplier ? 0.5 : 1}
                    rotate={`rotate(${rotation}deg)`}
                    transition="none"
                  />
                )}
              </Box>
              <Box className={classes.placeBet}>
                <Box className={classes.playerCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={betAmount}
                    onChange={onChange}
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
    <Slider
      className={classes.slidertest}
      styles={{
        track: {
          backgroundColor: '#707479'
        },
        active: {
          backgroundColor: getColorCode(color),
          borderRadius: "4px",
        },
      }}
        axis="x"
        xstep={0.1}
        xmin={0}
        xmax={200}
        x={betAmount}
        onChange={({ x }) => setBetAmount(parseFloat(x.toFixed(0)) + ".00")}
      />
                  <Button
                    className={classes.create}
                    size="medium"
                    color="primary"
                    variant="contained"
                    disabled={joining}
                    onClick={onClick}
                    style={{ backgroundColor: getColorCode(color) }}
                  >
                    <span className={classes.reverse}>
                      {joining ? "BETTING..." : "BET"}
                    </span>
                  </Button>
                </Box>
                <Box className={classes.betButtons}>
                  <Box
                    className={
                      buttonsDisabled ? classes.disabled : classes.regular
                    }
                  >
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => {setColor("blue");}}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      2x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => {setColor("green");}}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      3x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => {setColor("purple");}}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      5x
                    </Button>
                    <Button
                      variant="contained"
                      disabled={buttonsDisabled}
                      onClick={() => {setColor("yellow");}}
                    >
                      {extraMultiplier &&
                      String(extraMultiplier).includes("extra-") ? (
                        <h1 className={classes.extra}>
                          {String(extraMultiplier).replace("extra-", "")}x
                        </h1>
                      ) : null}
                      20x
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Bets players={players} loading={loading} />
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

Roulette.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Roulette);
