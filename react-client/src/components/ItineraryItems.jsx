import React from 'react';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Avatar from 'material-ui/Avatar';
import {
  blueGrey500
} from 'material-ui/styles/colors';

const styles = {
  sight: {
    backgroundColor: blueGrey500
  }
};

const ItineraryItems = (props) => (
  <div>
    <List>
      {props.itineraryItems.map((item, i) =>
        <a key={i} href={item.url} target="_blank" style={{textDecoration: 'none'}}>
          <ListItem
            primaryText={item.primary}
            secondaryText={item.secondary}
            leftAvatar={<Avatar icon={<MapsPlace />} style={styles.sight} />}
          />
        </a>
      )}
    </List>
    <Divider style={{width: '70%'}}/>
  </div>
);

export default ItineraryItems;