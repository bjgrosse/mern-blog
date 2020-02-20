import { useRef, useState, useEffect } from "react";
import useErrorHandler from "./useErrorHandler";

/**
 * A hook that receives an API fetch promise, maintains isLoading state
 * handles errors, including validation errors which are persisted in the errors state
 *
 * Usage:
 *
 * const [loadData, isLoading, errors, clearErrors] = useDataLoader();
 *
 * const handleClick= ()=> {
 *    loadData(login(data), (result) => doSomething(result));
 * }
 */
const useDataLoader = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandler();
  const unmounted = useRef();

  // We need to make note when we are unmounted
  // so that if data comes back after, we don't try
  // to change state
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const loadData = (getDataPromise, dataCallback) => {
    setIsLoading(true);

    return getDataPromise
      .then(result => {
        if (unmounted.current) return;

        // Call succeeded, if we have a callback, send the result
        if (dataCallback) dataCallback(result);

        return result;
      })
      .catch(err => {
        if (unmounted.current) return;

        // If the error object has a details property, it contains
        // validation or other relevant messages that should be
        // shown to the user: pass them to the errors state
        if (err.details) {
          setErrors(err.details);

          // Otherwise this is an unexpected error, so log it and alert the user
        } else {
          handleError(err, true);
        }
      })
      .finally(() => {
        if (unmounted.current) return;
        setIsLoading(false);
      });
  };

  const clearErrors = () => setErrors({});

  return [loadData, isLoading, errors, clearErrors];
};
export default useDataLoader;
