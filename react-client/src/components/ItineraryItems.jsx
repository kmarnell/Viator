import React from 'react';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';

const ItineraryItems = (props) => (
  <div>
    <List>
      {props.itineraryItems.map((item, i) =>
        <a key={i} href={item.url} target="_blank" style={{textDecoration: 'none'}}>
          <ListItem
            primaryText={item.primary}
            secondaryText={item.secondary}
          />
        </a>
      )}
    </List>
    <Divider style={{width: '70%'}}/>
  </div>
);

export default ItineraryItems;