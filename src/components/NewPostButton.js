import React from "react";
import { Link } from "react-router-dom";
import Edit from "@material-ui/icons/Edit";
import { Fab } from "@material-ui/core";

const styles = {
  fab: {
    position: "fixed",
    bottom: "2em",
    right: "2em"
  }
};

const NewPostButton = ({ destination }) => {
  return (
    <Fab
      color="secondary"
      aria-label="new post"
      style={styles.fab}
      component={Link}
      to={destination}
    >
      <Edit />
    </Fab>
  );
};
export default NewPostButton;
