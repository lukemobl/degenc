import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

import { Link as NavLink } from "react-router-dom";

//assets
import logo from "../../assets/logonew.svg";

//components
import Controls from "./Controls";
import Link from "@material-ui/core/Link";
import FaqModal from "../modals/FaqModal";
import Container from "@material-ui/core/Container";

import age from "../../assets/18.png";
import ageee from "../../assets/18.svg";

const useStyles = makeStyles(theme => ({
  root: {
    background: "#272b2f",
    borderBottom: "1.5px solid hsla(0,0%,100%,.12)",

    fontSize: "large",

    // background: "#131522",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    height: "5.6rem",
    "& img": {
      height: "4.1rem",
      margin: "auto",
      marginLeft: "2rem",
    },
    "& > div": {
      display: "flex",
      "& > div": {
        width: "100%",
        textAlign: "right",
        display: "flex",
        [theme.breakpoints.down("xs")]: {
          textAlign: "center",
        },
        "& :nth-child(1)": {
          color: "#e0e0e0",
          fontFamily: "Rubik",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: ".15em",
        },
        "& > a": {
          color: "#707479",
          fontFamily: "Rubik",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: ".1em",
          cursor: "pointer",
          textDecoration: "none",
        },
        "& > a:hover": {
          textDecoration: "none",
          outline: "none",
        },
      },
    },
  },
  testnavnew: {
    fontFamily: "Rubik",
    fontWeight: "500",
    textDecoration: "none",
    fontSize: "12px",
    color: "#9e9e9e",
    cursor: "pointer",
    "&:hover": {
      color: "#f1eded",
      cursor: "pointer",
    },
    "& > a": {
      fontFamily: "Rubik",
      fontWeight: "500",
      textDecoration: "none",
      fontSize: "12px",
      color: "#9e9e9e",
      cursor: "pointer",
      "&:hover": {
        color: "#f1eded",
        cursor: "pointer",
      },
    },
    "& > a:hover": {
      fontFamily: "Rubik",
      fontWeight: "500",
      textDecoration: "none",
      fontSize: "12px",
      color: "#f1eded",
      cursor: "pointer",
    },
  },
  root2: {
    background: "#1e2225",
    borderBottom: "4px solid #32363c",
    // background: "#131522",
    display: "flex",
    height: "5.6rem",
    "& img": {
      height: "3.3rem",
      margin: "auto",
      marginLeft: "2rem",
    },
  },

  root3: {
    marginTop: "20px",
    marginLeft: "20px",
  },
  list: {
    textDecoration: "none",
    flexDirection: "column",
    fontFamily: "Rubik",
    fontWeight: "500",
    "& :nth-child(1)": {
      marginBottom: "1.5rem",
      textDecoration: "none",
      fontFamily: "Rubik",
      fontWeight: "500",
    },
    [theme.breakpoints.down("xs")]: {
      "&:nth-child(5)": {
        display: "none",
        fontFamily: "Rubik",
        fontWeight: "500",
      },
    },
  },
}));

const Messages = () => {
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [faqModalVisible, setFaqModalVisible] = useState(false);

  return (
    <Box>
      <Box className={classes.root}>
        {/* <img src={logo} alt="logo" /> */}
        <span>DegenCups.io</span>
      </Box>
      <Box className={classes.root2}>
        <Box className={classes.root3}>
          <Link
            href="https://twitter.com/DegenCups"
            target="blank_"
            alt="Twitter"
          >
            <svg
              style={{ marginRight: "10px", fontSize: "0.9rem" }}
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="twitter-square"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="svg-inline--fa fa-twitter-square fa-w-14 fa-fw"
            >
              <path
                fill="currentColor"
                d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"
                class=""
                style={{ color: "rgb(241 237 237)" }}
              ></path>
            </svg>
          </Link>
          <Link
            href="https://discord.gg/M5kR7kQE3C"
            target="blank_"
            alt="Discord"
          >
            <svg
              style={{
                marginRight: "10px",
                fontSize: "0.9rem",
                marginBottom: "-1px",
              }}
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="discord"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="svg-inline--fa fa-discord fa-w-14 fa-fw"
            >
              <path
                fill="currentColor"
                d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"
                class=""
                style={{ color: "rgb(241 237 237)" }}
              ></path>
            </svg>
          </Link>
          <Box className={classes.list}>
            <NavLink
              to="/terms"
              className={classes.testnavnew}
              style={{ marginRight: "10px", marginLeft: "-1px" }}
            >
              TERMS
            </NavLink>
            <NavLink
              to="/fair"
              className={classes.testnavnew}
              style={{ marginRight: "10px" }}
            >
              FAIR
            </NavLink>
            <FaqModal
              open={faqModalVisible}
              handleClose={() => setFaqModalVisible(state => !state)}
            />
            <Link
              className={classes.testnavnew}
              style={{ marginRight: "10px", textDecoration: "none" }}
              onClick={() => setFaqModalVisible(state => !state)}
            >
              FAQ
            </Link>
            <Link
              className={classes.testnavnew}
              style={{ marginRight: "13px", textDecoration: "none" }}
              href="https://discord.gg/M5kR7kQE3C"
              target="blank_"
              alt="Discord"
            >
              SUPPORT
            </Link>
            <a
              href="https://discord.gg/M5kR7kQE3C"
              target="blank_"
              style={{
                textDecoration: "none",
                fontSize: "11px",
                fontFamily: "Rubik",
                fontWeight: "500",
                textDecoration: "none",
                cursor: "pointer",
                color: "#3c4046",
                height: "0%",
              }}
            >
              <img
                src={ageee}
                alt="age"
                style={{
                  fontSize: "11px",
                  width: "25px",
                  fontFamily: "Rubik",
                  fontWeight: "500",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#3c4046",
                  height: "0%",
                  marginBottom: "-6px",
                  opacity: "0.6",
                }}
              />
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
