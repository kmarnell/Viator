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
import config from '../../../server/config.js';
const uberBar = './uberImage.png';
const mapPin = './mapPin.png';



 class NavigationCard extends React.Component {
  constructor (props) {
    super(props);
     this.getGeoCoord = this.getGeoCoord.bind(this);
     this.state = {
      geoLocations: {
        undefined: "Address of Undefined"
      },
      currentPosition: ""
     }
  }
  
  componentWillReceiveProps() {
    let arrivalPortObj = {};
    let destinationObj = {};
    if (this.props.destination && this.props.arrivalPort) {
      destinationObj[this.props.destination] = this.getGeoCoord(this.props.destination);
      arrivalPortObj[this.props.arrivalPort] = this.getGeoCoord(this.props.arrivalPort);
      this.setState({geoLocations: Object.assign(destinationObj, arrivalPortObj) })
    }
    
    
  }
  
  getGeoCoord(position) {
    var context = this;
    if (!!context.state.geoLocations[position]) {
      return context.state.geoLocations[position]
    } else if (position !== undefined){
      
      $.ajax({
        type: 'GET',
        url: '/geoCoord',
        contentType: 'application/json',
        data: {position: position.replace(/[ ]+/g, "+").trim()},
        dataType: 'text',
        success: (data) => {
          context.setState({currentPosition: position});
          let aObj = {};
          aObj[position] = JSON.parse(data);
          var currentGeoObj = context.state.geoLocations;
          context.setState({geoLocations: Object.assign(currentGeoObj,aObj) })
        },
        fail: (data) => {
          console.log('dash.getGeoCoord FAIL ', err)
        }
      })
      .done(function(data) {
        let position = context.state.currentPosition;
        return data;
      })
    } 
}

  geoLocation(position) {
    var context = this;
    if ( this.state.geoLocation[position]) {
      return this.state.geoLocation[position]
    }
    else {
      this.getGeoCoord(position)
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
              title= {'arrivalPort: ' + JSON.stringify(this.state.geoLocations[this.props.arrivalPort])}  
              /*geoLocation "{"lat":40.6895314,"lng":-74.1744624}" */
              subtitle={'destination: ' + JSON.stringify(this.state.geoLocations[this.props.destination])}
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
