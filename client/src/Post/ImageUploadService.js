import config from "config";
import DeferredPromise from "util/DeferredPromise";

// Include the u_underlay switch to force a simple transformation
// that way cloudinary properly applies EXIF related rotations, etc.
export const getImageUrl = (cuid, options = "") =>
  `https://res.cloudinary.com/dra3cjjrz/image/upload/${options ||
    "u_underlay"}/v1581281015/${cuid}`;

/** Uploads an image file to the cloudinary account */
export const uploadFile = (id, file, progress) => {
  const deferred = new DeferredPromise();

  var url = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/upload`;
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.upload.addEventListener("progress", function(e) {
    if (progress) progress(Math.round((e.loaded * 100.0) / e.total));
  });

  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText);
        var url = response.secure_url;
        deferred.resolve(response);
      } else {
        deferred.reject(
          new Error(`Server error: ${xhr.status} ${xhr.statusText}`)
        );
      }
    }
  };

  xhr.addEventListener("error", function(e) {
    console.log(e);
    deferred.reject();
  });

  fd.append("upload_preset", config.cloudinary.uploadPreset);
  fd.append("public_id", id);
  fd.append("file", file);
  xhr.send(fd);

  return deferred.promise;
};

/**
 * Processes a list of image objects, uploading each. The image
 * objects are updated with the correct statuses as the upload
 * progresses and either completes or fails
 */
export function uploadImages(images, updateImageState, onError) {
  for (let image of images) {
    updateImageState(image, { isPending: true, failed: false });
    uploadFile(image.cuid, image.file, progress => {
      updateImageState(image, { progress: progress });
    })
      .then(() => {
        updateImageState(image, { isPending: false });
      })
      .catch(err => {
        onError(err);
        updateImageState(image, { failed: true });
      });
  }
}
