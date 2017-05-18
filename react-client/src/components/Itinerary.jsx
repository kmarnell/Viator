import React from 'react';
import ItineraryItems from './ItineraryItems.jsx';
import Subheader from 'material-ui/Subheader';


const Itinerary = (props) => (
  <div>
    {Object.keys(props.itinerary).sort().map((day, i) =>
      <div key={i}>
        <Subheader>{day.slice(1)}</Subheader>
        <ItineraryItems itineraryItems={props.itinerary[day]} />
      </div>
    )}
  </div>
);

export default Itinerary;