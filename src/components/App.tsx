import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Route, withRouter } from "react-router-dom";
import { iRootState, Dispatch } from "../store";

import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles
} from "@material-ui/core/styles";
import { CssBaseline, Snackbar, useMediaQuery } from "@material-ui/core";

import { Header, Main } from "@components";

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Roboto, sans-serif"
  }
}));

const mapState = (state: iRootState) => ({
  userDarkModeSetting: state.user.isDarkMode
});
const mapDispatch = (dispatch: Dispatch) => ({
  setDarkMode: dispatch.user.setDarkMode
});

type AppProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

const App: React.FC<AppProps> = ({ userDarkModeSetting, setDarkMode }) => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userDarkModeSetting ? "dark" : "light"
        }
      }),
    [userDarkModeSetting]
  );

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertDuration, setAlertDuration] = useState<number>(0);

  useEffect(() => {
    const isOnline = window.navigator.onLine;

    // Check if api request to "https://alexsblogapi.herokuapp.com/posts" is cached:
    caches.open("runtime-cache").then(cache =>
      cache.match("https://alexsblogapi.herokuapp.com/posts").then(res => {
        if (typeof res !== "undefined") {
          // Is indeed cached
          if (isOnline) {
            //Alert user posts are cached
            setTimeout(() => {
              setShowAlert(true);
              setAlertMessage("Posts cached for offline use");
              setAlertDuration(2000);
            }, 1500);
          } else {
            // Alert user that they're in offline mode
            setTimeout(() => {
              setShowAlert(true);
              setAlertMessage("You are in offline mode");
              setAlertDuration(2000);
            }, 1500);
          }
        }
      })
    );

    // Check the window.isUpdateAvailable promise that we defined in registerServiceWorker
    // it resolves to true if a new version is available.

    // Two reasons for the delay:
    //  1. To allow the 'posts cached' alert to display first, without interruption;
    //  2. There might be a race condition between this check and service worker registration,
    //     otherwise window.isUpdateAvailable will be undefined
    const timeoutId = setTimeout(() => {
      try {
        window.isUpdateAvailable.then(isAvailable => {
          if (isAvailable) {
            // Alert user new version available
            setShowAlert(true);
            setAlertMessage("New version available, please refresh!");
            setAlertDuration(2000);
          }
        });
      } catch (err) {
        //ignore errors
      }
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // set dark mode by detecting system preference
  useEffect(() => {
    setDarkMode({ setting: prefersDarkMode });
  }, [prefersDarkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <Route component={Header} />
        <Main />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={showAlert}
          autoHideDuration={alertDuration}
          onClose={() => {
            setShowAlert(false);
          }}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{alertMessage}</span>}
        />
      </div>
    </MuiThemeProvider>
  );
};

const connectedApp = connect(mapState, mapDispatch)(App);

export default withRouter(connectedApp);
