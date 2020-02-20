import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

/** Takes an array of values and returns the last one that
 *  corresponds to the current device width breakpoint.
 *
 *  Example:
 *  const width = useBreakpoints([100, 200, 300])
 *
 *  Device width between xs and sm will return 100, between sm and md will return 200,
 *  widths over md will return 300.
 *
 *  By default we use the full 5 breakpoints. You can pass
 *  in your own subset of these breakpoints. For instance:
 *
 *  const width = useBreakpoints([100, 300], ["xs", "md"])
 *
 *  In this instance, widths between xs and md will return 100 and
 *  anything over md will return 300.
 */
function useBreakpoints(values, breakpoints = ["xs", "sm", "md", "lg", "xl"]) {
  const theme = useTheme();

  const breakpointMatches = {
    xs: useMediaQuery(theme.breakpoints.up("xs")),
    sm: useMediaQuery(theme.breakpoints.up("sm")),
    md: useMediaQuery(theme.breakpoints.up("md")),
    lg: useMediaQuery(theme.breakpoints.up("lg")),
    xl: useMediaQuery(theme.breakpoints.up("xl"))
  };

  // default is values[0].
  // find the highest breakpoint that matches
  // the current device, and return the corresponding
  // item from values[]
  return breakpoints.reduce(
    (value, bp, idx) =>
      breakpointMatches[bp] && idx < values.length ? values[idx] : value,
    values[0]
  );
}

export default useBreakpoints;
