import React from "react";

import { withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const styles = {
  url: {
    backgroundColor: "#DCDCDC",
    fontFamily: "monospace",
    overflowWrap: "break-word"
  }
};

const NoMatch = props => {
  const { location, classes } = props;
  return (
    <div className={classes.nmcontent}>
      <Typography variant="h5" color="error">
        Oops...
      </Typography>
      <p className={classes.url}>{location.pathname}</p>
      <Typography variant="body1" color="error">
        This page doesn't exist, please go back.
      </Typography>
    </div>
  );
};
export default withStyles(styles)(NoMatch);
