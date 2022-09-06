import React from "react";
import { makeStyles } from "@material-ui/core";
import { NavLink as Link } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ChatIcon from "@material-ui/icons/Chat";

// Assets
import cup from "../assets/cup.png";
import spin from "../assets/roll.png";
import king from "../assets/king.png";
import shuffle from "../assets/shuffle.png";
import crash from "../assets/crash.png";

const useStyles = makeStyles(theme => ({
  root: {
    background: "#272b2f",
    borderTop: "1.5px solid hsla(0,0%,100%,.12)",
    display: "flex",
    width: "85%",
    boxShadow: "none",
    padding: "1rem 1rem",
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "83%",
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
  },
  menu: {
    color: "#424863",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
    },
  },
  active: {
    "& > button": {
      height: "3rem",
      width: "5rem",
      backgroundColor: "#2196f3",
      borderColor: "#2196f3",
      color: "#ffffff",
      marginRight: 20,
      "& img": {
        opacity: "1 !important",
      },
      "&:hover": {
        backgroundColor: "#2196f3",
        borderColor: "#2196f3",
      },
      "&:focus": {
        borderColor: "#2196f3",
        background: "#2196f3",
      },
    },
  },
  reverse: {
    textTransform: "capitalize",
    display: "flex",
    "& .crash": {
      height: 35,
    },
  },
  notactive: {
    textDecoration: "none",
    "& > button": {
      width: "5rem",
      height: "3rem",
      borderColor: "#2196f3",
      color: "#ffffff",
      marginRight: 20,
      "&:hover": {
        backgroundColor: "#2196f3",
        borderColor: "#2196f3",
      },
      "&:focus": {
        borderColor: "#2196f3",
        background: "#2196f3",
      },
      [theme.breakpoints.down("sm")]: {
        width: "4rem",
        marginRight: 5,
      },
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {},
    },
  },
  balance: {
    display: "flex",
    flexDirection: "column",
    background: "#111427",
    marginLeft: "auto",
    padding: "0.5rem 5rem 0.5rem 1.5rem",
    borderRadius: "0.25rem",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& span": {
      color: "#4c4f61",
      textTransform: "uppercase",
      fontSize: 8,
    },
  },
  price: {
    fontSize: 15,
  },
  plus: {
    position: "absolute",
    background: "#84C46D",
    padding: "0.25rem 0.3rem",
    right: "-1rem",
    top: "0.75rem",
    minWidth: 30,
    "&:hover": {
      background: "#59ba6e",
    },
    "& span": {
      color: "white",
    },
  },
  pfp: {
    marginLeft: "2rem",
    background: "#181B2B",
    padding: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
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
      color: "#fff",
    },
  },
  link: {
    textDecoration: "none",
    color: "white",
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
    display: "none",
    justifyContent: "space-between",
    position: "fixed",
    bottom: 0,
    zIndex: 10000,
    background: "#272b2f",
    borderTop: "1.5px solid hsla(0,0%,100%,.12)",
    width: "100%",
    padding: 20,
    overflow: "visible",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  chat: {
    position: "absolute",
    bottom: "1.25rem",
    left: "1rem",
    color: "white",
    background: "#2196f3",
    "&:focus": {
      "&:hover": {
        backgroundColor: "#2196f3",
        borderColor: "#2196f3",
      },
      "&:focus": {
        borderColor: "#2196f3",
        background: "#2196f3",
      },
    },
  },
}));

const MobileNav = ({ mobileChat, setMobile }) => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.mobileNav}>
      <Box className={classes.notactive}>
        <Button
          onClick={() => setMobile(!mobileChat)}
          size="large"
          color="primary"
          variant="outlined"
        >
          <span className={classes.reverse}>
            <ChatIcon style={{ color: "white" }} />
          </span>
        </Button>
      </Box>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/crash"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fa"
              data-icon="chart-line"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="10%"
              height="10%"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-chart-line fa-w-16 fa-fw"
            >
              <path
                fill="currentColor"
                d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"
                style={{ color: "#ffffff" }}
              ></path>
            </svg>
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/shuffle"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
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
                style={{ color: "#ffffff" }}
              ></path>
            </svg>
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/cups"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fa"
              data-icon="swords"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="10%"
              height="10%"
              viewBox="0 0 512 512"
              class="svg-inline--fa fa-swords fa-w-16 fa-fw"
            >
              <path
                fill="currentColor"
                d="M507.31 462.06L448 402.75l31.64-59.03c3.33-6.22 2.2-13.88-2.79-18.87l-17.54-17.53c-6.25-6.25-16.38-6.25-22.63 0L420 324 112 16 18.27.16C8.27-1.27-1.42 7.17.17 18.26l15.84 93.73 308 308-16.69 16.69c-6.25 6.25-6.25 16.38 0 22.62l17.53 17.54a16 16 0 0 0 18.87 2.79L402.75 448l59.31 59.31c6.25 6.25 16.38 6.25 22.63 0l22.62-22.62c6.25-6.25 6.25-16.38 0-22.63zm-149.36-76.01L60.78 88.89l-5.72-33.83 33.84 5.72 297.17 297.16-28.12 28.11zm65.17-325.27l33.83-5.72-5.72 33.84L340.7 199.43l33.94 33.94L496.01 112l15.84-93.73c1.43-10-7.01-19.69-18.1-18.1l-93.73 15.84-121.38 121.36 33.94 33.94L423.12 60.78zM199.45 340.69l-45.38 45.38-28.12-28.12 45.38-45.38-33.94-33.94-45.38 45.38-16.69-16.69c-6.25-6.25-16.38-6.25-22.62 0l-17.54 17.53a16 16 0 0 0-2.79 18.87L64 402.75 4.69 462.06c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L109.25 448l59.03 31.64c6.22 3.33 13.88 2.2 18.87-2.79l17.53-17.54c6.25-6.25 6.25-16.38 0-22.63L188 420l45.38-45.38-33.93-33.93z"
                class=""
                style={{ color: "#ffffff" }}
              ></path>
            </svg>
          </span>
        </Button>
      </Link>

      <Link
        exact
        activeClassName={classes.active}
        className={classes.notactive}
        to="/roulette"
      >
        <Button size="large" color="primary" variant="outlined">
          <span className={classes.reverse}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fa"
              data-icon="circle-notch"
              class="svg-inline--fa fa-circle-notch fa-w-16 fa-fw"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="10%"
              height="10%"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"
                style={{ color: "#ffffff" }}
              ></path>
            </svg>
          </span>
        </Button>
      </Link>
    </Box>
  );
};

export default MobileNav;
