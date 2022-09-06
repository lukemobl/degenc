import React from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

// Declare useful variables
const GIPHY_URLS = [
  "https://media.giphy.com",
  "https://media0.giphy.com",
  "https://media1.giphy.com",
  "https://media2.giphy.com",
  "https://media3.giphy.com",
];

const useStyles = makeStyles({
  content: {
    overflowY: "hidden",
    color: "#707479",
    fontSize: 13,
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".1em",
    whiteSpace: "normal",
    marginTop: 7,
    background: "#607d8b0d",
    padding: "10px",
    borderRadius: "20px",
    marginRight: "70px",
  },
  avatar: {
    width: 25,
    height: 25,
    marginRight: 10,
    margin: "0px 15px",
    borderRadius: "100%",
  },
  chatbox: {
    display: "flex",
    padding: "20px 0px",
    borderTop: "1.5px solid #2f3132",
    fontFamily: "Rubik",
    borderRadius: 0,
    "& .message": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "& > div": {
        display: "flex",
      },
    },
    "& .message .username": {
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      marginTop: "4px",
      fontSize: 11,
    },
    "& .admin": {
      background: "#ca382d",
      borderRadius: 3,
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
    },
    "& .mod": {
      background: "#3e8441",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .dev": {
      background: "#0b655c",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
	"& .partner": {
      background: "#791f84",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .user": {
      background: "#31363c",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
  "& .userlevel": {
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
	"& .bronze": {
      background: "#C27C0E",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
	"& .silver": {
      background: "#95A5A6",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
	"& .gold": {
      background: "#b99309",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
	"& .diamond": {
      background: "#3498DB",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
  },
  gif: {
    width: "75%",
    borderRadius: 5,
    marginTop: 5,
  },
});

const Message = ({ message }) => {
  // Declare state
  const classes = useStyles();

  // Check if message contains a GIF
  const checkIfContainsGif = msg => {
    return GIPHY_URLS.filter(url => msg.includes(url)).length > 0;
  };

  return (
    <Box className={classes.chatbox}>
      <Avatar
        variant="rounded"
        src={message.user.avatar}
        className={classes.avatar}
      />
      <div className="message">
        {message.user.rank === 5 ? (
          <Box>
            <div className="admin">ADMIN</div>
            <div className="username">{message.user.username}</div>
          </Box>
        ) : (
          <div className="username">
            {<span className="userlevel">{message.user.level.name}</span>}
            {message.user.rank === 4 && <span className="mod">MOD</span>}
            {message.user.rank === 3 && <span className="dev">DEV</span>}
			      {message.user.rank === 2 && <span className="partner">PARTNER</span>}
            {message.user.rank === 1 && <span className="user">USER</span>}
      {message.user.username}{" "}
          </div>
        )}
        {checkIfContainsGif(message.content) ? (
          <div className={classes.content}>
            <img
              className={classes.gif}
              src={message.content}
              alt={message.content}
            />
          </div>
        ) : (
          <div className={classes.content}>{message.content}</div>
        )}
      </div>
    </Box>
  );
};

export default Message;
