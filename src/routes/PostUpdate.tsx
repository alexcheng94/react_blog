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
import {
  withStyles,
  createStyles,
  WithStyles,
  Snackbar,
  TextField,
  Button,
  Typography
} from "@material-ui/core";

import { CustomDialog, ErrorAlert, RichTextEditor } from "@components";

const styles = createStyles({
  formEdit: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  button: {
    marginTop: 20,
    marginRight: 20
  }
});

type TParams = {
  _id: string;
};

const mapState = (
  state: iRootState,
  ownProps: RouteComponentProps<TParams>
) => {
  const { posts, error } = state;
  return {
    //Provide initialValues to prepopulate the form
    //See https://redux-form.com/7.4.2/examples/initializefromstate/
    initialValues: posts[ownProps.match.params._id],
    posts: posts[ownProps.match.params._id],
    stateError: error
  };
};

const mapDispatch = (dispatch: Dispatch) => ({
  fetchPost: dispatch.posts.fetchPost,
  updatePost: dispatch.posts.updatePost
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  WithStyles<typeof styles> &
  RouteComponentProps<TParams> &
  InjectedFormProps<InPostData>;

type State = {
  showCustomDialog: boolean;
  showAlert: boolean;
  clickedConfirm: boolean;
};

class PostUpdate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showCustomDialog: false,
      showAlert: false,
      clickedConfirm: false
    };
    this.showAlert = this.showAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.renderField = this.renderField.bind(this);
    this.onComponentSubmit = this.onComponentSubmit.bind(this);
    this.handleCustomDialogShow = this.handleCustomDialogShow.bind(this);
    this.handleCustomDialogHide = this.handleCustomDialogHide.bind(this);
  }

  componentDidMount() {
    //If all posts are already fetched, then don't waste network usage to fetch it again,
    //simply find the post by id in state
    const { _id } = this.props.match.params;
    this.props.fetchPost({ _id });
  }

  render() {
    // handleSubmit is from Redux Form, it handles validation etc.
    const { handleSubmit, stateError, classes } = this.props;
    return (
      <Fragment>
        <form
          id="update-form"
          className={classes.formEdit}
          onSubmit={handleSubmit(this.onComponentSubmit)}
          //                     ▲ ▲ ▲ ▲ ▲ ▲ ▲
          // this.onComponentSubmit() referes to the method of this component
        >
          <Typography variant="h4" gutterBottom align="center">
            Edit Your Story
          </Typography>

          {
            //stateError can not be named "error" here, it will conflict with Redux Form's "error"
            stateError && stateError.status ? (
              <ErrorAlert type="postUpdate" />
            ) : null
          }

          <Field name="title" component={this.renderField} />
          <Field name="content" component={this.renderField} />
          <Button
            className={classes.button}
            onClick={this.handleCustomDialogShow}
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
          dialogTitle="Submit changes?"
          open={this.state.showCustomDialog}
          handleClose={this.handleCustomDialogHide}
          isDisabled={this.state.clickedConfirm}
          formId="update-form"
          type="submit"
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.showAlert}
          autoHideDuration={3000}
          onClose={this.hideAlert}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Update successful!</span>}
        />
      </Fragment>
    );
  }
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
      meta: { touched, error },
      input: { name, value }
    } = field;

    if (name === "content") {
      // Temporary solution, add isRichText prop later
      // content is rich text format
      const isContentJson = isJson(value);

      if (isContentJson) {
        return (
          <RichTextEditor
            readOnly={false}
            rawContent={value}
            onChange={field.input.onChange}
          />
        );
      }
      // content is a plain string
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
    // title field
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
    //Disable confirm button once it's clicked
    this.setState({ clickedConfirm: true });

    const { _id } = this.props.match.params;
    //Map changes into an array that looks like this:
    // [
    //   {
    //     propName: "title",
    //     value: "new title"
    //   },
    //   {
    //     propName: "content",
    //     value: "new content"
    //   }
    // ]
    const requestBody = Object.keys(values)
      .filter(key => key === "title" || key === "content")
      .map(e => ({ propName: e, value: values[e] }));

    const updateCallback = () => {
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    };

    this.props.updatePost({
      _id,
      requestBody,
      callback: updateCallback
    });
  }
}

// The 'validate' function will be called AUTOMATICALLY by Redux Form
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

function isJson(str: string) {
  if (typeof str !== "string") {
    return false;
  }
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}

export default compose<typeof PostUpdate>(
  connect(mapState, mapDispatch),
  withStyles(styles, {
    name: "PostUpdate"
  }),
  reduxForm({
    validate,
    form: "PostEditForm"
  })
)(PostUpdate);
