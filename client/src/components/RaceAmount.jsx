
import React, { useState, useEffect } from "react";
import { getRaceInformation } from "../services/api.service";

export const RaceAmount = () => {
  const [raceAmount, setRaceAmount] = useState(0);

  // Fetch race schema from API
  const fetchData = async () => {
    try {
      const schema = await getRaceInformation();

      if(schema?.activeRace?.prize){
        setRaceAmount(schema.activeRace.prize)
      }else{
        setRaceAmount(0)
      }

      // Update state
      // setRaceAmount(schema);
    } catch (error) {
      console.log("There was an error while loading race schema:", error);
    }
  };

  useEffect(() => {
    const ti = setInterval(fetchData, 10000);

    fetchData();

    // componentDidUnmount
    return () => {
      clearInterval(ti);
    }
  });

  return (
    raceAmount > 0 ?
    (
      <div style={{color: "#4caf50", marginTop: "-3px", fontSize: "12px", }}>
        (${parseFloat(raceAmount).toFixed(2)})
      </div>
    ) : (
      <></>
    )
  );
};
