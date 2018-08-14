import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUserPosts } from "../actions/posts";

import ErrorPage from "../components/errorPage";
import Cards from "../components/cards";

class PostIndex extends Component {
  componentDidMount() {
    const rawUsername = this.props.match.params.username;
    console.log(rawUsername);

    const encodedUsername = encodeURIComponent(rawUsername);
    this.props.fetchUserPosts(encodedUsername);
  }
  render() {
    const { error, posts } = this.props;

    return (
      <div className="row container">
        <h2 className="center-align">
          Posts By {this.props.match.params.username}
        </h2>
        {error && error.status ? <ErrorPage /> : null}
        <Cards posts={posts} />
      </div>
    );
  }
}

function mapStateToProps({ posts, error, isPending }) {
  return {
    posts,
    isPending,
    error
  };
}

export default connect(
  mapStateToProps,
  { fetchUserPosts }
)(PostIndex);