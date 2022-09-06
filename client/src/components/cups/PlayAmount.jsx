
import React, { useState, useEffect } from "react";
import { getActiveCupsGames } from "../../services/api.service";
import { cupsSocket } from "../../services/websocket.service";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch cups schema from API
  const fetchData = async () => {
    try {
      const schema = await getActiveCupsGames();

      // Update state
      setPlayAmount(schema.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading cups schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    cupsSocket.on("new-cups-game", fetchData);
    cupsSocket.on("game-joined", fetchData);
    cupsSocket.on("game-called-bot", fetchData);
    cupsSocket.on("game-rolled", fetchData);
    cupsSocket.on("game-rolling", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      cupsSocket.off("new-cups-game", fetchData);
      cupsSocket.off("game-joined", fetchData);
      cupsSocket.off("game-called-bot", fetchData);
      cupsSocket.off("game-rolled", fetchData);
      cupsSocket.off("game-rolling", fetchData);
    };
  });

  return (
    <div style={{color: "#2c80af", marginTop: "-3px", fontSize: "12px", }}>
      ${parseFloat(playAmount).toFixed(2)}
    </div>
  );
};
