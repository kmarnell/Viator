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
import $ from 'jquery';


 class NavigationCard extends React.Component {
  constructor (props) {
    super(props);
     this.getGeoCoord = this.getGeoCoord.bind(this);
     this.state = {
      geoLocations: {}
     }
  }
  
  getGeoCoord(position) {
    var context = this;
      console.log('getCordasf', position)
    if (position) {
      console.log('position is undefined');
    } else if (this.state.geoLocations[position]) {
      return this.state.geoLocations[position]
    } else {
      $.ajax({
        type: 'GET',
        url: '/geoCoord',
        contentType: 'application/json',
        data: {position: position},
        dataType: 'text',
        success: (data) => {
          console.log(`success getGeoCoord`,  data)
        },
        fail: (data) => {
          console.log('dash.getGeoCoord FAIL ', err)
        }
      })
      .done(function(data) {
        console.log('after ajax geoCoord: ' , typeof data, data, position)
        context.setState({geoLocations: data})
        return data;
      })
    } 
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
              title= {this.getGeoCoord(this.props.arrivalPort)}
              subtitle={this.getGeoCoord(this.props.destination)}
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
