import axios from 'axios';

const initialState = {
  profile: [],
  profiles: []
};

// Action Types:
const ADD_PROFILE = 'ADD_PROFILE';

// Actions:
const addProfile = profile => {
  return {
    type: ADD_PROFILE,
    profile
  };
};

// Thunks:
export const addProfileThunk = profile => async dispatch => {
  console.log('PROFILE SUBMIT ', profile);
  try {
    const {data} = await axios.post('api/profiles', profile);
    dispatch(addProfile(data));
  } catch (error) {
    console.log(error);
  }
};

// Reducer:
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_PROFILE:
      return {
        ...state,
        profiles: [...state.products, action.product]
      };
    default:
      return state;
  }
}
