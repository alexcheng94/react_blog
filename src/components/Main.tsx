import React from "react";
import { Route, Switch } from "react-router-dom";
import { createStyles, makeStyles } from "@material-ui/core";

import {
  PostNew,
  PostIndex,
  PostDetails,
  PostUpdate,
  Login,
  Signup,
  NoMatch
} from "@routes";
import { AsyncComponent } from "@components";

//As this app is quite small, we don't need to unnassisarily split the code into too many chunks,
//but I'll leave AsyncUserProfile spit as a demonstration
const AsyncUserProfile = AsyncComponent(() => import("../routes/UserProfile"));

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontFamily: "Roboto, sans-serif"
    },
    pageComponent: {
      padding: 24
    }
  })
);

const routes = [
  {
    path: "/",
    exact: true,
    main: PostIndex
  },
  {
    path: "/posts/new",
    main: PostNew
  },
  {
    path: "/posts/detail/:_id",
    main: PostDetails
  },
  {
    path: "/posts/edit/:_id",
    main: PostUpdate
  },
  {
    path: "/user/login",
    main: Login
  },
  {
    path: "/user/signup",
    main: Signup
  },
  {
    path: "/user/profile/:username",
    main: AsyncUserProfile
  },
  {
    main: NoMatch
  }
];

const Main: React.FC = props => {
  const classes = useStyles();
  return (
    <main className={classes.pageComponent}>
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        ))}
      </Switch>
    </main>
  );
};

export default Main;
