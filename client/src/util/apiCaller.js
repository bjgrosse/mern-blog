import fetch from "isomorphic-fetch";
import { getAuthToken } from "../Auth/AuthService";

export const API_URL = "http://localhost:3000/api";

const simulateNetworkDelayMs = 500;

export default async (endpoint, method = "get", body) => {
  if (simulateNetworkDelayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, simulateNetworkDelayMs));
  }

  return fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "content-type": "application/json",
      Authorization: getAuthToken()
    },
    method,
    body: JSON.stringify(body)
  })
    .catch(err => {
      // Fetch returns a generic "failed to fetch" error message
      // for all connection failures. Log it, but send something
      // friendlier back to the caller
      console.log(err);
      throw new Error("Failed to connect to server");
    })
    .then(response => {
      // try to read body as JSON.
      return response
        .json()
        .catch(err => {
          // If we got an OK status, just return as the data couldn't be parsed.
          if (response.ok) {
            return;
          } else {
            // Otherwise, it means we got some unexpected server error such as 404.
            // Pass that info along to the caller.
            return Promise.reject(
              new Error(
                `Server error: ${response.status} ${response.statusText}`
              )
            );
          }
        })
        .then(json => {
          // If we got a json body, but the response is not ok
          // it means the server logic threw a deliberate error
          // and returned information that should be sent to the client
          // (such as validation errors).
          // We'll reject the promise, but add the error details from
          // the server so the UI can act on it accordingly
          if (!response.ok) {
            let err = new Error("Data error");
            err.details = json;
            return Promise.reject(err);
          }

          return json;
        });
    });
};
