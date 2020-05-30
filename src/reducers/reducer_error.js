// Concise rewrite:
const errorReducer = (state = {}, action) => {
  switch (true) {
    case action.type.includes("REJECTED"):
      return {
        ...state,
        status: action.payload.response.status,
        statusText: action.payload.response.statusText,
        message: action.payload.response.data.message
      };
    case action.type.includes("FULFILLED"):
    case action.type.includes("PENDING"):
    case action.type === "CLEAR_ERROR":
      return {
        ...state,
        status: null,
        statusText: null,
        message: null
      };
    default:
      return state;
  }
};
export default errorReducer;