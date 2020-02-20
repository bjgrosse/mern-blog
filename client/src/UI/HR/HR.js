import React from "react";

import Box from "UI/Box/Box";

const style = {
  height: "2px",
  background:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,.05) 2%, rgba(0,0,0,.2)  50%, rgba(0,0,0,.05) 98%, transparent  100%)"
};

function HR(props) {
  return <Box style={style} {...props}></Box>;
}

export default HR;
