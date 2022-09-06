import React from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../services/api.service";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";

// Custom Styles
const useStyles = makeStyles({
  modal: {
    "& div > div": {
      background: "#212529",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
  captcha: {
    padding: "0 2rem",
  },
  loader: {
    width: "304px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  titlerubik: {
    fontFamily: "Rubik",
  },
});

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

const Help = ({ open, handleClose, onChange, loading }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      open={open}
      style={{ fontFamily: "Rubik", }}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", borderTop: "12px solid #2ee9361a", }}>
      <span style={{ fontFamily: "Rubik", }}><b><span style={{ fontWeight: "500", }}>🌧️</span> Join the Rain</b></span>
      </DialogTitle>
      {loading ? (
        <DialogContent>
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <ReCAPTCHA
          className={classes.captcha}
          onChange={onChange}
          sitekey={RECAPTCHA_SITE_KEY}
        />
      )}
      <DialogActions>
        {!loading && (
          <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
            CLOSE
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Help;
