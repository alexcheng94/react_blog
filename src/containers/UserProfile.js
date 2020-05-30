import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { withStyles, Grid, Typography } from "@material-ui/core";

import ErrorAlert from "../containers/ErrorAlert";
import Cards from "../components/Cards";
import NewPostButton from "../components/NewPostButton";
import { fetchPosts } from "../actions/posts";

const styles = {};

class UserProfile extends Component {
  componentDidMount() {
    //if this.props.posts is already there, don't waste network usage on fetching again
    if (Object.keys(this.props.posts).length === 0) {
      this.props.fetchPosts();
    }
  }
  render() {
    const { error, posts, userFilter, isAuthenticated, classes } = this.props;

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

const mapStateToProps = (state, ownProps) => {
  return {
    posts: state.posts,
    isPending: state.isPending,
    error: state.error,
    isAuthenticated: state.user.isAuthenticated,
    userFilter: decodeURIComponent(ownProps.match.params.username)
  };
};

export default compose(
  withStyles(styles, {
    name: "UserProfile"
  }),
  connect(mapStateToProps, { fetchPosts })
)(UserProfile);
