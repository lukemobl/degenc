import React from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";

// MUI Components
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

const ColorOption = withStyles(theme => ({
  root: {
    display: "flex",
    marginRight: "1rem",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
    },
  },
}))(Box);

const Checked = withStyles(theme => ({
  root: {
    height: "100%",
    width: "100%",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "#32363c",
    boxShadow:
      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
  },
}))(Box);

const Unchecked = withStyles(theme => ({
  root: {
    opacity: 0.5,
    transition: "1s opacity",
    height: "100%",
    width: "100%",
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "#32363c",
    boxShadow:
      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
  },
}))(Box);

const ColorRadio = withStyles(theme => ({
  root: {
    padding: 0,
    height: "2.25rem",
    width: "3rem",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      width: "2rem",
    },
    marginRight: 5,
    "& span": {
      height: "100%",
    },
    "& .MuiTouchRipple-root": {
      opacity: 0,
    },
  },
}))(Checkbox);

const useStyles = makeStyles(theme => ({
  reverse: {
    display: "flex",
    width: "6rem",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
}));

const Players = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <ColorOption>
      <Box className={classes.reverse}>Players</Box>
      <ColorRadio
        checkedIcon={<Checked>2</Checked>}
        icon={<Unchecked>2</Unchecked>}
        onChange={() => onChange(2)}
        checked={value === 2}
        value={2}
      />
      <ColorRadio
        checkedIcon={<Checked>3</Checked>}
        icon={<Unchecked>3</Unchecked>}
        onChange={() => onChange(3)}
        checked={value === 3}
        value={3}
      />
      <ColorRadio
        checkedIcon={<Checked>4</Checked>}
        icon={<Unchecked>4</Unchecked>}
        onChange={() => onChange(4)}
        checked={value === 4}
        value={4}
      />
    </ColorOption>
  );
};

Players.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Players;
