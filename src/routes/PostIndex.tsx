import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { iRootState, Dispatch } from "../store";

import {
  withStyles,
  createStyles,
  WithStyles,
  Grid,
  Tooltip,
  Switch
} from "@material-ui/core";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";

const styles = createStyles({
  switch: {
    width: "100%",
    marginTop: "-12px",
    marginBottom: "-12px",
    fontSize: "0.6em"
  }
});

const mapState = (state: iRootState) => ({
  posts: state.posts,
  isPending: state.isPending,
  error: state.error,
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchPosts: dispatch.posts.fetchPosts,
  setIsPending: dispatch.isPending.setIsPending
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  WithStyles<typeof styles>;

type State = {
  orderChecked: boolean;
};

class PostIndex extends Component<Props, State> {
  state = {
    orderChecked: false
  };

  componentDidMount() {
    //Get posts on mount
    this.props.fetchPosts();
  }

  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.setIsPending(false);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ orderChecked: event.target.checked });
  };

  render() {
    const { error, isPending, posts, classes, isAuthenticated } = this.props;
    const { orderChecked } = this.state;
    const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";
    return (
      <Fragment>
        <Grid container spacing={3}>
          {
            //Show Error when there is any
            error && error.status ? <ErrorAlert /> : null
          }

          {/* Sorting switch */}
          <div className={classes.switch}>
            <Switch
              checked={orderChecked}
              onChange={this.handleChange}
              value="orderChecked"
            />
            Sorting by:{" "}
            <strong>{orderChecked ? "latest" : "oldest"} first</strong>
          </div>

          {
            //Show placeholders when loading
            isPending ? (
              <CardPlaceholder />
            ) : (
              <Cards posts={posts} latestFirst={orderChecked} />
            )
          }

          {/* Direct user to sign up page or if already signed in, write new page */}
          <Tooltip title="Write a story">
            <NewPostButton destination={writeButtonPath} />
          </Tooltip>
        </Grid>
      </Fragment>
    );
  }
}

export default compose<typeof PostIndex>(
  connect(mapState, mapDispatch),
  withStyles(styles, { name: "PostIndex" })
)(PostIndex);
