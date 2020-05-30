import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import { iRootState, Dispatch } from "../store";

import { withStyles, createStyles, WithStyles, Theme } from "@material-ui/core";
import {
  Snackbar,
  Typography,
  Divider,
  Tooltip,
  Button
} from "@material-ui/core";

import {
  DisqusComment,
  CustomDialog,
  ErrorAlert,
  NewPostButton
} from "@components";

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      maxWidth: 1000,
      margin: "0px auto"
    },
    content: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      fontSize: 18,
      whiteSpace: "pre-wrap",
      lineHeight: 1.58,
      letterSpacing: -"0.003em"
    },
    author: {
      "&:visited": {
        color: "blue"
      }
    },
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
      fontWeight: "bold"
    }
  });

type TParams = { _id: string };
type OwnProps = RouteComponentProps<TParams>;

const mapState = (state: iRootState, ownProps: OwnProps) => ({
  post: state.posts[ownProps.match.params._id],
  user: state.user,
  error: state.error
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchPost: dispatch.posts.fetchPost,
  fetchPosts: dispatch.posts.fetchPosts,
  deletePost: dispatch.posts.deletePost
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  RouteComponentProps<TParams> &
  WithStyles<typeof styles>;

type State = {
  showCustomDialog: boolean;
  showAlert: boolean;
  clickedConfirm: boolean;
};

class PostDetails extends Component<Props, State> {
  state = {
    showCustomDialog: false,
    showAlert: false,
    clickedConfirm: false
  };

  componentDidMount() {
    //Reset to top of the page
    window.scrollTo(0, 0);

    if (window.navigator.onLine) {
      if (!this.props.post) {
        // If a user refreshs a detail page or lands here via url,
        // only fetch the post whose id corresponds to the id in the url
        const { _id } = this.props.match.params;
        this.props.fetchPost({ _id });
      }
    } else {
      //In offline mode, fetch posts from runtime cache
      this.props.fetchPosts();
    }
  }
  componentWillUnmount() {
    //Clear the progress bar on unmount
    // this.props.clearLoader();
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

  handleDelete() {
    const { _id } = this.props.match.params;
    //Disable confirm button once it's clicked
    this.setState({ clickedConfirm: true });
    const deletCallback = () => {
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    };
    this.props.deletePost({ _id, callback: deletCallback });
  }

  render() {
    // Show error page if any
    const { error, classes } = this.props;
    if (!this.props.post) {
      if (error.status) {
        return <ErrorAlert type="postDetail" />;
      }
      return null;
    }

    const { title, author, content, date } = this.props.post;
    const {
      user: { isAuthenticated }
    } = this.props;

    const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");
    const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";

    //Extract post id from url, and compose url for editing page
    const { _id } = this.props.match.params;
    const url = `/posts/edit/${_id}`;

    return (
      <Fragment>
        <div className={classes.wrapper}>
          {error && error.status ? <ErrorAlert type="postDetail" /> : null}

          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2">
            By{" "}
            <Link
              className={classes.author}
              to={`/user/profile/${encodeURIComponent(author)}`}
            >
              {author}
            </Link>
          </Typography>
          <Typography variant="body2" gutterBottom>
            {postTime}
          </Typography>
          <Divider />
          <Typography variant="body1" className={classes.content}>
            {content}
          </Typography>

          {/* Conditionally render 'Edit' and 'Delete' buttons*/}
          {author === this.props.user.username && isAuthenticated ? (
            <Fragment>
              <Button
                className={classes.button}
                onClick={this.handleCustomDialogShow.bind(this)}
                variant="contained"
                color="secondary"
              >
                Delete
              </Button>
              <Button
                className={classes.button}
                component={Link}
                to={url}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </Fragment>
          ) : null}

          {/* Direct user to sign up page or if already signed in, write new page */}
          <Tooltip title="Write a story">
            <NewPostButton destination={writeButtonPath} />
          </Tooltip>

          <CustomDialog
            dialogTitle="Delete this Article?"
            open={this.state.showCustomDialog}
            handleClose={this.handleCustomDialogHide.bind(this)}
            handleConfirm={this.handleDelete.bind(this)}
            isDisabled={this.state.clickedConfirm}
          />

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.showAlert}
            autoHideDuration={3000}
            onClose={this.hideAlert.bind(this)}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">Post deleted</span>}
          />

          {/*Disqus plugin*/}
          <DisqusComment identifier={_id} title={title} />
        </div>
      </Fragment>
    );
  }
}

export default compose<typeof PostDetails>(
  connect(mapState, mapDispatch),
  withStyles(styles, { name: "PostDetails" })
)(PostDetails);
