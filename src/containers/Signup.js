import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Alert from "react-s-alert";

import { userSignup } from "../actions/user";
import ErrorPage from "../components/errorPage";

class Signup extends Component {
  showAlert(message) {
    Alert.info(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000,
      offset: "50px"
    });
  }

  onComponentSubmit(values) {
    this.props.userSignup(values, () => {
      this.showAlert("Sign up successful!");
      setTimeout(()=>{this.props.history.push("/user/login")});
    });
  }
  //Redux Form's renderField() method
  renderField(field) {
    //Provide "invalid" classNames when a field is both 'touched', 
    //and has 'error', which is an object returned by the validate() function.
    const {
      input: { name },
      meta: { touched, error }
    } = field;
    const className = `${touched && error ? "invalid" : ""}`;

    const type = name === "username" ? "text" : "password";
    return (
      <div className="input-field col s6">
        <input className={className} id={name} type={type} {...field.input} />
        <label htmlFor={name}>{name}</label>
        <span className="helper-text red-text">{touched ? error : ""}</span>
      </div>
    );
  }
  render() {
    const { handleSubmit, error } = this.props;
    return (
      <div className="container">
        {
          //the "error" here refers to the error in the application state(store)
          error && error.status ? <ErrorPage type="signup" /> : null}
        <h1>Sign up</h1>
        <form
          className="col s12"
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                      ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
        >
          <div className="row">
            <Field name="username" component={this.renderField} />
          </div>
          <div className="row">
            <Field name="password" component={this.renderField} />
          </div>
          <div className="row">
            <Field name="confirm password" component={this.renderField} />
          </div>
          <input
            type="submit"
            value="Sign Up"
            className="btn waves-effect waves-light from-btn cyan darken-1"
          />
        </form>
      </div>
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
  if (!values["confirm password"]) {
    errors["confirm password"] = "Please confirm your password";
  }
  if (values.password !== values["confirm password"]) {
    errors["confirm password"] = "Passwords doesn't match";
  }
  //if the "errors" object is empty, the form is valid and ok to submit
  return errors;
}

const mapStateToProps = ({ error }) => ({ error });

export default reduxForm({
  mapStateToProps,
  form: "SignUpForm",
  validate
})(
  connect(
    mapStateToProps,
    { userSignup }
  )(Signup)
);
