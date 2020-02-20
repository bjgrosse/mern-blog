import { useSnackbar } from "notistack";
function useErrorHandler(defaultWarn = true) {
  const { enqueueSnackbar } = useSnackbar();
  return (err, warn = defaultWarn) => {
    console.log(err);
    if (warn) {
      // if the value passed in for warn is a string, then it's a custom
      // warning message we should use instead of the err.message
      enqueueSnackbar(typeof warn === "string" ? warn : err.message, {
        variant: "error"
      });
    }
  };
}

export default useErrorHandler;
