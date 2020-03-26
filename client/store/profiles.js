import axios from 'axios';

const initialState = {
  profile: [],
  profiles: []
};

// Action Types:
const GOT_PROFILE_BY_ID = 'GOT_PROFILE_BY_ID';
const ADD_PROFILE = 'ADD_PROFILE';

// Actions:
const setProfileById = profile => {
  return {
    type: GOT_PROFILE_BY_ID,
    profile
  };
};

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

export const getProfileByIdThunk = id => async dispatch => {
  try {
    const {data} = await axios.get(`/api/profiles/${id}`);
    dispatch(setProfileById(data));
  } catch (error) {
    console.log(error);
  }
};

// Reducer:
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_PROFILE_BY_ID:
      return {
        ...state,
        profile: action.profile
      };
    case ADD_PROFILE:
      return {
        ...state,
        profiles: [...state.products, action.product]
      };
    default:
      return state;
  }
}
