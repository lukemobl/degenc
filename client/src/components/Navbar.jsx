import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Skeleton from "@material-ui/lab/Skeleton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

// Icons
// import ShoppingCart from "@material-ui/icons/ShoppingCart";
// import ContactSupport from "@material-ui/icons/ContactSupport";
// import ControlCamera from "@material-ui/icons/ControlCamera";
// import FlashOnIcon from "@material-ui/icons/FlashOn";
// import StarIcon from "@material-ui/icons/Star";

// Components
import { PlayAmount as RoulettePlayAmount } from "../components/roulette/PlayAmount";
import { PlayAmount as CupsPlayAmount } from "../components/cups/PlayAmount";
import { PlayAmount as ShufflePlayAmount } from "../components/shuffle/PlayAmount";
import { PlayAmount as CrashPlayAmount } from "../components/crash/PlayAmount";
import { RaceAmount } from "../components/RaceAmount";

// Modals
import Market from "./modals/MarketModal";
import Help from "./modals/HelpModal";
import Deposit from "./modals/DepositModal";
import Vip from "./modals/VIPModal";
import Free from "./modals/FreeModal";

// Assets
// import cup from "../assets/cup.png";
// import spin from "../assets/roll.png";
// import king from "../assets/king.png";
// import shuffle from "../assets/shuffle.png";
// import crash from "../assets/crash.png";

