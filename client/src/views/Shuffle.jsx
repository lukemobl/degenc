import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Spritesheet from "react-responsive-spritesheet";
import Countdown from "react-countdown";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { shuffleSocket } from "../services/websocket.service";
import { getShuffleSchema } from "../services/api.service";
import { useToasts } from "react-toast-notifications";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Tooltip from "@material-ui/core/Tooltip";
import CasinoIcon from "@material-ui/icons/Casino";
import Slider from 'react-input-slider';
import LinearProgress from "@material-ui/core/LinearProgress";
import HistoryIcon from '@material-ui/icons/History';
import { NavLink as Link } from "react-router-dom";

// Components
import Chose from "../components/shuffle/Chose";
import PrevGame from "../components/shuffle/PrevGame";
import Explode from "../components/shuffle/Explode";
import TimerIcon from '@material-ui/icons/Timer';

// Assets
import percent from "../assets/percent.png";
//import timer from "../assets/timer.png";
import bag from "../assets/bag.png";
import cupOutline from "../assets/cup-outline.png";
import red from "../assets/shuffle/red.png";
import blue from "../assets/shuffle/blue.png";
import green from "../assets/shuffle/green.png";
import yellow from "../assets/shuffle/yellow.png";
import pink from "../assets/shuffle/pink.png";
import aniShuffle from "../assets/aniShuffle.png";
import shufflePause from "../assets/shufflePause.png";

import ballRed from "../assets/shuffle/ballRed.png";
import ballBlue from "../assets/shuffle/ballBlue.png";
import ballGreen from "../assets/shuffle/ballGreen.png";
import ballYellow from "../assets/shuffle/ballYellow.png";
import ballPink from "../assets/shuffle/ballPink.png";
import ballNull from "../assets/shuffle/ballNull.png";

import error from "../assets/error.wav";
import success from "../assets/success.wav";
import shuffle from "../assets/shufflestarted.wav";
//import wave from "../assets/cupswave.wav";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);
const shufflestartedAudio = new Audio(shuffle);
//const waveAudio = new Audio(wave);

const playSound = audioFile => {
  audioFile.play();
};

// import fakeBets from "../libs/fakeBets";

