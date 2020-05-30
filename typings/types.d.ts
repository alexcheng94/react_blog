declare module "PostTypes" {
  export type Post = {
    _id: string;
    author: string;
    content: string;
    date: string;
    title: string;
    request: {
      type: string;
      url: string;
    };
  };

  export type PostsList = Post[];

  export type InPostData = {
    title: string;
    content: string;
  };

  export type PostsHub = {
    [_id: string]: Post;
  };

  export type CreatePostPayload = {
    values: InPostData;
    callback: () => void;
  };

  export type DeletePostPayload = {
    _id: string;
    callback: () => void;
  };

  export type UpdatePostPayload = {
    _id: string;
    callback: () => void;
    requestBody: { propName: string; value: string }[];
  };
}

declare module "UserTypes" {
  export type UserState = {
    isAuthenticated: boolean;
    username: string;
    isDarkMode: boolean;
  };

  export type UserCredential = {
    username: string;
    password: string;
  };

  export type SignupPayload = {
    signupData: UserCredential;
    callback: () => void;
  };

  export type LoginPayload = {
    loginData: UserCredential;
    callback: () => void;
  };

  export type LogoutPayload = {
    callback: () => void;
  };

  export type UserResponse = {
    message: string;
    token: string;
    username: string;
  };
}
