import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { withStyles, createStyles, WithStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const styles = createStyles({
  url: {
    backgroundColor: "#DCDCDC",
    fontFamily: "monospace",
    overflowWrap: "break-word"
  }
});

type Props = RouteComponentProps<{}> & WithStyles<typeof styles>;

const NoMatch: React.FC<Props> = props => {
  const { location, classes } = props;
  return (
    <div>
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
