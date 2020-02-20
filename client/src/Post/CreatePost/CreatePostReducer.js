import {
  UPDATE_FIELD,
  ADD_IMAGES,
  UPDATE_IMAGE,
  DELETE_IMAGE,
  CLEAR_DRAFT
} from "./CreatePostActions";

// Initial State
const initialState = {
  title: "",
  content: "",
  images: []
};

const CreatePostReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FIELD:
      let update = {};
      update[action.field] = action.value;
      return { ...state, ...update };

    case ADD_IMAGES:
      return { ...state, images: state.images.concat(action.images) };
    case UPDATE_IMAGE:
      let newImages = state.images.map(x => {
        if (x.cuid === action.cuid) {
          return { ...x, ...action.changes };
        } else {
          return x;
        }
      });

      return { ...state, images: newImages };
    case DELETE_IMAGE:
      return {
        ...state,
        images: state.images.filter(x => x.cuid !== action.cuid)
      };

    case CLEAR_DRAFT:
      return initialState;
    default:
      return state;
  }
};

// Export Reducer
export default CreatePostReducer;