const useStyles = makeStyles(theme => ({
  root: {
    background: "#272b2f",
    borderBottom: "1.5px solid hsla(0,0%,100%,.12)",
    display: "flex",
    width: "100%",
    boxShadow: "none",
    //padding: "1rem 1rem",
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "calc(100% - 300px)",
      marginLeft: "300px",
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 10,
        paddingRight: 10,
        //padding: "1.5rem 1rem",
      },
    },
  },
  menu: {
    color: "#2196f3",
    fontFamily: "Rubik",
    fontSize: "12.5px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
    },
  },
  active: {
    "& > button": {
      height: "3rem",
      width: "5rem",
      backgroundColor: "#4F79FD",
      borderColor: "#4F79FD",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".1em",
      marginRight: 20,
      "& img": {
        opacity: "1 !important",
      },
    },
  },
  reverse: {
    textTransform: "capitalize",
    "& .crash": {
      height: 35,
    },
  },
  reverse2: {
    display: "block",
    marginLeft: "0rem",
  },
  notactive: {
    textDecoration: "none",
    "& > button": {
      width: "5rem",
      height: "3rem",
      color: "#707479",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".1em",
      marginRight: 20,
      [theme.breakpoints.down("sm")]: {
        width: "4rem",
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "0px",
        marginLeft: "-3px",
      },
    },
  },
  sub2: {
    "& > button": {
      fontSize: "13px",
      color: "#4caf50",
      fontWeight: 500,
      letterSpacing: ".05em",
      [theme.breakpoints.down("lg")]: {},
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {},
      "&:hover": {
        backgroundColor: "rgba(0,0,0,.1)",
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "0px",
        marginLeft: "-3px",
        [theme.breakpoints.down("lg")]: {
          marginRight: "0px",
        },
      },
    },
  },
  sub: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "5.5rem",
      color: "#707479",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      borderTop: "solid 5px #272b2f",
      borderRadius: "0px",
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
      },
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        backgroundColor: "rgba(0,0,0,.1)",
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "0px",
        marginLeft: "-3px",
        [theme.breakpoints.down("lg")]: {
          marginRight: "0px",
        },
      },
    },
  },
  free: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "3rem",
      color: "#ffd027",
      textShadow: "0px 0px 20px #ffd027",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
      },
      "& .makeStyles-reverse-231": {
        [theme.breakpoints.down("lg")]: {
          display: "none",
        },
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "0px",
        marginLeft: "-3px",
        [theme.breakpoints.down("lg")]: {
          marginRight: "0px",
        },
      },
    },
  },
  subActive: {
    textDecoration: "none",
    "& > button": {
      width: "6rem",
      height: "5.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderTop: "5px groove #1a90d1",
      textShadow: "1px -20px 40px #00a4ff",
      borderRadius: "0px",
      marginRight: 20,
      [theme.breakpoints.down("lg")]: {
        width: "fit-content",
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "0px",
        marginLeft: "-3px",
        [theme.breakpoints.down("lg")]: {
          marginRight: "0px",
        },
      },
    },
  },
  balance: {
    display: "flex",
    flexDirection: "column",
    background: "#1e2225",
    border: "2px solid #3b3c3c",
    marginLeft: "6px",
    padding: "0.5rem 5rem 0.3rem 1.5rem",
    marginTop: "-8px",
    borderRadius: "0.25rem",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginTop: "-5px",
    },
    "& span": {
      color: "#e0e0e0",
      textTransform: "uppercase",
      fontFamily: "Rubik",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
  price: {
    fontSize: 15,
    fontFamily: "Rubik",
    color: "#1a90d1",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  plus: {
    position: "absolute",
    background: "#2e8145",
    borderRadius: "100%",
    padding: "0.25rem 0.3rem",
    right: "-1rem",
    top: "0.75rem",
    minWidth: 30,
    "&:hover": {
      background: "#3d9e52",
    },
    "& span": {
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 600,
      letterSpacing: ".1em",
      color: "#e0e0e0",
    },
  },
  pfp: {
    //marginLeft: "2rem",
    padding: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      //marginLeft: 0,
      marginLeft: "2rem",
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
      boxShadow: "0px 0px 5px 5px #212529",
      borderRadius: "100%",
    },
  },
  controls: {
    marginTop: 20,
  },
  right: {
    display: "flex",
    marginLeft: "auto",
  },
  create: {
    backgroundColor: "#FF4D4D",
    borderColor: "#FF4D4D",
    color: "white",
    marginRight: 20,
  },
  multiplier: {
    backgroundColor: "#181B2B",
    borderColor: "#181B2B",
    color: "white",
    marginRight: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modal: {
    "& div > div": {
      background: "#171a32",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".1em",
      color: "#e0e0e0",
    },
  },
  rightMenu: {
    "& > .MuiPaper-root ": {
      backgroundColor: "#272b2f",
      fontSize: "13px",
      fontWeight: 500,
      fontFamily: "Rubik",
      letterSpacing: ".1em",
      boxShadow: "none",
      color: "#e0e0e0",
      width: "10rem",
      top: "5.5rem !important",
      right: "0rem !important",
      left: "auto !important",
    },
  },
  link: {
    textDecoration: "none",
    color: "#e0e0e0",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "Rubik",
    letterSpacing: ".1em",
  },
  link2: {
    textDecoration: "none",
    color: "#e0e0e0",
    fontSize: "14px",
    fontWeight: 500,
    paddingBottom: "10px",
    paddingTop: "10px",
    borderBottom: "2px solid #1e1d1d",
    fontFamily: "Rubik",
    letterSpacing: ".1em",
  },
  desktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  mobileNav: {
    display: "flex",
    position: "fixed",
    bottom: 0,
  },
  steam: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    width: "7.5rem",
    background: "linear-gradient(45deg, #171616, #171616)",
    color: "white",
    marginLeft: "auto",
    margin: "1.5rem 0rem",
    "&:hover": {
      background: "linear-gradient(45deg, #171616, #171616)",
    },
  },
  google: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    width: "7.5rem",
    background: "#2196f3",
    color: "white",
    margin: "1.5rem 0rem",
    "&:hover": {
      opacity: "0.9",
      background: "#2196f3",
    },
  },
  login: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "25px",
    "& > button": {
      height: 40,
    },
    "& > h5": {
      marginRight: 20,
      fontWeight: 500,
      color: "#e0e0e0",
    },
  },
  noLink: {
    textDecoration: "none",
  },
  freeinfo: {
    "& .freenav": {
      color: "#2c7641",
    },
    "& .freenav:hover": {
      color: "#409357",
    },
  },
  pfpp: {
    marginLeft: "10px",
    [theme.breakpoints.down("xs")]: {
      //marginLeft: 0,
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
      boxShadow: "0px 0px 5px 5px #212529",
      borderRadius: "100%",
    },
    "& .usernamenav": {
      color: "#ffc107",
      fontSize: "15px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .levelnav": {
      color: "#80838a",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .levelnav:hover": {
      color: "#f1eded",
    },
    "& .nonenav": {
      color: "#d5d6d8",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .bronzenav": {
      color: "#C27C0E",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .silvernav": {
      color: "#95A5A6",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .goldnav": {
      color: "#b99309",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .diamondnav": {
      color: "#3498DB",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
  },
}));

