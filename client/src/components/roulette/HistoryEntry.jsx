import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

// Components
import ProvablyModal from "../modals/roulette/ProvablyModal";

// Custom Styled Component
const His = withStyles({
  root: {
    cursor: "pointer",
    marginRight: 10,
    background: props => props.bg,
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    width: "0.5rem",
    fontWeight: 500,
    letterSpacing: ".05em",
    height: props => props.height,
    boxShadow: props => props.glow,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
})(Box);

const HistoryEntry = ({ game }) => {
  // Declare State
  const [modalVisible, setModalVisible] = useState(false);

  // Button onClick event handler
  const onClick = () => {
    setModalVisible(state => !state);
  };

  return (
    <Fragment>
      <ProvablyModal
        game={game}
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <div onClick={onClick}>
        <Tooltip title="Click to view Provably Fair" placement="bottom">
          {game.winner === "blue" ? (
            <His height="1rem" width="0.5rem" bg="#458DBF" />
          ) : game.winner === "green" ? (
            <His height="1.25rem" width="0.5rem" bg="#2ebd50" />
          ) : game.winner === "purple" ? (
            <His height="1.55rem" width="0.5rem" bg="#b157ce" />
          ) : game.winner === "yellow" ? (
            <His height="2.1rem" width="0.5rem" bg="#fdd429" />
          ) : game.winner === "7x" ? (
            <His height="2rem" width="0.5rem" bg="#b2b2b2" glow="0px 0px 10px #b2b2b2" />
          ) : game.winner === "mystery" ? (
            <His height="2rem" width="0.5rem" bg="#bea56e" glow="0px 0px 10px #bea56e" />
          ) : (
            <span>INVALID</span>
          )}
        </Tooltip>
      </div>
    </Fragment>
  );
};

HistoryEntry.propTypes = {
  game: PropTypes.object.isRequired,
};

export default HistoryEntry;
