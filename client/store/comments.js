import axios from 'axios';

const initialState = [];

// Actions Types:
const SET_COMMENTS = 'SET_COMMENTS';
const ADDED_COMMENT = 'ADDED_COMMENT';

// Actions:
export const setComments = comments => {
  return {
    type: SET_COMMENTS,
    comments
  };
};

export const addedComment = comment => {
  return {
    type: ADDED_COMMENT,
    comment
  };
};

// Thunks:
export const getComments = (q1, q2) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/comments/${q1}/${q2}`);
    dispatch(setComments(data));
  } catch (error) {
    console.log(error);
  }
};

export const addComment = (q1, q2, comment) => async dispatch => {
  try {
    const {data} = await axios.post('/api/comments', {
      q1,
      q2,
      comment
    });
    dispatch(addedComment(data));
  } catch (error) {
    console.log(error);
  }
};

// Reducer:
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_COMMENTS:
      return action.comments;
    case ADDED_COMMENT:
      return [...state, action.comment];
    default:
      return state;
  }
}
