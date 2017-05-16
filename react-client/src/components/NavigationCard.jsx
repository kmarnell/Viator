import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MapNavigation from 'material-ui/svg-icons/maps/navigation';
import Avatar from 'material-ui/Avatar';
import Arrow from 'material-ui/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/Divider';
import {
  grey500, white, deepPurple500,
} from 'material-ui/styles/colors';
import GoogleMapReact from 'google-map-react';
import FlatButton from 'material-ui/FlatButton';


 class NavigationCard extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    const styles = {
      card: {
        width: '100%',
        height: 400,
      },
      avatar: {
        backgroundColor: deepPurple500,
      },
      cardHeader: {
        height: '20%',
      },
      center: {
        lat: 37.7749,
        lng: -122.42,
      },
      map: {
        height: '65%',
      },
      actions: {
        height: '20%',
      }
    }

    return (
      <div>
        <Card
          style={styles.card}>
          <CardHeader
              title="Navigation from Airport"
              subtitle='Address should go here.'
              avatar={<Avatar icon={<MapNavigation />}
                style={styles.avatar}
                color={white}/>}
              style={styles.cardHeader}/>
              <Divider/>
              <div
                style={styles.map}>
              </div>
              <CardActions style={styles.actions}>
                <FlatButton primary = {true} label="NAVIGATE" />
                <FlatButton label="SHARE" />
              </CardActions>
        </Card>
      </div>
    )
  }
}

export default NavigationCard;
