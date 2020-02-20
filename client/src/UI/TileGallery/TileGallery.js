import React, { useContext, useState, useEffect } from "react";
import GridList from "@material-ui/core/GridList";
import { makeStyles } from "@material-ui/core/styles";

import Button from "../Button/Button";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "100%"
  },
  gridList: {
    flexWrap: props => (props.wrap ? "wrap" : "nowrap"),
    padding: theme.spacing(0.5),
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  }
}));
const TileGallery = ({ tiles, keyField, renderItem, wrap }) => {
  const classes = useStyles({ wrap });
  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {tiles.map(tile => renderItem(tile))}
      </GridList>
    </div>
  );
};
export default TileGallery;
