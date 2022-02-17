import React, { useState } from "react";
import {
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@material-ui/core";

const ArtistResults = ({ results }) => {
  return (
    <List>
      {results.map((item, index) => (
        <ListItem key={item.id} dense button>
          <ListItemText>
            {item.id} - {item.name}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default ArtistResults;
