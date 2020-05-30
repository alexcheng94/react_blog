//state.posts looks like this:
// {
//   5b71b53e1db7dd00205583a9: { _id: 5b71b53e1db7dd00205583a9, title:'...' author: '...', content: '...'},
//   5b70815e6fd3080020640b05: { _id: 5b70815e6fd3080020640b05, title:'...' author: '...', content: '...'},
//   ...
// }

import {
  FETCH_POSTS_FULFILLED,
  FETCH_POST_FULFILLED,
  FETCH_PROFILE_FULFILLED
} from "../actions/posts";
import mapKeys from "lodash/mapKeys";

const postReducer = (state = {}, action)=>{
  switch (action.type) {
    case FETCH_POSTS_FULFILLED:
      return mapKeys(action.payload.data.post, "_id");
    case FETCH_POST_FULFILLED:
      return { ...state, [action.payload.data._id]: action.payload.data };
    case FETCH_PROFILE_FULFILLED:
      return mapKeys(action.payload.data.posts, "_id");
    default:
      return state;
  }
}

export default postReducer;
