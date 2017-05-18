import React from 'react';
import ItineraryItems from './ItineraryItems.jsx';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';


const Itinerary = (props) => (
  <div>
    {Object.keys(props.itinerary).map((day) =>
      <div>
        <Subheader>{day}</Subheader>
        <ItineraryItems itineraryItems={props.itinerary[day]} />
      </div>
    )}
  </div>
);

export default Itinerary;