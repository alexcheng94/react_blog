import React, { Component, Fragment } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";

import { withStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import ErrorAlert from "../containers/ErrorAlert";
import { userLogin } from "../actions/user";

const styles = {
  wrapper: {
    maxWidth: 300,
    margin: "0px auto"
  },
  button: {
    display: "block",
    margin: "30px auto"
  }
}

class Login extends Component {
  state = {
    open: false
  };

  showAlert() {
    this.setState({ open: true });
  }
  hideAlert() {
    this.setState({ open: false });
  }
  onComponentSubmit(values) {
    this.props.userLogin(values, () => {
      //Callback to execute when the action is resolved
      this.showAlert();
      setTimeout(() => this.props.history.push("/"), 1000);
    });
  }

  //For Redux Form's Field Component
  renderField(field) {
    //Set the TextField(from Material-UI)'s erorr prop to true when a field is both 'touched',
    //and has 'error', which is an object returned by the validate() function.
    const {
      input: { name },
      meta: { touched, error }
    } = field;
    const type = name === "password" ? "password" : "text";
    const label = name === "password" ? "Password" : "Username";

    return (
      <TextField
        error={!!(touched && error)}
        label={label}
        type={type}
        helperText={touched ? error : ""}
        margin="normal"
        fullWidth
        {...field.input}
      />
    );
  }

  render() {
    const { handleSubmit, error, classes } = this.props;
    return (
      <Fragment>
        {//the 'error' here refers to the error in the application state(store)
        error && error.status ? <ErrorAlert type="login" /> : null}
        
        <div className={classes.wrapper}>
          <Typography variant="h3" align="center">
            Log in
          </Typography>
          <form
            onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
            //                      ▲ ▲ ▲ ▲ ▲ ▲ ▲
            // this.onComponentSubmit() referes to the method of this component
          >
            <Field name="username" component={this.renderField} />
            <Field name="password" component={this.renderField} />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Log In
            </Button>
          </form>
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Login successful!</span>}
        />
      </Fragment>
    );
  }
}

// The 'validate' function will be called automaticalli by Redux Form
// whenever a user attempts to submit the form
function validate(values) {
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.username) {
    errors.username = "Please enter a username";
  }
  if (!values.password) {
    errors.password = "Please enter a password";
  }
  //if the 'errors' object is empty, the form is valid and ok to submit
  return errors;
}

const mapStateToProps = state => ({ error: state.error });

export default compose(
  withStyles(styles, {
    name: "Login"
  }),
  reduxForm({
    validate,
    //value of 'form' must be unique
    form: "LoginForm"
  }),
  connect(
    mapStateToProps,
    { userLogin }
  )
)(Login);
