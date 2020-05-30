import React, { Component, Fragment } from "react";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  FormErrors,
  WrappedFieldProps
} from "redux-form";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { iRootState, Dispatch } from "../store";

import { withStyles, createStyles, WithStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { ErrorAlert } from "@components";

const styles = createStyles({
  wrapper: {
    maxWidth: 300,
    margin: "0px auto"
  },
  button: {
    display: "block",
    margin: "30px auto"
  },
  KAGGIGER: {
    color: "red"
  }
});

type SignupData = {
  username: string;
  password: string;
  ["confirm password"]: string;
};

const mapState = (state: iRootState) => ({ error: state.error });

const mapDispatch = (dispatch: Dispatch) => ({
  userSignup: dispatch.user.userSignup
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  WithStyles<typeof styles> &
  InjectedFormProps<SignupData> &
  RouteComponentProps;

type State = { open: boolean };

class Signup extends Component<Props, State> {
  state = {
    open: false
  };

  showAlert() {
    this.setState({ open: true });
  }
  hideAlert() {
    this.setState({ open: false });
  }

  onComponentSubmit(values: SignupData) {
    const signupCallback = () => {
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/user/login");
      }, 1000);
    };
    this.props.userSignup({
      signupData: values,
      callback: signupCallback
    });
  }
  //For Redux Form's Field Component
  renderField(field: WrappedFieldProps) {
    //Set the TextField(from Material-UI)'s erorr prop to true when a field is both 'touched',
    //and has 'error', which is an object returned by the validate() function.
    const {
      input: { name },
      meta: { touched, error }
    } = field;
    const type = name === "username" ? "text" : "password";
    const label = name === "username" ? "Username" : "Password";

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
        {
          //the "error" here refers to the error in the application state(store)
          error && error.status ? <ErrorAlert type="signup" /> : null
        }
        <div className={classes.wrapper}>
          <Typography variant="h3" align="center">
            Sign up
          </Typography>
          <form
            onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
            //                      ▲ ▲ ▲ ▲ ▲ ▲ ▲
            // this.onComponentSubmit() referes to the method of this component
          >
            <Field name="username" component={this.renderField} />
            <Field name="password" component={this.renderField} />
            <Field name="confirm password" component={this.renderField} />

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign Up
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
          message={<span id="message-id">Sign up successful!</span>}
        />
      </Fragment>
    );
  }
}

// The 'validate' function will be called automaticalli by Redux Form
// whenever a user attempts to submit the form
function validate(values: SignupData): FormErrors<SignupData> {
  const errors: FormErrors<SignupData> = {};
  // Validate the inputs from 'values'
  if (!values.username) {
    errors.username = "Please enter a username";
  }
  if (!values.password) {
    errors.password = "Please enter a password";
  }
  if (!values["confirm password"]) {
    errors["confirm password"] = "Please confirm your password";
  }
  if (values.password !== values["confirm password"]) {
    errors["confirm password"] = "Passwords doesn't match";
  }
  //if the "errors" object is empty, the form is valid and ok to submit
  return errors;
}

export default compose<typeof Signup>(
  connect(mapState, mapDispatch),
  withStyles(styles, {
    name: "Signup"
  }),
  reduxForm({
    validate,
    //value of 'form' must be unique
    form: "SignUpForm"
  })
)(Signup);
