import React from 'react';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import EventSeat from 'material-ui/svg-icons/action/event-seat';
import MapsLocalDining from 'material-ui/svg-icons/maps/local-dining';
import Avatar from 'material-ui/Avatar';
import {
  blueGrey500, green500, red500
} from 'material-ui/styles/colors';

const styles = {
  sight: {
    backgroundColor: blueGrey500,
    top: 'calc(50% - 20px)',
  },
  event: {
    backgroundColor: green500,
    top: 'calc(50% - 20px)',
  },
  food: {
    backgroundColor: red500,
    top: 'calc(50% - 20px)',
  }
};

const ItineraryItems = (props) => (
  <div>
    <List>
      {props.itineraryItems.map((item, i) =>
        <ListItem
          key={i}
          primaryText={item.primary}
          secondaryText={item.secondary}
          leftAvatar={
            item.type === 'sight' ? 
            <Avatar icon={<MapsPlace />} style={styles.sight} /> :
            item.type === 'event' ?
            <Avatar icon={<EventSeat />} style={styles.event} /> :
            item.type === 'food' ?
            <Avatar icon={<MapsLocalDining />} style={styles.food} /> :
            ''
          }
          href={item.url}
          target="_blank"
          style={{textDecoration: 'none'}}
        />
      )}
    </List>
    <Divider style={{width: '70%'}}/>
  </div>
);

export default ItineraryItems;