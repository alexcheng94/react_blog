import React from "react";
import { Link } from "react-router-dom";
import Edit from "@material-ui/icons/Edit";
import { Fab, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: "2em",
      right: "2em"
    }
  })
);

type Props = {
  destination: string;
};

const NewPostButton: React.FC<Props> = ({ destination }) => {
  const classes = useStyles();
  return (
    <Fab
      color="secondary"
      aria-label="new post"
      className={classes.fab}
      component={Link}
      to={destination}
    >
      <Edit />
    </Fab>
  );
};
export default NewPostButton;
