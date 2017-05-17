import React from 'react';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';


const Itinerary = (props) => (
  <div>
    <Subheader>May 19, 2017</Subheader>
    <List>
      <ListItem
        primaryText="Some Restaurant"
        secondaryText="Restaurant Description"
      />
      <ListItem
        primaryText="Some Event"
        secondaryText="Event Description"
      />
      <ListItem
        primaryText="Some Place of Interest"
        secondaryText="Place of Interest Description"
      />
    </List>
    <Divider style={{width: '70%'}}/>
    <Subheader>May 20, 2017</Subheader>
    <List>
      <ListItem
        primaryText="Some Restaurant"
        secondaryText="Restaurant Description"
      />
      <ListItem
        primaryText="Some Event"
        secondaryText="Event Description"
      />
      <ListItem
        primaryText="Some Place of Interest"
        secondaryText="Place of Interest Description"
      />
    </List>
    <Divider style={{width: '70%'}}/>
    <Subheader>May 21, 2017</Subheader>
    <List>
      <ListItem
        primaryText="Some Restaurant"
        secondaryText="Restaurant Description"
      />
      <ListItem
        primaryText="Some Event"
        secondaryText="Event Description"
      />
      <ListItem
        primaryText="Some Place of Interest"
        secondaryText="Place of Interest Description"
      />
    </List>
  </div>
);

export default Itinerary;