const Navbar = ({ isAuthenticated, isLoading, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const [openMarket, setOpenMarket] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mbAnchorEl, setMbAnchorEl] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState(null);
  const open = Boolean(anchorEl);
  const openMobile = Boolean(mbAnchorEl);

  // If user has clicked affiliate link
  useEffect(() => {
    // Get affiliate code from localStorage
    const storageCode = localStorage.getItem("affiliateCode");
    // If user is logged in
    if (!isLoading && isAuthenticated && storageCode) {
      // Remove item from localStorage
      localStorage.removeItem("affiliateCode");
      setOpenFree(true);
      setAffiliateCode(storageCode);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar variant="dense" className={classes.desktop}>
        <Market
          handleClose={() => setOpenMarket(!openMarket)}
          open={openMarket}
        />
        <Help handleClose={() => setOpenHelp(!openHelp)} open={openHelp} />
        <Deposit
          handleClose={() => setOpenDeposit(!openDeposit)}
          open={openDeposit}
        />
        <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
        {/* <Free
          handleClose={() => setOpenFree(!openFree)}
          open={openFree}
          code={affiliateCode}
        /> */}

        <Link
          exact
          activeClassName={classes.subActive}
          className={classes.sub}
          to="/crash"
        >
          <Button
            startIcon={
              <svg
                style={{ marginTop: "5px" }}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="chart-line"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-chart-line fa-w-16 fa-fw"
              >
                <path
                  fill="currentColor"
                  d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"
                  style={{ color: "#d24242" }}
                ></path>
              </svg>
            }
            className={classes.reverse2}
          >
            <span className={classes.reverse}>
              CRASH <CrashPlayAmount />
            </span>
          </Button>
        </Link>

        <Link
          exact
          activeClassName={classes.subActive}
          className={classes.sub}
          to="/shuffle"
        >
          <Button
            startIcon={
              <div style={{ padding: "5px" }}>
                <span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="glass-whiskey-rocks"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10%"
                    height="10%"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-glass-whiskey-rocks fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M252.1 345.4l45.3 45.3c12.5 12.5 32.8 12.5 45.3 0l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0l-45.3 45.3c-12.5 12.5-12.5 32.8 0 45.3zM480 32H32C12.5 32-2.4 49.2.3 68.5l56 356.5c4.5 31.5 31.5 54.9 63.4 54.9h273c31.8 0 58.9-23.4 63.4-54.9l55.6-356.5C514.4 49.2 499.5 32 480 32zm-66.3 249.4c9.9 11.6 15.6 26 15.6 41.4 0 17.1-6.7 33.2-18.7 45.3l-45.3 45.3C353.2 425.3 337.1 432 320 432c-17.1 0-33.2-6.7-45.3-18.7L229.5 368H160c-35.3 0-64-28.7-64-64v-38.9L69.4 96h373.2l-28.9 185.4zM160 336h52.2c-.9-4.3-1.4-8.7-1.4-13.3 0-17.1 6.7-33.2 18.7-45.3L256 251v-11c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32z"
                      class=""
                      style={{ color: "#386280" }}
                    ></path>
                  </svg>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="glass-whiskey-rocks"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10%"
                    height="10%"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-glass-whiskey-rocks fa-w-16 fa-fw"
                    style={{ transform: "rotate(18deg)", width: "18px" }}
                  >
                    <path
                      fill="currentColor"
                      d="M252.1 345.4l45.3 45.3c12.5 12.5 32.8 12.5 45.3 0l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0l-45.3 45.3c-12.5 12.5-12.5 32.8 0 45.3zM480 32H32C12.5 32-2.4 49.2.3 68.5l56 356.5c4.5 31.5 31.5 54.9 63.4 54.9h273c31.8 0 58.9-23.4 63.4-54.9l55.6-356.5C514.4 49.2 499.5 32 480 32zm-66.3 249.4c9.9 11.6 15.6 26 15.6 41.4 0 17.1-6.7 33.2-18.7 45.3l-45.3 45.3C353.2 425.3 337.1 432 320 432c-17.1 0-33.2-6.7-45.3-18.7L229.5 368H160c-35.3 0-64-28.7-64-64v-38.9L69.4 96h373.2l-28.9 185.4zM160 336h52.2c-.9-4.3-1.4-8.7-1.4-13.3 0-17.1 6.7-33.2 18.7-45.3L256 251v-11c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32z"
                      class=""
                      style={{ color: "rgb(94 95 98)" }}
                    ></path>
                  </svg>
                </span>
              </div>
            }
            className={classes.reverse2}
          >
            <div style={{ marginTop: "-10px" }}>
              <span className={classes.reverse}>
                SHUFFLE <ShufflePlayAmount />
              </span>
            </div>
          </Button>
        </Link>

        <Link
          exact
          activeClassName={classes.subActive}
          className={classes.sub}
          to="/cups"
        >
          <Button
            startIcon={
              <svg
                style={{ marginTop: "5px" }}
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="swords"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-inline--fa fa-swords fa-w-16 fa-fw"
              >
                <g class="fa-group">
                  <path
                    fill="currentColor"
                    d="M153.37 278.63L100 332l-24.69-24.69a16 16 0 0 0-22.62 0l-17.54 17.53a16 16 0 0 0-2.79 18.87l31.64 59-59.31 59.35a16 16 0 0 0 0 22.63l22.62 22.62a16 16 0 0 0 22.63 0L109.25 448l59 31.64a16 16 0 0 0 18.87-2.79l17.53-17.54a16 16 0 0 0 0-22.62L180 412l53.37-53.37zM496.79.14l-78.11 13.2-140 140 80 80 140-140 13.2-78.11A13.33 13.33 0 0 0 496.79.14z"
                    class="fa-secondary"
                    style={{ color: "#27713c" }}
                  ></path>
                  <path
                    fill="currentColor"
                    d="M389.37 309.38l-296-296L15.22.14A13.32 13.32 0 0 0 .14 15.22l13.2 78.11 296 296.05zm117.94 152.68L448 402.75l31.64-59a16 16 0 0 0-2.79-18.87l-17.54-17.53a16 16 0 0 0-22.63 0L307.31 436.69a16 16 0 0 0 0 22.62l17.53 17.54a16 16 0 0 0 18.87 2.79l59-31.64 59.31 59.31a16 16 0 0 0 22.63 0l22.62-22.62a16 16 0 0 0 .04-22.63z"
                    class="fa-primary"
                    class=""
                    style={{ color: "#228926" }}
                  ></path>
                </g>
              </svg>
            }
            className={classes.reverse2}
          >
            <span className={classes.reverse}>
              CUPS <CupsPlayAmount />
            </span>
          </Button>
        </Link>

        {/* <Link
          exact
          activeClassName={classes.subActive}
          className={classes.sub}
          to="/roulette"
        >
          <Button
            startIcon={
              <svg
                style={{ marginTop: "5px" }}
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="circle-notch"
                class="svg-inline--fa fa-circle-notch fa-w-16 fa-fw"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"
                  style={{ color: "#756f25" }}
                ></path>
              </svg>
            }
            className={classes.reverse2}
          >
            <span className={classes.reverse}>
              ROULETTE <RoulettePlayAmount />
            </span>
          </Button>
        </Link> */}

        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? (
          <div className={classes.login}>
            {/* <Link
              exact
              activeClassName={classes.subActive}
              className={classes.sub}
              to="/race"
            >
              <Button
                startIcon={
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="receipt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="svg-inline--fa fa-receipt fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z"
                      class="fa-primary"
                      style={{ color: "#ffffff" }}
                    ></path>
                  </svg>
                }
                className={classes.reverse2}
              >
                <span className={classes.reverse}>RACE</span> <RaceAmount />
              </Button>
            </Link> */}

            {/* <Link
              exact
              to="/affiliates"
              className={classes.sub}
              activeClassName={classes.subActive}
            >
              <Button
                className={classes.reverse2}
                startIcon={
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="link"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-link fa-w-16 fa-fw"
                  >
                    <path
                      style={{ color: "#2196f3" }}
                      fill="currentColor"
                      d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z"
                      class=""
                    ></path>
                  </svg>
                }
              >
                {" "}
                AFFILIATES
              </Button>
            </Link> */}

            <Box>
              <Box className={classes.balance}>
                <Box className={classes.reverse} flexDirection="column">
                  <Box component="span">Balance</Box>
                  <Box className={classes.price}>
                    $
                    {parseCommasToThousands(
                      cutDecimalPoints(user.wallet.toFixed(7))
                    )}
                  </Box>
                </Box>
                <Button
                  onClick={() => setOpenDeposit(!openDeposit)}
                  variant="contained"
                  className={classes.plus}
                >
                  +
                </Button>
              </Box>
              {/* <Box className={classes.freeinfo}>
                <p
                  onClick={() => setOpenFree(!openFree)}
                  onClose={() => setMbAnchorEl(null)}
                  style={{
                    marginBottom: "-13px",
                    cursor: "pointer",
                    marginLeft: "8px",
                    fontSize: "11px",
                    fontWeight: "500",
                    fontFamily: "Rubik",
                    marginTop: "3px",
                  }}
                >
                  🎲 <span className="freenav">Claim $0.10</span>
                </p>
              </Box> */}
            </Box>
            <Box className={classes.sub} activeClassName={classes.subActive}>
              {isAuthenticated && user && (
                <Button
                  style={{ marginLeft: "25px" }}
                  className={classes.reverse2}
                  onClick={() => setOpenMarket(!openMarket)}
                  onClose={() => setAnchorEl(null)}
                  startIcon={
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="link"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      class="svg-inline--fa fa-link fa-w-16 fa-fw"
                    >
                      <path
                        style={{ color: "#a9a6a6" }}
                        fill="currentColor"
                        d="M448 112V96c0-35.35-28.65-64-64-64H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h352c35.35 0 64-28.65 64-64V176c0-35.35-28.65-64-64-64zm16 304c0 8.82-7.18 16-16 16H96c-26.47 0-48-21.53-48-48V128c0-26.47 21.53-48 48-48h288c8.82 0 16 7.18 16 16v32H112c-8.84 0-16 7.16-16 16s7.16 16 16 16h336c8.82 0 16 7.18 16 16v240zm-80-160c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"
                        class=""
                      ></path>
                    </svg>
                  }
                >
                  {" "}
                  WITHDRAW
                </Button>
              )}
            </Box>
            <Box className={classes.pfp}>
              <Link exact to="/profile">
                <Avatar variant="rounded" src={user.avatar} />
              </Link>
            </Box>
            <Box className={classes.pfpp}>
              <span>
                <Link style={{ textDecoration: "none" }} exact to="/profile">
                  <span className="usernamenav">{user.username}</span>
                </Link>
                <br />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenVip(!openVip)}
                  onClose={() => setAnchorEl(null)}
                >
                  <span className="levelnav">Level</span>
                  {user.wager < 500 ? (
                    <span className="nonenav"> 🛡️ GAMBLER</span>
                  ) : user.wager >= 26000 ? (
                    <span className="diamondnav"> 💎 DIAMOND</span>
                  ) : user.wager >= 9000 ? (
                    <span className="goldnav"> 🥇 GOLD</span>
                  ) : user.wager >= 2100 ? (
                    <span className="silvernav"> 🥈 SILVER</span>
                  ) : (
                    <span className="bronzenav"> 🥉 BRONZE</span>
                  )}
                </span>
              </span>
            </Box>
          </div>
        ) : (
          <div className={classes.login}>
            {/* <Link
              exact
              activeClassName={classes.subActive}
              className={classes.sub}
              to="/race"
            >
              <Button
                startIcon={
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="receipt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="svg-inline--fa fa-receipt fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z"
                      class="fa-primary"
                      style={{ color: "#ffffff" }}
                    ></path>
                  </svg>
                }
                className={classes.reverse2}
              >
                <span className={classes.reverse}>RACE</span> <RaceAmount />
              </Button>
            </Link> */}

            <span className={classes.sub}>
              <Button
                onClick={() => setOpenHelp(!openHelp)}
                //size="small"
                startIcon={
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="question-circle"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-question-circle fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
                      class=""
                      style={{ color: "#2196f3" }}
                    ></path>
                  </svg>
                }
                className={classes.reverse2}
              >
                <span className={classes.reverse}>HELP</span>
              </Button>
            </span>

            <Link to="/registration" className={classes.noLink}>
              <Button className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fas fa-sign-in-alt"
                ></i>
                LOGIN
              </Button>
            </Link>
          </div>
        )}
      </Toolbar>

      <Toolbar className={classes.mobile}>
        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? (
          <div
            style={{ display: "flex", width: "100%", padding: "1.5rem 1rem" }}
          >
            <Box className={classes.balance}>
              <Box className={classes.reverse} flexDirection="column">
                <Box component="span">Balance</Box>
                <Box className={classes.price}>
                  $
                  {parseCommasToThousands(
                    cutDecimalPoints(user.wallet.toFixed(7))
                  )}
                </Box>
              </Box>
              <Button
                onClick={() => setOpenDeposit(!openDeposit)}
                variant="contained"
                className={classes.plus}
              >
                +
              </Button>
            </Box>
            <Box className={classes.pfp}>
              <Link exact to="/profile">
                <Avatar variant="rounded" src={user.avatar} />
              </Link>
            </Box>
            <IconButton
              onClick={event => setMbAnchorEl(event.currentTarget)}
              edge="start"
              className={classes.menu}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              open={openMobile}
              onClose={() => setMbAnchorEl(null)}
              className={classes.rightMenu}
            >
              {/* <Link exact to="/race" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    aria-hidden="true"
                    style={{ marginRight: "8px" }}
                    focusable="false"
                    data-prefix="far"
                    data-icon="receipt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="svg-inline--fa fa-receipt fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z"
                      class="fa-primary"
                      style={{ color: "#ffffff" }}
                    ></path>
                  </svg>{" "}
                  RACE
                </MenuItem>{" "}
              </Link> */}
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClick={() => setOpenMarket(!openMarket)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "#4d9acf" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="wallet"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-wallet fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M448 112V96c0-35.35-28.65-64-64-64H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h352c35.35 0 64-28.65 64-64V176c0-35.35-28.65-64-64-64zm16 304c0 8.82-7.18 16-16 16H96c-26.47 0-48-21.53-48-48V128c0-26.47 21.53-48 48-48h288c8.82 0 16 7.18 16 16v32H112c-8.84 0-16 7.16-16 16s7.16 16 16 16h336c8.82 0 16 7.18 16 16v240zm-80-160c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"
                      class=""
                    ></path>
                  </svg>{" "}
                  WITHDRAW
                </MenuItem>{" "}
              </Box>

              <Box className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClick={() => setOpenVip(!openVip)}
                  onClose={() => setAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "rgb(197 66 56)" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="comet"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-comet fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M97.12 362.63c-8.69-8.69-4.16-6.24-25.12-11.85-9.51-2.55-17.87-7.45-25.43-13.32L1.2 448.7c-4.39 10.77 3.81 22.47 15.43 22.03l52.69-2.01L105.56 507c8 8.44 22.04 5.81 26.43-4.96l52.05-127.62c-10.84 6.04-22.87 9.58-35.31 9.58-19.5 0-37.82-7.59-51.61-21.37zM382.8 448.7l-45.37-111.24c-7.56 5.88-15.92 10.77-25.43 13.32-21.07 5.64-16.45 3.18-25.12 11.85-13.79 13.78-32.12 21.37-51.62 21.37-12.44 0-24.47-3.55-35.31-9.58L252 502.04c4.39 10.77 18.44 13.4 26.43 4.96l36.25-38.28 52.69 2.01c11.62.44 19.82-11.27 15.43-22.03zM263 340c15.28-15.55 17.03-14.21 38.79-20.14 13.89-3.79 24.75-14.84 28.47-28.98 7.48-28.4 5.54-24.97 25.95-45.75 10.17-10.35 14.14-25.44 10.42-39.58-7.47-28.38-7.48-24.42 0-52.83 3.72-14.14-.25-29.23-10.42-39.58-20.41-20.78-18.47-17.36-25.95-45.75-3.72-14.14-14.58-25.19-28.47-28.98-27.88-7.61-24.52-5.62-44.95-26.41-10.17-10.35-25-14.4-38.89-10.61-27.87 7.6-23.98 7.61-51.9 0-13.89-3.79-28.72.25-38.89 10.61-20.41 20.78-17.05 18.8-44.94 26.41-13.89 3.79-24.75 14.84-28.47 28.98-7.47 28.39-5.54 24.97-25.95 45.75-10.17 10.35-14.15 25.44-10.42 39.58 7.47 28.36 7.48 24.4 0 52.82-3.72 14.14.25 29.23 10.42 39.59 20.41 20.78 18.47 17.35 25.95 45.75 3.72 14.14 14.58 25.19 28.47 28.98C104.6 325.96 106.27 325 121 340c13.23 13.47 33.84 15.88 49.74 5.82a39.676 39.676 0 0 1 42.53 0c15.89 10.06 36.5 7.65 49.73-5.82zM97.66 175.96c0-53.03 42.24-96.02 94.34-96.02s94.34 42.99 94.34 96.02-42.24 96.02-94.34 96.02-94.34-42.99-94.34-96.02z"
                      class=""
                    ></path>
                  </svg>{" "}
                  LEVEL
                </MenuItem>{" "}
              </Box>

              {/* <Link exact to="/affiliates" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "#ff9800" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="link"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-link fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z"
                      class=""
                    ></path>
                  </svg>{" "}
                  AFFILIATES
                </MenuItem>{" "}
              </Link> */}
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  style={{ borderBottom: "1px", marginBottom: "-10px" }}
                  onClick={() => setOpenFree(!openFree)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "rgb(122 114 39)" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="coins"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-coins fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M320 0C214 0 128 35.8 128 80v52.6C53.5 143.6 0 173.2 0 208v224c0 44.2 86 80 192 80s192-35.8 192-80v-52.7c74.5-11 128-40.5 128-75.3V80c0-44.2-86-80-192-80zm16 428.3C326 440 275.6 464 192 464S58 440 48 428.3v-39.5c35.2 16.6 86.6 27.2 144 27.2s108.8-10.6 144-27.2v39.5zm0-96C326 344 275.6 368 192 368S58 344 48 332.3v-44.9c35.2 20 86.6 32.6 144 32.6s108.8-12.7 144-32.6v44.9zM192 272c-79.5 0-144-21.5-144-48s64.5-48 144-48 144 21.5 144 48-64.5 48-144 48zm272 28.3c-7.1 8.3-34.9 22.6-80 30.4V283c31-4.6 58.7-12.1 80-22.2v39.5zm0-96c-7.1 8.3-34.9 22.6-80 30.4V208c0-7.2-2.5-14.2-6.8-20.9 33.8-5.3 64-14.8 86.8-27.8v45zM320 144c-5 0-9.8-.3-14.7-.5-26-7.9-56.8-13.2-90.4-14.9C191 120 176 108.6 176 96c0-26.5 64.5-48 144-48s144 21.5 144 48-64.5 48-144 48z"
                      class=""
                    ></path>
                  </svg>{" "}
                  FREE $0.1
                </MenuItem>{" "}
              </Box>
            </Menu>
          </div>
        ) : (
          <div className={classes.login}>
            <Link to="/registration" className={classes.noLink}>
              <Button className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fas fa-sign-in-alt"
                ></i>
                LOGIN
              </Button>
            </Link>
            <IconButton
              onClick={event => setMbAnchorEl(event.currentTarget)}
              edge="start"
              className={classes.menu}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              open={openMobile}
              onClose={() => setMbAnchorEl(null)}
              className={classes.rightMenu}
            >
              <Link exact to="/crash" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "#d24242" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="chart-line"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-chart-line fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"
                    ></path>
                  </svg>{" "}
                  CRASH
                </MenuItem>{" "}
              </Link>
              <Link exact to="/shuffle" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "#386280" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="glass-whiskey-rocks"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10%"
                    height="10%"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-glass-whiskey-rocks fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M252.1 345.4l45.3 45.3c12.5 12.5 32.8 12.5 45.3 0l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-12.5-12.5-32.8-12.5-45.3 0l-45.3 45.3c-12.5 12.5-12.5 32.8 0 45.3zM480 32H32C12.5 32-2.4 49.2.3 68.5l56 356.5c4.5 31.5 31.5 54.9 63.4 54.9h273c31.8 0 58.9-23.4 63.4-54.9l55.6-356.5C514.4 49.2 499.5 32 480 32zm-66.3 249.4c9.9 11.6 15.6 26 15.6 41.4 0 17.1-6.7 33.2-18.7 45.3l-45.3 45.3C353.2 425.3 337.1 432 320 432c-17.1 0-33.2-6.7-45.3-18.7L229.5 368H160c-35.3 0-64-28.7-64-64v-38.9L69.4 96h373.2l-28.9 185.4zM160 336h52.2c-.9-4.3-1.4-8.7-1.4-13.3 0-17.1 6.7-33.2 18.7-45.3L256 251v-11c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32z"
                      class=""
                    ></path>
                  </svg>{" "}
                  SHUFFLE
                </MenuItem>{" "}
              </Link>
              <Link exact to="/cups" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8 }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="swords"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-swords fa-w-16 fa-fw"
                  >
                    <g class="fa-group">
                      <path
                        fill="currentColor"
                        d="M153.37 278.63L100 332l-24.69-24.69a16 16 0 0 0-22.62 0l-17.54 17.53a16 16 0 0 0-2.79 18.87l31.64 59-59.31 59.35a16 16 0 0 0 0 22.63l22.62 22.62a16 16 0 0 0 22.63 0L109.25 448l59 31.64a16 16 0 0 0 18.87-2.79l17.53-17.54a16 16 0 0 0 0-22.62L180 412l53.37-53.37zM496.79.14l-78.11 13.2-140 140 80 80 140-140 13.2-78.11A13.33 13.33 0 0 0 496.79.14z"
                        class="fa-secondary"
                        style={{ color: "#27713c" }}
                      ></path>
                      <path
                        fill="currentColor"
                        d="M389.37 309.38l-296-296L15.22.14A13.32 13.32 0 0 0 .14 15.22l13.2 78.11 296 296.05zm117.94 152.68L448 402.75l31.64-59a16 16 0 0 0-2.79-18.87l-17.54-17.53a16 16 0 0 0-22.63 0L307.31 436.69a16 16 0 0 0 0 22.62l17.53 17.54a16 16 0 0 0 18.87 2.79l59-31.64 59.31 59.31a16 16 0 0 0 22.63 0l22.62-22.62a16 16 0 0 0 .04-22.63z"
                        class="fa-primary"
                        class=""
                        style={{ color: "#228926" }}
                      ></path>
                    </g>
                  </svg>{" "}
                  CUPS
                </MenuItem>{" "}
              </Link>
              {/* <Link exact to="/roulette" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "#756f25" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="circle-notch"
                    class="svg-inline--fa fa-circle-notch fa-w-16 fa-fw"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"
                    ></path>
                  </svg>{" "}
                  ROULETTE
                </MenuItem>{" "}
              </Link> */}

              {/* <Link exact to="/race" className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    aria-hidden="true"
                    style={{ marginRight: "8px" }}
                    focusable="false"
                    data-prefix="far"
                    data-icon="receipt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    class="svg-inline--fa fa-receipt fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z"
                      class="fa-primary"
                      style={{ color: "#ffffff" }}
                    ></path>
                  </svg>{" "}
                  RACE
                </MenuItem>{" "}
              </Link> */}
              <Box className={classes.link}>
                {" "}
                <MenuItem
                  className={classes.link2}
                  style={{ borderBottom: "1px", marginBottom: "-10px" }}
                  onClick={() => setOpenHelp(!openHelp)}
                  onClose={() => setMbAnchorEl(null)}
                >
                  <svg
                    style={{ marginRight: 8, color: "#4d9acf" }}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="question-circle"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    class="svg-inline--fa fa-question-circle fa-w-16 fa-fw"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
                      class=""
                      style={{ color: "#2196f3" }}
                    ></path>
                  </svg>{" "}
                  HELP
                </MenuItem>{" "}
              </Box>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Navbar);
