import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink as Link } from "react-router-dom";

// API Services
import { tryLoginUser, tryRegisterUser } from "../services/api.service";

// notification
import { useToasts } from "react-toast-notifications";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// Custom Styles
const useStyles = makeStyles({
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    fontFamily: "Rubik",
    fontWeight: "500",
    marginTop: "85px",
    color: "#4CAF50",
    "& > div": {
      "& label": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontWeight: "500",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#191b1e",
        fontFamily: "Rubik",
        fontWeight: "500",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#191b1e",
          fontFamily: "Rubik",
          fontWeight: "500",
        },
        "&:hover fieldset": {
          borderColor: "#191b1e",
          fontFamily: "Rubik",
          fontWeight: "500",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#191b1e",
          fontFamily: "Rubik",
          fontWeight: "500",
        },
      },
      "& > div > input": {
        color: "#4CAF50",
        fontFamily: "Rubik",
        fontWeight: "500",
      },
    },
    "& > div > div": {
      background: "#191b1e !important",
      color: "#4CAF50",
      fontFamily: "Rubik",
      fontWeight: "500",
      marginBottom: "10px",
      borderRadius: "20px",
      border: "2px solid #272b2f",
    },
  },
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    // overflow: "auto",
    padding: "2rem 0",
  },
  lastupdate: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  counterup: {
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  buttonregister: {
    color: "#ffffff",
    width: "40%",
    borderRadius: "50px",
    fontSize: "17px",
    background: "#273a4f",
    fontFamily: "Rubik",
    fontWeight: "500",
    letterSpacing: ".02em",
    "&:hover": {
      opacity: "0.8",
      background: "#273a4f",
    },
  },
  buttonlogin: {
    color: "#ffffff",
    width: "40%",
    borderRadius: "50px",
    fontSize: "17px",
    background: "#f44336",
    fontFamily: "Rubik",
    fontWeight: "500",
    letterSpacing: ".02em",
    "&:hover": {
      opacity: "0.8",
      background: "#f44336",
    },
  },
  steam: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    width: "7.5rem",
    background: "linear-gradient(45deg, #363333, #141414)",
    color: "white",
    marginLeft: "auto",
    marginTop: "20px",
    marginBottom: "10px",
    "&:hover": {
      opacity: "0.8",
      background: "linear-gradient(45deg, #363333, #141414)",
    },
  },
  google: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    width: "7.5rem",
    marginLeft: "10px",
    marginTop: "10px",
    background: "linear-gradient(45deg, #384a85, #0d5f86)",
    color: "white",
    "&:hover": {
      opacity: "0.8",
      background: "linear-gradient(45deg, #384a85, #0d5f86)",
    },
  },
  noLink: {
    textDecoration: "none",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "600px",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "19px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
});

