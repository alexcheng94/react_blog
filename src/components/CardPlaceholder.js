import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  card: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      height: 200
    }
  },
  cardButton: {
    width: "100%"
  },
  title: {
    height: 28,
    width: 150,
    backgroundColor: "hsl(230, 100%, 94%)"
  },
  author: {
    margin: "1em 0",
    height: 16,
    width: "6em",
    backgroundColor: "#F0F0F0"
  },
  article: {
    marginBottom: 6,
    height: 16,
    width: "100%",
    backgroundColor: "#F0F0F0"
  }
});

const CardPlaceHolders = props => {
  const { classes } = props;
  //Render 12 "empty" cards:
  //Create an ITERABLE array with a length of 12, and then .map()
  return [...Array(12)].map((e, i) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
        <CardActionArea className={classes.cardButton}>
          <Card className={classes.card}>
            <CardContent>
              <div className={classes.title} />
              <div className={classes.author} />
              <div className={classes.article} />
              <div className={classes.article} />
              <div className={classes.article} />
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    );
  });
};
export default withStyles(styles)(CardPlaceHolders);
