import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getLastRaceInformation, getRacePosition } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";

// Components
import Countdown from "react-countdown";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";

// import fakeRace from "../libs/fakeRace";

// Custom Styles
const useStyles = makeStyles({
  profile: {
    margin: "5rem 0",
    color: "#e0e0e0",
    "& h1": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".1em",
      margin: 0,
      marginBottom: "1rem",
      "& span": {
        margin: "0 0 0 1rem",
      },
    },
    "& h2": {},
    "& .saveBtn": {
      position: "absolute",
      right: "1rem",
      top: "0.55rem",
      width: "6rem",
      background: "#264d68",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "& .MuiButton-label": {
      },
    },
  },
  userlevel: {
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
  userWrap: {
    // display: "flex",
    display: "none", // MADNESS EDIT
    justifyContent: "space-between",
    alignItems: "center",
    background: "#282c33",
    borderRadius: "0.25rem",
    padding: "2rem",
    height: "12rem",
    marginBottom: "2rem",
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& > div": {
      width: "49%",
      "& > div": {
        width: "100%",
      },
    },
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    "& .earnings": {
      width: "49%",
      background: "#699958a6",
      color: "#7ca253",
      position: "relative",
      "& > button": {
        position: "absolute",
        background: "#264d68",
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: ".05em",
        width: "6rem",
        right: "2rem",
        "& .MuiButton-label": {
        },
      },
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#272b2f",
      height: "7rem",
      padding: "0 2rem",
      borderRadius: "0.25rem",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
      "& svg": {
        marginRight: "0.25rem",
        color: "#2196f3",
      },
      "& h1": {
        margin: 0,
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  tran: {
    background: "#272b2f",
    borderRadius: "6px",
    marginBottom: "30%",
    padding: "2rem",
    paddingTop: "1rem",
    "& th": {
      borderBottom: "none",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      paddingLeft: 0,
    },
    "& .MuiAvatar-root": {
      width: 30,
      height: 30,
      borderRadius: "100%",
    },
    "& td": {
      borderBottom: "3px #272b2f solid",
      background: "#212529",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
    },
  },
  bgInput: {
    "& .MuiOutlinedInput-root": {
      background: "rgba(44, 48, 84, 0.45)",
    },
  },
  noRace: {
    height: "23rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "7rem",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& h3": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
});

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span style={{ margin: "0", }}></span>;
  } else {
    // Render a countdown
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};

const Race = ({ isAuthenticated, isLoading }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [activeRace, setActiveRace] = useState(null);
  const [topWinners, setTopWinners] = useState(null);
  const [personalPosition, setPersonalPosition] = useState(0);
  const [personalProgress, setPersonalProgress] = useState(0);
  const [prizeDistribution, setPrizeDistribution] = useState([]);

  // componentDidMount
  useEffect(() => {
    // Fetch public data from the api
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getLastRaceInformation();

        console.log('response');
        console.log(response);

        // If race is active
        if (response) {
          console.log(`Updatedd`);
          console.log(`Updatedd`);
          console.log(`Updatedd`);
          console.log(`Updatedd`);
          // Update state
          setTopWinners(response.topTen);
          setActiveRace(response.activeRace);
          setPrizeDistribution(response.prizeDistribution);
          setLoading(false);
        } else {
          // Update state
          setActiveRace(null);
          setLoading(false);
        }
      } catch (error) {
        console.log("There was an error while loading race data:", error);
        addToast(
          "There was an error while loading race data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // Fetch public data
    fetchData();
  }, [addToast]);

  // When user is loaded, fetch personal data
  useEffect(() => {
    // Fetch personal data from the api
    const fetchPersonalData = async () => {
      setLoadingPersonal(true);
      try {
        const response = await getRacePosition();

        // If race is active
        if (response.active) {
          // Update state
          setPersonalPosition(response.myPosition);
          setPersonalProgress(response.myProgress);
        }

        // Update state
        setLoadingPersonal(false);
      } catch (error) {
        console.log("There was an error while loading your race data:", error);
        addToast(
          "There was an error while loading your race data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    if (!isLoading && isAuthenticated) fetchPersonalData();
  }, [isAuthenticated, isLoading, addToast]);

  return (
    <div>
      <Box>
        <Container maxWidth="lg">
          <Box className={classes.profile}>
            <Box display="flex">
              <h1>
                {!loading && activeRace && (
                  <span style={{ margin: "0", }}>🏁 LAST RACE HISTORY<Countdown
                    date={new Date(activeRace.endingDate)}
                    renderer={renderer}
                  />
                  </span>
                )}
              </h1>
              <h1 style={{ marginLeft: "auto", color: "#2196f3" }}>
                {loading ? (
                  <Skeleton
                    width={80}
                    height={40}
                    variant="rect"
                    animation="wave"
                  />
                ) : (
                  activeRace &&
                  `$${parseCommasToThousands(activeRace.prize.toFixed(2))}`
                )}
              </h1>
            </Box>
            <Box className={classes.userWrap}>
              {loadingPersonal ? (
                "LOADING YOUR STATISTICS..."
              ) : !isLoading && !isAuthenticated ? (
                "SIGN IN TO ENTER THE RACE!"
              ) : !activeRace ? (
                "NO ACTIVE RACE CURRENTLY"
              ) : personalPosition === -1 ? (
                "ENTER THE RACE AND WIN"
              ) : (
                <span>
                  Your position in the race:{" "}
                  <b>{parseCommasToThousands(personalPosition)}</b>
                  <br />
                  You have wagered{" "}
                  <b>${parseCommasToThousands(personalProgress)}</b> to the
                  race!
                </span>
              )}
            </Box>

            {loading ? (
              <LoadingTable />
            ) : activeRace ? (
              <Fragment>
                <h1>🏅 WINNERS</h1>
                <Box className={classes.tran}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>USER</TableCell>
                        <TableCell>TOTAL WAGERED</TableCell>
                        <TableCell>PRIZE</TableCell>
                        <TableCell>PLACE</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topWinners.map((entry, index) => {
                        return (
                          <TableRow>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar
                                  src={entry._user.avatar}
                                  variant="rounded"
                                />                                
                                <Box ml="1rem">
                                  
                                  {entry._user.username}
                                  <br/>
                                  UID: {entry._user._id}
                                  </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              ${parseCommasToThousands(entry.value.toFixed(2))}
                            </TableCell>
                            <TableCell style={{ color: "#7ca253" }}>
                              $
                              {parseCommasToThousands(
                                (
                                  activeRace.prize *
                                  (prizeDistribution[index] / 100)
                                ).toFixed(2)
                              )}
                            </TableCell>
                            <TableCell>#{index + 1}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Fragment>
            ) : (
              <Box className={classes.noRace}>
                <h3>NO CURRENTLY ACTIVE RACE!</h3>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
};

// Loading table component
const LoadingTable = () => {
  // Declare State
  const classes = useStyles();

  return (
    <Fragment>
      <h1>LAST RACE WINNERS</h1>
      <Box className={classes.tran}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>USER</TableCell>
              <TableCell>TOTAL WAGERED</TableCell>
              <TableCell>PRIZE</TableCell>
              <TableCell>PLACE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array(10)
              .fill()
              .map((element, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Skeleton
                        animation="wave"
                        variant="rect"
                        height={30}
                        width={30}
                      />
                      <Skeleton
                        style={{ marginLeft: "1rem" }}
                        animation="wave"
                        width="100%"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100%" animation="wave" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100%" animation="wave" />
                  </TableCell>
                  <TableCell>
                    <Skeleton width="100%" animation="wave" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </Fragment>
  );
};

Race.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps)(Race);