const Registration = () => {
  // Declare State
  const classes = useStyles();

  const { addToast } = useToasts();

  const [isLoginFields, setLoginFields] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  // Input onChange event handler
  const onChangeUsername = e => {
    setUsername(e.target.value);
  };
  const onChangePassword = e => {
    setPassword(e.target.value);
  };
  const onChangePassword2 = e => {
    setPassword2(e.target.value);
  };
  const onChangeEmail = e => {
    setEmail(e.target.value);
  };

  // Goto on clicks

  const onClickGotoLogin = e => {
    setLoginFields(true);
    emptyFields();
  };
  const onClickGotoRegister = e => {
    setLoginFields(false);
    emptyFields();
  };

  // On click - API endpoints

  const onClickRegister = async e => {
    if (password != password2)
      return addToast("The passwords are not equal!", { appearance: "error" });
    let resp = await tryRegisterUser(username, password, email);
    if (resp.error) return addToast(resp.error, { appearance: "error" });
    addToast("You've successfully registered an account!", {
      appearance: "success",
    });
    setTimeout(() => {
      window.location.href = resp.redirect;
    }, 1000);
  };

  const onClickLogin = async e => {
    let resp = await tryLoginUser(email, password);
    if (resp.error) return addToast(resp.error, { appearance: "error" });
    if (resp.redirect) {
      addToast("You've been successfully logged in!", {
        appearance: "success",
      });
      setTimeout(() => {
        window.location.href = resp.redirect;
      }, 1000);
    }
  };

  // Empty fields
  const emptyFields = () => {
    setUsername("");
    setPassword("");
    setPassword2("");
    setEmail("");
  };

  return (
    <Box className={classes.root}>
      {!isLoginFields ? (
        <Container className={classes.container}>
          <Box className={classes.inputs}>
            <TextField
              name="username"
              variant="outlined"
              placeholder="Username"
              onChange={onChangeUsername}
              value={username}
            />
            <TextField
              name="email"
              type="email"
              variant="outlined"
              placeholder="Email"
              onChange={onChangeEmail}
              value={email}
            />
            <TextField
              name="password"
              type="password"
              variant="outlined"
              placeholder="Secure Password"
              onChange={onChangePassword}
              value={password}
            />
            <TextField
              name="password2"
              type="password"
              variant="outlined"
              placeholder="Repeat Password"
              onChange={onChangePassword2}
              value={password2}
            />
          </Box>
          <br />
          <br />
          <br />
          <p style={{ marginLeft: "5px" }}>
            By registering, you have read and accepted the{" "}
            <a
              style={{ textDecoration: "none", color: "rgb(139 133 133)" }}
              href="/terms"
            >
              terms of service
            </a>{" "}
            of our site.
          </p>
          <br />
          <Button
            size="medium"
            color="primary"
            className={classes.buttonregister}
            variant="contained"
            onClick={onClickRegister}
          >
            <span>Register Now</span>
          </Button>
          <br />
          <Button
            size="medium"
            color="primary"
            className={classes.buttonlogin}
            variant="contained"
            onClick={onClickGotoLogin}
          >
            <span>Go to Login</span>
          </Button>
          <br />
          <div>
            {/* <Link to="/login/steam" className={classes.noLink}>
              <Button className={classes.steam} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-steam-symbol"
                ></i>
                STEAM
              </Button>
            </Link> */}
            <Link to="/login/google" className={classes.noLink}>
              <Button className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-google"
                ></i>
                GOOGLE
              </Button>
            </Link>
          </div>
        </Container>
      ) : (
        <Container className={classes.container}>
          <Box className={classes.inputs}>
            <TextField
              name="email"
              variant="outlined"
              placeholder="Email"
              onChange={onChangeEmail}
              value={email}
            />
            <TextField
              name="password"
              type="password"
              variant="outlined"
              placeholder="Secure Password"
              onChange={onChangePassword}
              value={password}
            />
          </Box>
          <p style={{ marginLeft: "5px" }}>
            If you forgot your login credentials please{" "}
            <a
              style={{ textDecoration: "none", color: "rgb(139 133 133)" }}
              href="https://discord.com/invite/AvnaPpnhJX"
              target="_blank"
            >
              contact
            </a>{" "}
            us asap.
          </p>
          <br />
          <Button
            size="medium"
            color="primary"
            className={classes.buttonlogin}
            variant="contained"
            onClick={onClickLogin}
          >
            <span>Login</span>
          </Button>
          <br />
          <Button
            size="medium"
            color="primary"
            className={classes.buttonregister}
            variant="contained"
            onClick={onClickGotoRegister}
          >
            <span>Register Account</span>
          </Button>
          <br />
          <div>
            {/* <Link to="/login/steam" className={classes.noLink}>
              <Button className={classes.steam} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-steam-symbol"
                ></i>
                STEAM
              </Button>
            </Link> */}
            <Link to="/login/google" className={classes.noLink}>
              <Button className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 5, fontSize: 20 }}
                  className="fab fa-google"
                ></i>
                GOOGLE
              </Button>
            </Link>
          </div>
        </Container>
      )}
    </Box>
  );
};

export default Registration;
