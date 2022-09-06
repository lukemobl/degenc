import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserProfileData } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { logout } from "../actions/auth";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import SelfExcludeModal from "../components/modals/SelfExcludeModal";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import Vip from "../components/modals/VIPModal";

// Icons
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import SecurityIcon from "@material-ui/icons/Security";

// Components
import AccountVerificationModal from "../components/modals/AccountVerificationModal";

import { chatSocket } from "../services/websocket.service";

// Custom styles
const useStyles = makeStyles(theme => ({
  profile: {
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
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    borderRadius: "0.25rem",
    padding: "2rem",
  },
  user: {
    display: "flex",
    flexDirection: "column",
    "& > h1": {
      margin: 0,
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& > h5": {
      margin: 0,
      textTransform: "uppercase",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  pfp: {
    height: "70px",
    width: "70px",
    borderRadius: "100%",
    boxShadow: "2px 2px 10px 1px #1b1c1c",
  },
  logoutt: {
    textAlign: "center",
  },
  bet: {
    minWidth: "fit-content",
    textAlign: "center",
    backgroundColor: "#f44336",
    borderColor: "#f44336",
    boxShadow: "0 1.5px #191e24",
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#f44336",
    },
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
      boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
      width: "19%",
      height: "7rem",
      padding: "0 2rem",
      borderRadius: "0.25rem",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "13px",
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
    maxHeight: "23rem",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    "& th": {
      borderBottom: "none",
      color: "#4caf50",
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
      fontSize: "13px",
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
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  notVerified: {
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontSize: "14px",
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
    fontSize: "13px",
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
    fontFamily: "Rubik",
  },
  nonenav: {
    color: "#d5d6d8",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  bronzenav: {
    color: "#C27C0E",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  silvernav: {
    color: "#95A5A6",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  goldnav: {
    color: "#b99309",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  diamondnav: {
    color: "#3498DB",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  progressbox: {
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      background: "#212529",
      "& > input": {
        color: "#cccc",
        fontFamily: "Rubik",
        marginRight: "100px",
        fontSize: "14px",
      },
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#ff9800",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#ff9800",
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: "#1b1c1c",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#1b1c1c",
        },
        "&:hover fieldset": {
          borderColor: "#1b1c1c",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#1b1c1c",
        },
      },
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#264d68",
      color: "#e4e4e4",
      "&:hover": {
        background: "#264d68",
      },
      "& .MuiButton-label": {
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
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

const Profile = ({ isLoading, isAuthenticated, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const [openSelfexcludeModal, setOpenSelfexcludeModal] = useState(false);
  const [displayname, setDisplayname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [openVip, setOpenVip] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const open = Boolean(anchorEl);

  // Get profile data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserProfileData();

      // Update state
      setProfile(data);
      setDisplayname(user.username);
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
    )} ${d.getDate()}, ${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  // Parse numeric status to readable format
  const parseState = state => {
    switch (state) {
      default:
      case 1:
        return "PENDING";
      case 2:
        return "DECLINED";
      case 3:
        return "COMPLETED";
      case 4:
        return "MANUAL CONFIRMATION NEEDED";
    }
  };

  // Open verification modal
  const onClick = () => {
    setModalVisible(state => !state);
  };

  // Set display name through chat socket
  const changeDisplayname = () => {
    chatSocket.emit("set-displayname", displayname);
  }

  // Input onChange event handler
  const onChangeDisplayname = e => {
    setDisplayname(e.target.value);
  };

  // componentDidMount
  useEffect(() => {
    if (!isLoading && isAuthenticated) fetchData();
  }, [isLoading, isAuthenticated]);

  // If user is not logged in
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/" />;
  }

  return isLoading || !user ? (
    <div className={classes.loader}>
      <ColorCircularProgress />
    </div>
  ) : (
    <div>
      <AccountVerificationModal
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
      <Box>
        <Container maxWidth="lg">
          <Box className={classes.profile}>
            {!loading && !profile.hasVerifiedAccount && (
              <Box className={classes.notVerified}>
                <div>
                  <SecurityIcon />
                  <p>
                    We need additional information to verify your account. After
                    verification you can claim your free $0.5!
                  </p>
                </div>
                <Button
                  className={classes.verifyBtn}
                  size="medium"
                  color="primary"
                  variant="contained"
                  onClick={onClick}
                >
                  <span className={classes.reverse}>VERIFY NOW</span>
                </Button>
              </Box>
            )}
            <h1>🔎 PROFILE</h1>
            <Box className={classes.userWrap}>
              <Box className={classes.user}>
              <Avatar
                className={classes.pfp}
                src={user.avatar}
                variant="rounded"
              />
              <h5 style={{ textTransform: "none", color: "#ff9800", marginTop: "23px", marginBottom: "2px", marginLeft: "2px", }}>USERNAME:</h5>
                <Box position="relative" className={classes.progressbox} style={{ marginBottom: "20px", }}>
                <TextField
                  name="name"
                  className="input"
                  variant="outlined"
                  inputProps={{ maxLength: 16 }}
                  placeholder="#USERNAME"
                  onChange={onChangeDisplayname}
                  value={displayname}
                />
                <Button 
                onClick={changeDisplayname}
                className={classes.buttontest}
                variant="contained"
                style={{ fontFamily: "Rubik", background: "#009688", }}
                >CHANGE</Button>
                </Box>
                <h5 style={{ textTransform: "none", color: "#5a5a5a", }}>UID: <span style={{ color:"#4CAF50", }}>{user._id}</span></h5>
                <h5>Registered {parseDate(user.created)}</h5>
                <br/>
              <Box>
                <Button 
                 className={classes.buttontest}
                 variant="contained"
                 style={{ fontFamily: "Rubik", background: "#f44336", }}
                 onClick={() => setOpenSelfexcludeModal(!openSelfexcludeModal)}>Self-exclude</Button>
                <SelfExcludeModal handleClose={() => setOpenSelfexcludeModal(!openSelfexcludeModal)} open={openSelfexcludeModal} />
              </Box>
              </Box>
            </Box>
            <Grid className={classes.grid} container>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> LEVEL
                </Box>
                <h1>
                <span
                 open={open}
                 style={{ cursor: "pointer", }}
                 onClick={() => setOpenVip(!openVip)}
                 onClose={() => setAnchorEl(null)}
                >
                  {user.wager < 500 ? <span className="nonenav"> 🛡️ GAMBLER</span>
                    : (user.wager >= 26000 ? <span className="diamondnav"> 💎 DIAMOND</span>
                    : (user.wager >= 9000 ? <span className="goldnav"> 🥇 GOLD</span>
                    : (user.wager >= 2100 ? <span className="silvernav"> 🥈 SILVER</span>
                    : <span className="bronzenav"> 🥉 BRONZE</span>
                  )))}
                  </span>
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> PROFIT
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(cutDecimalPoints(((profile.totalDeposited-profile.totalWithdrawn-user.wallet)*(-1)).toFixed(7)))}`
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> TOTAL DEPOSITED
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(profile.totalDeposited)}`
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> TOTAL WITHDRAWN
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(profile.totalWithdrawn)}`
                  )}
                </h1>
              </Box>
              <Box>
                <Box display="flex" alignItems="center">
                  <VideogameAssetIcon /> WAGERED
                </Box>
                <h1>
                  {loading ? (
                    <Skeleton animation="wave" height={40} width={150} />
                  ) : (
                    `$${parseCommasToThousands(profile.wager)}`
                  )}
                </h1>
              </Box>
            </Grid>
            <h1>💲 TRANSACTIONS</h1>
            <Box className={classes.tran}>
              {loading ? (
                <LoadingTable />
              ) : profile.transactions.length >= 1 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>AMOUNT IN $</TableCell>
                      <TableCell>REASON</TableCell>
                      <TableCell>EXTRA</TableCell>
                      <TableCell>TIME</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile.transactions.map(transaction => (
                      <TableRow key={transaction._id}>
                        <TableCell>{transaction._id}</TableCell>                       
                        <TableCell>${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell>NO EXTRA DATA</TableCell>
                        <TableCell>{parseDate(transaction.created)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className={classes.noTransactions}>NO TRANSACTIONS</div>
              )}
            </Box>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className={classes.logoutt} style={{ marginBottom: "180px", }}>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-in-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-sign-in-alt fa-w-16 fa-9x" style={{ width: "20px", marginRight: "10px", marginTop: "10px", }}><path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z" class=""></path></svg>             
            <Button
            style={{ marginTop: "-15px", }}
                    className={classes.bet}
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={() => logout()}
                  >
                    <span className={classes.reverse}>LOGOUT</span>
          </Button>
            </div>
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
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Amount</TableCell>
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

Profile.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
  logout: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { logout })(Profile);
