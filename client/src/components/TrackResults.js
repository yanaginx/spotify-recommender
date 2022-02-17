import React, { useState } from "react";
import {
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@material-ui/core";

const SearchResults = ({ results }) => {
  return (
    <List>
      {results.map((item, index) => (
        <ListItem key={item.id} dense button>
          <ListItemText>
            {item.name} - {item.id}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default SearchResults;
