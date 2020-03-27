import axios from 'axios';

const initialState = {
  profile: {},
  profiles: []
};

// Action Types:
const GOT_PROFILE = 'GOT_PROFILE';
const ADD_PROFILE = 'ADD_PROFILE';

// Actions:
const setProfileById = profile => {
  return {
    type: GOT_PROFILE,
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
    const {data} = await axios.put('api/profiles', profile);
    dispatch(addProfile(data));
  } catch (error) {
    console.log(error);
  }
};

export const getProfileByIdThunk = () => async dispatch => {
  try {
    const {data} = await axios.get(`/api/profiles`);
    dispatch(setProfileById(data));
  } catch (error) {
    console.log(error);
  }
};

// Reducer:
export default function(state = initialState, action) {
  switch (action.type) {
    case GOT_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case ADD_PROFILE:
      return {
        ...state,
        profiles: [...state.profiles, action.profile]
      };
    default:
      return state;
  }
}
