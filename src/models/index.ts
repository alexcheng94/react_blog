import { posts } from "./posts";
import { user } from "./user";
import { isPending } from "./isPending";
import { error } from "./error";

export interface RootModel {
  posts: typeof posts;
  user: typeof user;
  isPending: typeof isPending;
  error: typeof error;
}

export const models: RootModel = {
  posts,
  user,
  isPending,
  error
};
