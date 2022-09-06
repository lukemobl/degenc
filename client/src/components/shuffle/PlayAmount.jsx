
import React, { useState, useEffect } from "react";
import { getShuffleSchema } from "../../services/api.service";
import { shuffleSocket } from "../../services/websocket.service";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch shuffle schema from API
  const fetchData = async () => {
    try {
      const schema = await getShuffleSchema();

      // Update state
      setPlayAmount(schema.current.players.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading shuffle schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    shuffleSocket.on("new-round", fetchData);
    shuffleSocket.on("new-player", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      shuffleSocket.off("new-round", fetchData);
      shuffleSocket.off("new-player", fetchData);
    };
  });

  return (
    <div style={{color: "#2c80af", marginTop: "-3px", fontSize: "12px", }}>
      ${parseFloat(playAmount).toFixed(2)}
    </div>
  );
};
