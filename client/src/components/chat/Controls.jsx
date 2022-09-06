import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// Components
//import ChatRulesModal from "../modals/ChatRulesModal";

// Icons
import GifIcon from "@material-ui/icons/Gif";

// Components
import Rain from "./Rain";
import Trivia from "./Trivia";

// Custom styles
const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    background: "#212529",
    // background: "#11131f",
    paddingBottom: "1rem",
  },
  icon: {
    color: "#343a5b",
    marginLeft: "auto",
    fontSize: 15,
  },
  online: {
    display: "flex",
    alignItems: "center",
    marginLeft: "1rem",
    color: "#4b4f51",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& span": {
      marginRight: 5,
      color: "#234224",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& p": {
      marginRight: 3,
    },
  },
  giphy: {
    background: "#3c4046",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    width: "285px",
    zIndex: 100,
    fontFamily: "Rubik",
    fontWeight: "500",
    bottom: "4rem",
    left: "10rem",
    opacity: 1,
    pointerEvents: "all",
    transition: "opacity 0.25s ease",
    "& input": {
      background: "#272b2f",
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontFamily: "Rubik",
      fontWeight: "500",
      paddingLeft: 10,
      "&::placeholder": {
        fontFamily: "Rubik",
        fontWeight: "500",
        color: "#9d9d9d6b",
      },
    },
  },
  removed: {
    background: "#2f3653",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    zIndex: 100,
    bottom: "4rem",
    left: "10rem",
    "& input": {
      background: "#1e2225",
      border: "none",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      paddingLeft: 10,
      "&::placeholder": {
        color: "#9d9d9d6b",
        fontFamily: "Rubik",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
    },
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.25s ease",
  },
}));

// Custom styled component
const ChatInput = withStyles(theme => ({
  root: {
    width: "100%",
    padding: "1rem",
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#4b4f51",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: 18,
      paddingLeft: 20,
    },
    "& div input": {
      color: "#4b4f51",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& div": {
      background: "#1e2225",
      border: "1px solid hsla(0,0%,100%,.12)",
      borderRadius: "4px",
    },
  },
}))(TextField);

// Custom styled component
const Send = withStyles({
  root: {
    backgroundColor: "#273a4f",
    borderColor: "#273a4f",
    color: "#e4e4e4",
    margin: "auto",
    marginRight: "1rem",
    marginLeft: "-1px",
    borderRadius: "100px",
    fontFamily: "Rubik",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "&:hover": {
      background: "#273a4f",
    },
  },
})(Button);

// Custom styled component
const Emoji = withStyles({
  root: {
    color: "white",
    opacity: 0.25,
  },
})(GifIcon);

const Controls = ({ usersOnline, rain, trivia }) => {
  // Declare state
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const gifFunc = (data, open) => {
    // console.log(inputState);
    setOpen(open);
    setInput(data);
  };

  // TextField onKeyPress event handler
  const onKeyPress = e => {
    // If enter was pressed
    if (e.key === "Enter") {
      chatSocket.emit("send-chat-message", input);
      setInput("");
      return false;
    }
  };

  // Input onChange event handler
  const onChange = e => {
    setInput(e.target.value);
  };

  // Button onClick event handler
  const onClick = () => {
    chatSocket.emit("send-chat-message", input);
    setInput("");
  };

  // TextInput onFocus event handler
  //const onFocus = () => {
  //  const agreed = Boolean(window.localStorage.getItem("chat-rules-agreed"));

    // If user hasn't agreed the rules on this device
    //if (!agreed) {
    //  setModalVisible(state => !state);
    //  window.localStorage.setItem("chat-rules-agreed", "true");
    //}
  //};
//comes after reactgiphysearchbox
  //      <ChatRulesModal
  //open={modalVisible}
  //handleClose={() => setModalVisible(state => !state)}
///>

//chatinput ->           onFocus={}

  return (
    <div>
      {rain && rain.active && <Rain rain={rain} />}
      {trivia && trivia.active && <Trivia trivia={trivia} />}
      <ReactGiphySearchbox
        apiKey="1nPE3oK3S7byekhnHoLrwGEeqxB0R98B" // Required: get your on https://developers.giphy.com
        onSelect={item => gifFunc(item.images.downsized.url, !open)}
        wrapperClassName={open ? classes.giphy : classes.removed}
        poweredByGiphy={false}
        searchPlaceholder={"Search.."}
      />

      <Box className={classes.input}>
        <ChatInput
          label="#MESSAGE"
          variant="filled"
          onChange={onChange}
          onKeyPress={onKeyPress}
          value={input}
        />
        <Box display="flex">
          <Box className={classes.online}>
            <span>●</span>
            <p style={{ color: "#676a63", }}>{usersOnline}</p>
            ONLINE
          </Box>
          <IconButton
            onClick={() => setOpen(!open)}
            color="primary"
            style={{ marginLeft: "auto" }}
          >
            <Emoji />
          </IconButton>
          <Send onClick={onClick} variant="contained">
            SEND
          </Send>
        </Box>
      </Box>
    </div>
  );
};

export default Controls;

          //kommt zwischen box und send
          // <IconButton
          //   onClick={() => setOpen(!open)}
          //  color="primary"
          //  style={{ marginLeft: "auto" }}
          //>
          //  <Emoji />
          // </IconButton>
