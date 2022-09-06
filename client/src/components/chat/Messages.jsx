import React, { Fragment, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
// import ScrollToBottom from "react-scroll-to-bottom";
import PropTypes from "prop-types";

// Components
import Message from "./Message";
import ModeratedMessage from "./ModeratedMessage";
import SkeletonMessage from "./SkeletonMessage";

const useStyles = makeStyles({
  root: {
    flex: "1 1",
    flexDirection: "column",
    overflowX: "hidden",
    position: "relative",
    maskImage: "linear-gradient(0deg,rgba(0,0,0,1) 83%,rgba(0,0,0,0))",
    "& div": {
    },
  },
  box: {
    background: "#848dad0a",
  },
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
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
  },
});

const Messages = ({ chatMessages, loading, user }) => {
  // Declare State
  const classes = useStyles();
  const emptyDiv = useRef(null);

  // Scroll chat using ref
  const scrollChat = () => {
    // Call method on that element
    if (emptyDiv && emptyDiv.current)
      emptyDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  // When chat messages change
  useEffect(() => {
    scrollChat();
  }, [chatMessages]);

  // When messages load the first time
  useEffect(() => {
    // Set timeout for animation
    const timeout = setTimeout(() => {
      // If messages are loaded
      if (chatMessages) scrollChat();
    }, 500);

    // Clear function
    return () => {
      // Save memory and remove timeout
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [loading]);

  return (
    // <ScrollToBottom className={classes.root}>
    //   {loading
    //     ? Array(15)
    //         .fill()
    //         .map((element, index) => <SkeletonMessage key={index} />)
    //     : chatMessages.map(message =>
    //         user && user.rank >= 3 ? (
    //           <Fragment>
    //             <ModeratedMessage message={message} key={message.msgId} />
    //           </Fragment>
    //         ) : (
    //           <Message message={message} key={message.msgId} />
    //         )
    //       )}
    // </ScrollToBottom>
    <div className={classes.root}>
      <div>
        {loading
          ? Array(15)
            .fill()
            .map((element, index) => <SkeletonMessage key={index} />)
          : chatMessages.map(message =>
            <Fragment>
              <ModeratedMessage rank={user && user.rank ? user.rank : null} message={message} key={message.msgId} />
            </Fragment>
          )}
      </div>
      <div style={{ float: "left", clear: "both" }} ref={emptyDiv} />
    </div>
  );
};

Messages.propTypes = {
  chatMessages: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Messages);
