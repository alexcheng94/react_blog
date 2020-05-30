import React from "react";
import orderBy from "lodash/orderBy";
import map from "lodash/map";
import { Link } from "react-router-dom";

import {
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import { PostsHub } from "PostTypes";

const styles = (theme: Theme) => {
  const isDarkTheme = theme.palette.type === "dark";
  return createStyles({
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
      display: "inline",
      paddingLeft: 2,
      paddingRight: 4,
      fontWeight: 700,
      backgroundColor: isDarkTheme ? "#3949ab" : "#e0e5ff"
    },
    author: {
      margin: "8px 0",
      fontSize: "0.8em"
    },
    article: {
      fontSize: "1.1em"
    }
  });
};

interface Props extends WithStyles<typeof styles> {
  latestFirst?: boolean;
  posts: PostsHub;
}

const Cards: React.FC<Props> = props => {
  const { classes, latestFirst, posts } = props;

  //Sort posts by time based on props.latestFirst
  const order = latestFirst ? "desc" : "asc";
  const ordered = orderBy(posts, ["date"], [order]);

  const cards = map(ordered, post => {
    const url = `/posts/detail/${post._id}`;
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
        <CardActionArea
          className={classes.cardButton}
          component={Link}
          to={url}
        >
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" className={classes.title}>
                {post.title}
              </Typography>
              <Typography className={classes.author}>
                By {post.author}
              </Typography>
              <Typography className={classes.article}>
                {post.content.slice(0, 60)}
                ...
              </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    );
  });

  return <>{cards}</>;
};

export default withStyles(styles)(Cards);
