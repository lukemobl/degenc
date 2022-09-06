import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserHistory } from "../services/api.service";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";

// Icons
import CasinoIcon from "@material-ui/icons/Casino";

// Components
import CupsFair from "../components/modals/cups/ProvablyModal";
import ShuffleFair from "../components/modals/shuffle/ProvablyModal";
import KingFair from "../components/modals/king/ProvablyModal";
import RouletteFair from "../components/modals/roulette/ProvablyModal";
import CrashFair from "../components/modals/crash/ProvablyModal";

// Custom styles
const useStyles = makeStyles(theme => ({
  history: {
    margin: "5rem 0",
    color: "#e0e0e0",
    [theme.breakpoints.down("sm")]: {
      margin: "2rem 0",
    },
    "& > h1": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".1em",
      margin: 0,
      marginBottom: "1rem",
    },
  },
  userWrap: {
    display: "flex",
    background: "#282c33",
    borderRadius: "0.25rem",
    padding: "2rem",
    height: "8rem",
  },
  user: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "1rem",
    "& > h1": {
      margin: 0,
    },
    "& > h5": {
      margin: 0,
      textTransform: "uppercase",
      color: "#e0e0e0",
    },
  },
  pfp: {
    height: "100%",
    width: "4rem",
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      flexDirection: "column",
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#272b2f",
      width: "19%",
      height: "7rem",
      padding: "0 2rem",
      borderRadius: "0.25rem",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        marginBottom: 10,
      },
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
    padding: "2rem",
    paddingTop: "1rem",
    maxHeight: "55rem",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
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
    "& td": {
      borderBottom: "3px #272b2f solid",
      background: "#212529",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
      paddingLeft: 0,
      // textShadow: "0px 0px 20px",
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
      "&:nth-child(n+1):nth-child(-n+3)": {
        color: "#9d9d9d",
        fontFamily: "Rubik",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  notVerified: {
    background: "#282c33",
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".05em",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    "& > div": {
      margin: "0 auto 0 0",
      display: "flex",
      alignItems: "center",
    },
    "& svg": {
      marginRight: "1rem",
      color: "#2196f3",
    },
  },
  verifyBtn: {
    backgroundColor: "#273a4f",
    borderColor: "#273a4f",
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0.3rem 2rem",
    textTransform: "capitalize",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "#273a4f",
    },
  },
  reverse: {
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "36rem",
  },
  noTransactions: {
    width: "100%",
    textAlign: "center",
    padding: "2rem 0 1rem 0",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  verifybutton: {
    color: "#5f6368",
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const History = ({ isLoading, isAuthenticated, user }) => {
  // Declare State
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);

  // Get profile data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserHistory();

      // Update state
      setHistory(data);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while loading user profile data:", error);
    }
  };

  // Get verbal month from js month index
  const getMonthFromIndex = index => {
    switch (index) {
      default:
      case 0:
        return "JAN";
      case 1:
        return "FEB";
      case 2:
        return "MAR";
      case 3:
        return "APR";
      case 4:
        return "MAY";
      case 5:
        return "JUN";
      case 6:
        return "JUL";
      case 7:
        return "AUG";
      case 8:
        return "SEP";
      case 9:
        return "OCT";
      case 10:
        return "NOV";
      case 11:
        return "DEC";
    }
  };

  // Parse unix timestamp to readable format
  const parseDate = timestamp => {
    const d = new Date(timestamp);
    return `${getMonthFromIndex(
      d.getMonth()
    )} ${d.getDate()}, ${d.getFullYear()}`;
  };

  // componentDidMount
  useEffect(() => {
    if (!isLoading && isAuthenticated) fetchData();
  }, [isLoading, isAuthenticated]);

  // If user is not logged in
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/History_Error" />;
  }

  return isLoading || !user ? (
    <div className={classes.loader}>
      <ColorCircularProgress />
    </div>
  ) : (
    <div>
      <Box>
        <Container maxWidth="lg">
          <Box className={classes.history}>
            <h1>💲 YOUR SHUFFLE HISTORY</h1>
            <Box className={classes.tran}>
              {loading ? (
                <LoadingTable />
              ) : history.length > 1 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>EXTRA DATA</TableCell>
                      <TableCell>Fair</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map(game => (
                      <TableRow key={game._id}>
                        <TableCell>{game._id}</TableCell>
                        <TableCell>{parseDate(game.created)}</TableCell>
                        <TableCell>
                          <span>
                            NO EXTRA DATA
                          </span>
                        </TableCell>
                        <TableCell>
                          <ProvablyData game={game} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className={classes.noTransactions}>NO SHUFFLE GAMES PLAYED!</div>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

const LoadingTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Fair</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array(3)
          .fill()
          .map((element, index) => (
            <TableLoader key={index} />
          ))}
      </TableBody>
    </Table>
  );
};

const TableLoader = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={25} width={250} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={100} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
    </TableRow>
  );
};

const ProvablyData = ({ game }) => {
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);

  return (
    <Fragment>
      {game.gamemode === "cups" ? (
        <CupsFair
          game={game}
          open={provablyModalVisible}
          handleClose={() => setProvablyModalVisible(state => !state)}
        />
      ) : game.gamemode === "shuffle" ? (
        <ShuffleFair
          game={game}
          open={provablyModalVisible}
          handleClose={() => setProvablyModalVisible(state => !state)}
        />
      ) : game.gamemode === "crash" ? (
        <CrashFair
          game={game}
          open={provablyModalVisible}
          handleClose={() => setProvablyModalVisible(state => !state)}
        />
      ) : (
        game.gamemode === "roulette" && (
          <RouletteFair
            game={game}
            open={provablyModalVisible}
            handleClose={() => setProvablyModalVisible(state => !state)}
          />
        )
      )}
      <IconButton
        onClick={() => setProvablyModalVisible(state => !state)}
      >
        <CasinoIcon style={{ color: "#747474" }} />
      </IconButton>
    </Fragment>
  );
};

History.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps)(History);