// Custom Styled Component
const BetInput = withStyles({
  root: {
    width: "10rem",
    marginTop: "auto",
    marginRight: "1rem",
    marginBottom: "5px",
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
      padding: "0.5rem 1rem",
    },
    "& div": {
      background: "#32363c",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

// Custom styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingTop: 30,
    paddingBottom: 100,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 27,
      paddingBottom: "160px",
    },
    "& > div > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      "& > hr": {
        width: "100%",
        marginTop: "1rem",
        background: "#32363c",
        borderColor: "#32363c",
      },
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
  },
  controls: {
    background: "#212529",
    //padding: "1rem 3rem",
    paddingTop: "1.5rem",
    marginBottom: "-20px",
    marginTop: "-30px",
    [theme.breakpoints.down("xs")]: {
      padding: "0rem 0rem",
      //marginLeft: 20,
      display: "block",
      marginBottom: "80px",
      //marginTop: "20px",
      paddingTop: "2rem",
    },
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
    marginRight: "-24px",
    background: "#32363c",
    borderRadius: "4px",
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
      marginRight: "-2px",
      background: "#32363c00",
    },
  },
  game: {
    display: "flex",
    alignItems: "center",
    background: "#272b2f",
    boxShadow: "0 1.5px #191e24",
    borderRadius: "5px",
    width: "100%",
    height: "60px",
    [theme.breakpoints.down("xs")]: {
      "& > div": {
      },
    },
    "& > img": {
      marginLeft: "2rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  animation: {
    display: "flex",
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    borderRadius: "5px",
    width: "100%",
    height: "36vh",
    marginTop: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      "& > img": {
        width: "75%",
      },
      "& .react-responsive-spritesheet": {
        transform: "scale(0.3)",
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
  bets: {
    display: "grid",
    alignItems: "space-between",
    gridColumnGap: 15,
    gridTemplateColumns: "auto auto auto auto auto",
    width: "100%",
    height: "17vh",
    marginTop: 10,
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "auto auto",
      gridRowGap: 15,
      height: "fit-content",
    },
    "& > div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      background: "#272b2f",
      boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
      borderRadius: 5,
      "& h5, h3": {
        margin: 0,
        fontWeight: "500",
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        letterSpacing: ".05em",
      },
      "& h3": {
        marginTop: 10,
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
      "& span": {
        color: "#4fa0d8",
      },
      "& hr": {
        width: "75%",
        opacity: 0.1,
        margin: "1rem 0",
      },
      "& .betLeft": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        color: "white",
        [theme.breakpoints.down("xs")]: {
          padding: "20px 15px",
        },
      },
      "& .betRight": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#32363c",
        width: "40%",
        height: "100%",
        fontSize: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        [theme.breakpoints.down("xs")]: {
          background: "transparent",
        },
      },
    },
  },
  players: {
    display: "grid",
    alignItems: "space-between",
    gridColumnGap: 10,
    gridRowGap: 10,
    gridTemplateColumns: "auto auto auto auto",
    width: "100%",
    minHeight: "8vh",
    //marginTop: 15,
    [theme.breakpoints.down("xs")]: {
      display: "unset",
      gridTemplateColumns: "auto auto",
      gridRowGap: 10,
    },
  },
  smallBet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    width: "100%",
    height: 70,
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    borderRadius: 5,
    paddingLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 9,
      paddingLeft: 12,
      marginBottom: 10,
    },
    "& h3, h5": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& span": {
      color: "#4fa0d8",
    },
  },
  potValue: {
    color: "white",
    display: "flex",
    alignItems: "center",
    marginRight: "1.3rem",
    "& img": {
      marginRight: "1rem",
    },
    "& h5, h3": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& h5": {
      color: "#4caf50",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& h3": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".05em",
      [theme.breakpoints.down("sm")]: {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  betInfo: {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& h3": {
      margin: 0,
      [theme.breakpoints.down("xs")]: {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#4fa0d8",
    background: "transparent !important",
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
  hashvalue: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "15px",
    marginTop: "1.5rem",
    marginLeft: "30px",
    cursor: "pointer",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
  avatar2: {
    borderRadius: "100%",
  },
  outline: {
    marginLeft: "auto",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    width: "30%",
    borderBottomRightRadius: "5px",
    borderTopRightRadius: "5px",
    background: "#23272b",
    [theme.breakpoints.down("xs")]: {
      background: "transparent",
      width: "20%",
    },
  },
  multiplier: {
    backgroundColor: "#32363c",
    borderColor: "#32363c",
    boxShadow: "0px 0px 0px 0px #32363c",
    color: "white",
    marginRight: 10,
    "&:hover": {
      backgroundColor: "#32363c",
    },
  },
  reverse: {
    fontFamily: "Rubik",
  },
  create: {
    backgroundColor: "#3386c9",
    borderColor: "#3386c9",
    boxShadow: "0px 0px 0px 0px #32363c",
    color: "#ffffff",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    padding: "0 2rem",
    [theme.breakpoints.down("xs")]: {
      padding: "0.5rem",
    },
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#3386c9",
    },
  },
  round: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& > img": {
      width: 30,
      height: 30,
      marginLeft: 20,
    },
  },
  nonActive: {
    opacity: 0.35,
    transition: "0.25s ease",
  },
  activeRound: {
    transform: "scale(1.05)",
    opacity: 1,
    transition: "0.25s ease",
  },
  aniShuffle: {
    width: 952,
    height: 206,
    position: "relative",
    top: 0,
    transition: "0.25s ease",
  },
  slidertest: {
    marginTop: "12px",
    marginRight: "15px",
    marginLeft: "10px",
    marginBottom: "5px",
    [theme.breakpoints.down("xs")]: {
      marginRight: "34%",
    },
  },
  ballWrap: {
    width: 952,
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ballBox: {
    width: 952,
    height: 206,
    position: "relative",
    top: 0,
    transition: "0.25s ease",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.3)",
    },
    [theme.breakpoints.up("sm")]: {
      transform: "scale(0.6)",
    },
    [theme.breakpoints.up("md")]: {
      transform: "scale(0.85)",
    },
    [theme.breakpoints.up("lg")]: {
      transform: "scale(1)",
    },
  },
  ball: {
    width: 982,
    height: "100%",
    position: "relative",
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
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

// Custom Styled Component
const TimerBar = withStyles({
  root: {
    height: "0.4rem",
  },
  colorPrimary: {
    backgroundColor: "#272b2f",
    borderRadius: "20px",
    height: "7px",
  },
  barColorPrimary: {
    backgroundColor: "#439646",
  },
})(LinearProgress);

// Renderer callback with condition
const renderer = ({ total, minutes, seconds, completed }) => {
  return (
    <TimerBar
      variant="determinate"
      value={total / 19000 * 100}
    />
  );
};

const Shuffle = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [betAmount, setBetAmount] = useState("0.00");

  const [prevGames, setPrevGames] = useState([]);
  const [waitTime, setWaitTime] = useState(5000);
  const [gameStatus, setGameStatus] = useState(0);
  const [finalCountdown, setFinalCountdown] = useState(0);
  const [currentlyPicking, setCurrentlyPicking] = useState(0);
  const [players, setPlayers] = useState([]);
  const [nextRoundPlayers, setNextRoundPlayers] = useState(null);
  const [wheelImages, setWheelImages] = useState([]);
  const [transform, setTransform] = useState("translateX(0px)");
  const [animation, setAnimation] = useState("3s ease");
  const [winner, setWinner] = useState(null);
  const [move, setMove] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [top, setTop] = useState(0);
  const [gameId, setGameId] = useState(null);
  const [privateHash, setPrivateHash] = useState(null);

  // Fetch shuffle schema from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const schema = await getShuffleSchema();

      console.log("Schema:", schema);

      // Get current game status
      const currentStatus = schema.current.status;

      // If current game is on countdown
      if (currentStatus === 2) {
        setWaitTime(Date.now() + schema.current.timeLeft);
      } else if (currentStatus === 3) {
        // If current game is picking players
        setCurrentlyPicking(schema.current.currentlyPicking);
      } else if (currentStatus === 4) {
        // If current game is rolling
        console.log("Shuffle game rolling...");
      }

      // Update state
      setGameId(schema.current._id);
      setPrivateHash(schema.current.privateHash);
      setPlayers(schema.current.players);
      setNextRoundPlayers(schema.current.nextRoundPlayers);
      setGameStatus(currentStatus);
      setLoading(false);
      setPrevGames(schema.history);
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };

  // TextField onChange event handler
  const onChange = e => {
    // Update state
    setBetAmount(e.target.value);
  };

  // Button onClick event handler
  const onClick = () => {
    setJoining(true);
    shuffleSocket.emit("join-game", parseFloat(betAmount));
  };

  // New round has started
  const newRound = (gameId, privateHash) => {
    // Update state
    fetchData();
    setGameId(gameId);
    setPrivateHash(privateHash);
    setGameStatus(1);
    setCurrentlyPicking(0);
    setPlayers([]);
    setNextRoundPlayers(null);
  };

  // Add player to the game
  const addPlayer = player => {
    // Update state
    setPlayers(state => [...state, player]);
  };

  // Player's percentages updated
  const percentagesUpdated = players => {
    // Update state
    setPlayers(players);
  };

  // Server is picking a cup
  const pickingCup = cupId => {
    // Update state
    setGameStatus(3);
    setCurrentlyPicking(cupId);
  };

  // Get cup color from cupId
  const getCupColor = cupId => {
    switch (cupId) {
      default:
      case 1:
        return "#ff4c4c";
      case 2:
        return "#4c7aff";
      case 3:
        return "#4cffa1";
      case 4:
        return "#efff4c";
      case 5:
        return "#e84cff";
    }
  };

  // Countdown started
  const countdownStarted = time => {
    // Update state
    setGameStatus(2);
    setWaitTime(Date.now() + time);
  };

  // Game is rolling
  const rollingGame = () => {
    // Update state
    setCurrentlyPicking(0);
  };

  // Game rolled
  const gameRolled = async (winner, winningCupIndex) => {
    setCurrentlyPicking(0);

    // Coundown stage commences
    await new Promise(resolve => {
      let secunde = 5;
      setFinalCountdown(secunde);
      let int = setInterval(() => {
        secunde -= 1;
        setFinalCountdown(secunde);
        if(secunde <= 0) { clearInterval(int); setFinalCountdown(""); resolve(); }
      }, 1000);
    });

    // Update state
    setGameStatus(4);
    playSound(shufflestartedAudio);

    // Ball image selector
    const winnerBall = [ballRed, ballBlue, ballGreen, ballYellow, ballPink];
	  const winnerNull = [ballNull];

    // Wait for animation and set winner
    setTimeout(() => setWinner(winnerBall[winningCupIndex]), 2400);
    setTimeout(() => setCurrentlyPicking(winningCupIndex + 1), 3800);
	  setTimeout(() => setWinner(winnerNull[0]), 8000);
  };

  // Filter out next round players
  const noNextRoundPlayers = player =>
    ![
      nextRoundPlayers && nextRoundPlayers.red && nextRoundPlayers.red._id,
      nextRoundPlayers && nextRoundPlayers.blue && nextRoundPlayers.blue._id,
      nextRoundPlayers && nextRoundPlayers.green && nextRoundPlayers.green._id,
      nextRoundPlayers &&
        nextRoundPlayers.yellow &&
        nextRoundPlayers.yellow._id,
      nextRoundPlayers && nextRoundPlayers.pink && nextRoundPlayers.pink._id,
    ].includes(player._id);

  // componentDidMount
  useEffect(() => {
    // Player picked for next round
    const playerPicked = (winner, allPlayers, currentCup) => {
      // Reset Animation
      setAnimation("none");
      setTransform("translateX(0px)");

      // Get images for wheel
      const images = allPlayers.map(player => ({
        avatar: player.avatar,
        _id: player._id,
      }));
      setWheelImages(images.map(item => item.avatar));

      // Calculate animation
      const tileWidth = 100;
      const tileCount = images.length;
      const repeatCount = 30;
      const rowWidth = tileCount * tileWidth;
      const winnerIndex = images.map(item => item._id).indexOf(winner._id);
      const translateX =
        (repeatCount / 3) * rowWidth +
        (winnerIndex + 1) * tileWidth -
        tileWidth / 2;

      // Wait for animation reset
      setTimeout(() => {
        setTransform(`translateX(-${translateX}px)`);
        setAnimation("2s ease");
      }, 1000);

      // Wait for the animation
      setTimeout(() => {
        setNextRoundPlayers(state => ({ ...state, [currentCup]: winner }));
      }, 1000);
    };

    // Game joining error handler
    const handleError = msg => {
      setJoining(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Game joining success handler
    const handleSuccess = msg => {
      setJoining(false);
      //addToast("Successfully joined the game!", { appearance: "success" });
      playSound(successAudio);
    };

    // Fetch data initially
    fetchData();

    // Listeners
    shuffleSocket.on("game-join-error", handleError);
    shuffleSocket.on("game-join-success", handleSuccess);
    shuffleSocket.on("new-player", addPlayer);
    shuffleSocket.on("percentages-updated", percentagesUpdated);
    shuffleSocket.on("picking-cup", pickingCup);
    shuffleSocket.on("player-picked", playerPicked);
    shuffleSocket.on("countdown-started", countdownStarted);
    shuffleSocket.on("rolling-game", rollingGame);
    shuffleSocket.on("game-rolled", gameRolled);
    shuffleSocket.on("new-round", newRound);

    // componentDidUnmount
    return () => {
      // Remove Listeners
      shuffleSocket.off("game-join-error", handleError);
      shuffleSocket.off("game-join-success", handleSuccess);
      shuffleSocket.off("new-player", addPlayer);
      shuffleSocket.off("percentages-updated", percentagesUpdated);
      shuffleSocket.off("picking-cup", pickingCup);
      shuffleSocket.off("player-picked", playerPicked);
      shuffleSocket.off("countdown-started", countdownStarted);
      shuffleSocket.off("rolling-game", rollingGame);
      shuffleSocket.off("game-rolled", gameRolled);
      shuffleSocket.off("new-round", newRound);
    };
  }, [addToast]);

  // Preload images
  useEffect(() => {
    const img = new Image();

    // By setting src, we trigger browser download
    img.src = aniShuffle;
    img.src = ballRed;
    img.src = ballBlue;
    img.src = ballGreen;
    img.src = ballYellow;
    img.src = ballPink;
  }, []);

  return (
    <div className={classes.barContainer}>
      <Box className={classes.root}>
        <Container maxWidth="lg">
        <Box className={classes.logo}>
          <Toolbar variant="dense" className={classes.controls}>
      <Box className={classes.logo}>
          <div className={classes.bar}>
            {loading ? (
              null
            ) : gameStatus === 1 ? (
              <TimerBar variant="determinate" value={0} />
            ) : (
              <Countdown
                date={waitTime}
                intervalDelay={0}
                precision={3}
                renderer={renderer}
              />
            )}
          </div>
        </Box>
        <Box className={classes.right}>
          <BetInput
            label=""
            value={betAmount}
            onChange={onChange}
            variant="filled"
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
          backgroundColor: '#282c33'
        },
        active: {
          backgroundColor: '#707479'
        },
      }}
        axis="x"
        xstep={0.1}
        xmin={0}
        xmax={500}
        x={betAmount}
        onChange={({ x }) => setBetAmount(parseFloat(x.toFixed(0)) + ".00")}
      />
          <Button
            className={classes.multiplier}
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
            className={classes.multiplier}
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
            className={classes.multiplier}
            size="medium"
            color="primary"
            variant="contained"
            onClick={() => setBetAmount(user ? user.wallet : 0)}
          >
            <span className={classes.reverse}>MAX</span>
          </Button>
          <Button
            className={classes.create}
            size="medium"
            color="primary"
            variant="contained"
            disabled={joining}
            onClick={onClick}
          >
            <span className={classes.reverse}>
              {joining ? "JOINING..." : "JOIN"}
            </span>
          </Button>
        </Box>
      </Toolbar>
          <Box>
        <Link
          style={{ textDecoration: "none", }}
          exact
          to="/history"
        >
          <Button style={{ textDecoration: "none", }}>
          <HistoryIcon style={{ fontSize: "1rem", marginTop: "-2px", color: "#273a4f", marginRight: "2px", }} />
            <span style={{ textDecoration: "none", color: "#52565c", }} className={classes.reverse}>
             MY HISTORY
            </span>
          </Button>
        </Link>
        </Box>
        </Box>
          <Grid container>
            <Box className={classes.game}>
              <Box className={classes.round}>
                <Tooltip
                    interactive
                    title={
                      <span>
                        Round ID: {gameId}
                        <br />
                        Private Hash: {privateHash}
                      </span>
                    }
                    placement="bottom"
                  >
                    <span>
                    <p className={classes.hashvalue}><CasinoIcon /></p>
                    </span>
                  </Tooltip>
              </Box>
              <Box display="flex" marginLeft="auto" style={{ overflow: "auto", paddingLeft: "1rem", }} >
                {!loading && (
                  <Fragment>
                    <Box className={classes.potValue}>
                      <Box>
                        <h5>CHANCE</h5>
                        <h3 style={{color: "#d94e43", }}>
                          {user
                            ? players.find(player => player._id === user._id)
                              ? `${players
                                  .find(player => player._id === user._id)
                                  .winningPercentage.toFixed(2)}%`
                              : "0.00%"
                            : "0.00%"}
                        </h3>
                      </Box>
                    </Box>
                    <Box className={classes.potValue}>
                      <Box>
                        <h5>MY BET</h5>
                        <h3>
                          {user
                            ? players.find(player => player._id === user._id)
                              ? `$${players
                                  .find(player => player._id === user._id)
                                  .betAmount.toFixed(2)}`
                              : "$0.00"
                            : "$0.00"}
                        </h3>
                      </Box>
                    </Box>
                    <Box className={classes.potValue}>
                      <Box>
                        <h5>TOTAL BETS</h5>
                        <h3>
                          {`$${players
                            .map(player => player.betAmount)
                            .reduce((a, b) => a + b, 0)
                            .toFixed(2)}`}
                        </h3>
                      </Box>
                    </Box>
                  </Fragment>
                )}
              </Box>
            </Box>
            <Box className={classes.animation}>
              {loading ? (
                <Fragment>
                  <ColorCircularProgress />
                </Fragment>
              ) : gameStatus < 3 ? (
                <Fragment>
                  <img src={shufflePause} alt="paused" />
                </Fragment>
              ) : gameStatus === 3 ? (
                <Fragment>
                  <Chose
                    animation={animation}
                    transform={transform}
                    color={getCupColor(currentlyPicking)}
                    images={wheelImages}
                    repeat={30}
                    finalCountdown={finalCountdown}
                  />
                  <Explode color={getCupColor(currentlyPicking)} />
                </Fragment>
              ) : gameStatus === 4 ? (
                <Fragment>
                  <Spritesheet
                    image={aniShuffle}
                    widthFrame={476 * 2}
                    heightFrame={206}
                    steps={120}
                    fps={60}
                    style={{ top: move }}
                    className={classes.aniShuffle}
                    onEnterFrame={[
                      {
                        frame: 119,
                        callback: () => {
                          setMove("-3rem");
                          setTop("3rem");
                          setOpacity(1);
                        },
                      },
                    ]}
                  />
                  <Box className={classes.ballWrap}>
                    <Box className={classes.ballBox}>
                      <Box
                        className={classes.ball}
                        style={{
                          top: top,
                          opacity: opacity,
                          backgroundImage: `url(${winner})`,
                        }}
                        alt="ballResult"
                      />
                    </Box>
                  </Box>
                </Fragment>
              ) : null}
            </Box>
            <Grid className={classes.bets}>
              <Box
                className={
                  currentlyPicking === 1
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.red ? (
                  <Box className="betLeft">
                    <Avatar
                      className={classes.avatar2}
                      src={nextRoundPlayers.red.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.red.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span> {nextRoundPlayers.red.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.red.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" className={classes.avatar2} />
                    <h3>UNKNOWN</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img style={{ width: 20, height: 20 }} src={red} alt="cup" />
                  <h3 style={{ color: "#ff4c4c" }}>RED</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 2
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.blue ? (
                  <Box className="betLeft">
                    <Avatar
                      className={classes.avatar2}
                      src={nextRoundPlayers.blue.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.blue.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.blue.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.blue.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" className={classes.avatar2} />
                    <h3>UNKNOWN</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img style={{ width: 20, height: 20 }} src={blue} alt="cup" />
                  <h3 style={{ color: "#4c7aff" }}>BLUE</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 3
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.green ? (
                  <Box className="betLeft">
                    <Avatar
                      className={classes.avatar2}
                      src={nextRoundPlayers.green.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.green.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.green.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.green.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" className={classes.avatar2} />
                    <h3>UNKNOWN</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img
                    style={{ width: 20, height: 20 }}
                    src={green}
                    alt="cup"
                  />
                  <h3 style={{ color: "#4cffa1" }}>GREEN</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 4
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.yellow ? (
                  <Box className="betLeft">
                    <Avatar
                      className={classes.avatar2}
                      src={nextRoundPlayers.yellow.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.yellow.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.yellow.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.yellow.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" className={classes.avatar2} />
                    <h3>UNKNOWN</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img
                    style={{ width: 20, height: 20 }}
                    src={yellow}
                    alt="cup"
                  />
                  <h3 style={{ color: "#efff4c" }}>YELLOW</h3>
                </Box>
              </Box>
              <Box
                className={
                  currentlyPicking === 5
                    ? classes.activeRound
                    : classes.nonActive
                }
              >
                {nextRoundPlayers && nextRoundPlayers.pink ? (
                  <Box className="betLeft">
                    <Avatar
                      className={classes.avatar2}
                      src={nextRoundPlayers.pink.avatar}
                      variant="rounded"
                    />
                    <h3>{nextRoundPlayers.pink.username}</h3>
                    <hr />
                    <h5>
                      <span>$</span>{" "}
                      {nextRoundPlayers.pink.betAmount.toFixed(2)}
                    </h5>
                    <h5>
                      <span>%</span>{" "}
                      {nextRoundPlayers.pink.winningPercentage.toFixed(2)}
                    </h5>
                  </Box>
                ) : (
                  <Box className="betLeft">
                    <Avatar variant="rounded" className={classes.avatar2} />
                    <h3>UNKNOWN</h3>
                    <hr />
                    <h5>
                      <span>$</span> 000.00
                    </h5>
                    <h5>
                      <span>%</span> 00.00
                    </h5>
                  </Box>
                )}
                <Box className="betRight">
                  <img style={{ width: 20, height: 20 }} src={pink} alt="cup" />
                  <h3 style={{ color: "#e84cff" }}>PINK</h3>
                </Box>
              </Box>
            </Grid>
            <hr />
            <Grid className={classes.players}>
              {nextRoundPlayers && nextRoundPlayers.red && (
                <Box className={classes.smallBet}>
                  <Avatar src={nextRoundPlayers.red.avatar} variant="rounded" className={classes.avatar2} />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.red.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.red.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.red.winningPercentage.toFixed(2)}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={red} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.blue && (
                <Box className={classes.smallBet}>
                  <Avatar
                    className={classes.avatar2}
                    src={nextRoundPlayers.blue.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.blue.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.blue.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.blue.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={blue} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.green && (
                <Box className={classes.smallBet}>
                  <Avatar
                    className={classes.avatar2}
                    src={nextRoundPlayers.green.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.green.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.green.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.green.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={green} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.yellow && (
                <Box className={classes.smallBet}>
                  <Avatar
                    className={classes.avatar2}
                    src={nextRoundPlayers.yellow.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.yellow.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.yellow.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.yellow.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img
                        style={{ width: 32 }}
                        src={yellow}
                        alt="playingCup"
                      />
                    </Box>
                  </Box>
                </Box>
              )}
              {nextRoundPlayers && nextRoundPlayers.pink && (
                <Box className={classes.smallBet}>
                  <Avatar
                    className={classes.avatar2}
                    src={nextRoundPlayers.pink.avatar}
                    variant="rounded"
                  />
                  <Box className={classes.betInfo}>
                    <h3>{nextRoundPlayers.pink.username}</h3>
                    <Box display="flex">
                      <h5>
                        <span> $ </span>
                        {nextRoundPlayers.pink.betAmount.toFixed(2)}{" "}
                      </h5>
                      <h5 style={{ marginLeft: 5 }}>
                        <span> % </span>
                        {nextRoundPlayers.pink.winningPercentage.toFixed(
                          2
                        )}{" "}
                      </h5>
                    </Box>
                  </Box>
                  <Box className={classes.outline}>
                    <Box display="flex" alignItems="center">
                      <img style={{ width: 32 }} src={pink} alt="playingCup" />
                    </Box>
                  </Box>
                </Box>
              )}
              {players
                .sort((a, b) => b.betAmount - a.betAmount)
                .filter(noNextRoundPlayers)
                .map(player => (
                  <Box key={player._id} className={classes.smallBet}>
                    <Avatar src={player.avatar} variant="rounded" className={classes.avatar2} />
                    <Box className={classes.betInfo}>
                      <h3 style={{color: "#878889", }}>
                      {player.username}
                      </h3>
                      <Box display="flex">
                        <h5>
                          <span> $ </span>
                          {player.betAmount.toFixed(2)}{" "}
                        </h5>
                        <h5 style={{ marginLeft: 5 }}>
                          <span> % </span>
                          {player.winningPercentage.toFixed(2)}{" "}
                        </h5>
                      </Box>
                    </Box>
                    <Box className={classes.outline}>
                      <Box display="flex" alignItems="center">
                        <img src={cupOutline} alt="cupOutline" />
                      </Box>
                    </Box>
                  </Box>
                ))}
            </Grid>
            <br/>
            <br/>
            <br/>
            <br/>
            <hr />
            <p style={{color: "#ccc", fontWeight: "500", }}>History: <span style={{color: "#9e9e9e", }}>(Last 5 Rounds)</span></p>
            <br/>
            <br/>
            {prevGames.map(game => (
              <PrevGame key={game._id} game={game} user={user} />
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

Shuffle.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Shuffle);
