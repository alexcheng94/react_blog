import React, { Component, Fragment } from "react";
import {
  Field,
  reduxForm,
  InjectedFormProps,
  FormErrors,
  WrappedFieldProps
} from "redux-form";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { iRootState, Dispatch } from "../store";
import { InPostData } from "PostTypes";

import { withStyles, createStyles, WithStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { ErrorAlert, CustomDialog } from "@components";

const styles = createStyles({
  formNew: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  button: {
    marginTop: 20,
    marginRight: 20
  }
});

const mapState = (state: iRootState) => ({
  isPending: state.isPending,
  error: state.error
});

const mapDispatch = (dispatch: Dispatch) => ({
  createPost: dispatch.posts.createPost
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  WithStyles<typeof styles> &
  InjectedFormProps<InPostData> &
  RouteComponentProps;

type State = {
  showCustomDialog: boolean;
  showAlert: boolean;
  clickedConfirm: boolean;
};

class PostNew extends Component<Props, State> {
  state = {
    showCustomDialog: false,
    showAlert: false,
    clickedConfirm: false
  };

  showAlert() {
    this.setState({ showAlert: true });
  }
  hideAlert() {
    this.setState({ showAlert: false });
  }
  handleCustomDialogShow() {
    this.setState({
      showCustomDialog: true
    });
  }
  handleCustomDialogHide() {
    this.setState({
      showCustomDialog: false
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
    if (name === "content") {
      return (
        <TextField
          label={name}
          helperText={touched ? error : ""}
          error={!!(touched && error)}
          multiline
          rows="4"
          rowsMax="900"
          margin="normal"
          type="text"
          variant="outlined"
          fullWidth
          {...field.input}
        />
      );
    }
    return (
      <TextField
        label={name}
        helperText={touched ? error : ""}
        error={!!(touched && error)}
        margin="normal"
        type="text"
        variant="outlined"
        fullWidth
        {...field.input}
      />
    );
  }

  onComponentSubmit(values: InPostData) {
    const createCallback = () => {
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    };
    this.props.createPost({ values, callback: createCallback });
  }

  render() {
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit, error, classes } = this.props;
    const { showAlert, showCustomDialog, clickedConfirm } = this.state;

    return (
      <Fragment>
        {error && error.status ? <ErrorAlert type="postNew" /> : null}

        <Typography variant="h4" gutterBottom align="center">
          Write Your Story
        </Typography>

        <form
          id="create-form"
          className={classes.formNew}
          onSubmit={handleSubmit(this.onComponentSubmit.bind(this))}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
        >
          <Field name="title" component={this.renderField} />
          <Field name="content" component={this.renderField} />
          {/* <MyEditor /> */}
          <Button
            className={classes.button}
            onClick={this.handleCustomDialogShow.bind(this)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            component={Link}
            to="/"
          >
            Back
          </Button>
        </form>

        <CustomDialog
          dialogTitle="Create Story?"
          open={showCustomDialog}
          handleClose={this.handleCustomDialogHide.bind(this)}
          isDisabled={clickedConfirm}
          formId="create-form"
          type="submit"
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={showAlert}
          autoHideDuration={4000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Create new post successfull!</span>}
        />
      </Fragment>
    );
  }
}

// The 'validate' function will be called automaticalli by Redux Form
// whenever a user attempts to submit the form
function validate(values: InPostData): FormErrors<InPostData> {
  const errors: FormErrors<InPostData> = {};
  // Validate the inputs from 'values'
  if (!values.title) {
    errors.title = "Please enter a title";
  }
  if (!values.content) {
    errors.content = "Please enter some content";
  }
  //if the "errors" object is empty, the form is valid and ok to submit
  return errors;
}

export default compose<typeof PostNew>(
  connect(mapState, mapDispatch),
  reduxForm({
    validate,
    //value of "form" must be unique
    form: "PostsNewForm"
  }),
  withStyles(styles, {
    name: "PostNew"
  })
)(PostNew);
