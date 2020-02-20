// Export Constants
export const UPDATE_FIELD = "UPDATE_FIELD";
export const ADD_IMAGES = "ADD_IMAGES";
export const UPDATE_IMAGE = "UPDATE_IMAGE";
export const DELETE_IMAGE = "DELETE_IMAGE";
export const CLEAR_DRAFT = "CLEAR_DRAFT";

// Export Actions
export function updateField(field, value) {
  return {
    type: UPDATE_FIELD,
    field,
    value
  };
}

export function addImages(images) {
  return {
    type: ADD_IMAGES,
    images
  };
}

export function updateImage(cuid, changes) {
  return {
    type: UPDATE_IMAGE,
    cuid,
    changes
  };
}

export function deleteImage(cuid) {
  return {
    type: DELETE_IMAGE,
    cuid
  };
}

export function clearDraft() {
  return {
    type: CLEAR_DRAFT
  };
}
