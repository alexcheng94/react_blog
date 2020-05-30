import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { compose } from "redux";
import { iRootState, Dispatch } from "../store";
import { withStyles, WithStyles, Grid, Typography } from "@material-ui/core";
import { ErrorAlert, Cards, NewPostButton } from "@components";

const styles = {};

type TParams = { username: string };
type OwnProps = RouteComponentProps<TParams>;

const mapState = (state: iRootState, ownProps: OwnProps) => ({
  posts: state.posts,
  isPending: state.isPending,
  error: state.error,
  isAuthenticated: state.user.isAuthenticated,
  userFilter: decodeURIComponent(ownProps.match.params.username)
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchPosts: dispatch.posts.fetchPosts
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  WithStyles<typeof styles> &
  RouteComponentProps;

class UserProfile extends Component<Props, {}> {
  componentDidMount() {
    //if this.props.posts is already there, don't waste network usage on fetching again
    if (Object.keys(this.props.posts).length === 0) {
      this.props.fetchPosts();
    }
  }
  render() {
    const { error, posts, userFilter, isAuthenticated } = this.props;

    //filter all posts whose author prop matches the username in url
    const userPosts = {};
    for (let key in posts) {
      if (posts[key]["author"] === userFilter) {
        userPosts[key] = posts[key];
      }
    }
    const postCount = Object.keys(userPosts).length;

    return (
      <Fragment>
        <Typography variant="h5" gutterBottom align="center">
          There are {postCount} post
          {postCount > 1 && "s"} by {userFilter}
        </Typography>
        {error && error.status ? <ErrorAlert /> : null}
        <Grid container spacing={3}>
          <Fragment>
            <Cards posts={userPosts} />
            {isAuthenticated && <NewPostButton destination="/posts/new" />}
          </Fragment>
        </Grid>
      </Fragment>
    );
  }
}

export default compose(
  connect(mapState, mapDispatch),
  withStyles(styles, {
    name: "UserProfile"
  })
)(UserProfile);
