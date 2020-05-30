import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { withStyles, Grid, Button, Tooltip, Switch } from "@material-ui/core";
import ErrorAlert from "../containers/ErrorAlert";
import Cards from "../components/Cards";
import CardPlaceHolder from "../components/CardPlaceholder";
import NewPostButton from "../components/NewPostButton";

import { fetchPosts } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

const styles = theme => ({
  switch: {
    width: "100%",
    marginTop: "-12px",
    marginBottom: "-12px",
    fontSize: "0.6em"
  }
});

class PostIndex extends Component {
  state = {
    orderChecked: false
  };
  componentDidMount() {
    //Get posts on mount
    this.props.fetchPosts();
  }
  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.clearLoader();
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  render() {
    const { error, isPending, posts, classes, isAuthenticated } = this.props;
    const { orderChecked } = this.state;
    const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";
    return (
      <Fragment>
        <Grid container spacing={3}>
          {//Show Error when there is any
          error && error.status ? <ErrorAlert /> : null}

          {/* Sorting switch */}
          <div className={classes.switch}>
            <Switch
              checked={orderChecked}
              onChange={this.handleChange("orderChecked")}
              value="orderChecked"
            />
            Sorting by:{" "}
            <strong>{orderChecked ? "latest" : "oldest"} first</strong>
          </div>

          {//Show placeholders when loading
          isPending ? (
            <CardPlaceHolder />
          ) : (
            <Cards posts={posts} latestFirst={orderChecked} />
          )}

          {/* Direct user to sign up page or if already signed in, write new page */}
          <Tooltip title="Write a story">
            <NewPostButton destination={writeButtonPath} />
          </Tooltip>
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts,
  isPending: state.isPending,
  error: state.error,
  isAuthenticated: state.user.isAuthenticated
});

export default compose(
  withStyles(styles, {
    name: "PostIndex"
  }),
  connect(mapStateToProps, { fetchPosts, clearLoader })
)(PostIndex);
