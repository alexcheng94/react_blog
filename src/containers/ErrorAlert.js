import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import { clearError } from "../actions/clearError";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
const customMessage = {
  login: "Password Incorrect or user doesn't exist",
  signup: "User already exists",
  postNew: "Login expired, please log in again",
  postUpdate: "Unauthorized or Login expired, please log in again",
  postDetail: "Unauthorized or Login expired, please log in again"
};
class ErrorAlert extends React.Component {
  render() {
    const { type, status, statusText, message, clearError } = this.props;
    return (
      <div>
        <Dialog
          open={!!status}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Oops, Something went wrong...</DialogTitle>
          <DialogContent>
            {//Only use custom messages when status is 401 or 409, otherwise show status & messages sent from server.
            status === 401 || status === 409 ? (
              <DialogContentText>{customMessage[type]}</DialogContentText>
            ) : (
              <Fragment>
                <DialogContentText>
                  {status + " " + statusText}
                </DialogContentText>
                <DialogContentText>{message}</DialogContentText>
              </Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button component={Link} to="/" color="secondary">
              Home
            </Button>
            <Button
              onClick={() => {
                //Call clearError() action
                clearError();
              }}
              color="primary"
            >
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.error.status,
  statusText: state.error.statusText,
  message: state.error.message
});

export default connect(
  mapStateToProps,
  { clearError }
)(ErrorAlert);
