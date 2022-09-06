import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import TipModal from "../modals/TipModal";

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
    marginTop: 15,
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
    borderTop: "1.5px solid #212529",
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
    "& .message": {
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      marginTop: "4px",
      fontSize: 11,
    },
    "& .username": {
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      marginTop: "1px",
      fontSize: 11,
      "&:hover": {
        opacity: "0.5",
        cursor: "pointer",
      },
    },
    "& .admin": {
      background: "#ca382d",
      borderRadius: 3,
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
      fontSize: 10,
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
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
  },
  contextMenu: {
    background: "#212529",
    border: "1px solid #212529",
    color: "#fff",
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "1rem 0 0 0",
    zIndex: "100",
  },
  contextMenuItem: {
    cursor: "pointer",
    // margin: ".5rem 0",
    color: "white",
    padding: ".7rem 1.5rem",
    transition: "all .3s ease",
    borderTop: "1px solid #2d334a42",
    "&:hover": {
      color: "#737990",
    },
  },
});

const Message = ({ rank, message }) => {
  // Declare state
  const classes = useStyles();

  // Check if message contains a GIF
  const checkIfContainsGif = msg => {
    return GIPHY_URLS.filter(url => msg.includes(url)).length > 0;
  };

  const [modalVisible, setModalVisible] = useState(false);

  const openTipUserModal = () => {
    setModalVisible(true);
  }

  // MenuItem onClick event handler
  const onContextClick = (event, action, props) => {
    switch (action) {
      case "mute":
        return chatSocket.emit(
          "send-chat-message",
          `.mute-user ${props.userId}`
        );
      case "ban":
        return chatSocket.emit(
          "send-chat-message",
          `.ban-user ${props.userId}`
        );
      case "remove-message":
        return chatSocket.emit(
          "send-chat-message",
          `.remove-message ${props.msgId}`
        );
      default:
        break;
    }
  };

  const handleLeftClick = e => {
    openTipUserModal();
  };

  return (
    <Fragment>
      <TipModal
        handleClose={() => setModalVisible(!modalVisible)}
        open={modalVisible}
        userId={message.user.id}
      />
      {
        rank >= 3 ? (
          <Fragment>
            <ContextMenu className={classes.contextMenu} id={message.msgId}>
              <p style={{ marginTop: 0, paddingLeft: "1.5rem", color: "#4F79FD" }}>
                CONTROLS:
              </p>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e =>
                  onContextClick(e, "remove-message", {
                    msgId: message.msgId,
                  })
                }
              >
                <i className="fas fa-trash-alt" /> DELETE MESSAGE
              </MenuItem>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e => onContextClick(e, "mute", { userId: message.user.id })}
              >
                <i className="fas fa-microphone-slash Blue" /> MUTE USER
              </MenuItem>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e =>
                  onContextClick(e, "ban", {
                    userId: message.user.id,
                  })
                }
              >
                <i className="fas fa-gavel Red" /> BAN USER
              </MenuItem>
            </ContextMenu>
          </Fragment>
        ) : (
          <Fragment>
          </Fragment>
        )
      }
      <ContextMenuTrigger id={message.msgId}>
        <Box className={classes.chatbox}>
          <Avatar
            variant="rounded"
            src={message.user.avatar}
            className={classes.avatar}
          />
          <div className="message">
            {message.user.rank === 5 ? (
              <Box>
                <div onClick={handleLeftClick} className="username">
                <span className="admin">ADMIN</span>
                {message.user.username}</div>
              </Box>
            ) : (
              <div onClick={handleLeftClick} className="username">
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
      </ContextMenuTrigger>
    </Fragment>
  );
};

export default Message;
