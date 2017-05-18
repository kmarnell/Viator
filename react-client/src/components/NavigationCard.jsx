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

const bodyParser = require('body-parser');
import config from '../../../server/config.js';



 class NavigationCard extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      price: ''
    }
    this.getPriceEstimates = this.getPriceEstimates.bind(this);
  }
    getPriceEstimates() {
    var data = JSON.stringify({
       start_latitude: 37.7749,
       start_longitude: 122.4194,
       end_latitude: 37.8044,
       end_longitude: 122.2711    
     });

    $.ajax({
      type: 'POST',
      url: '/estimates/price', 
      headers: {
        Authorization: config.UBER_SERVER_TOKEN
      },
      contentType: 'application/json',
      data: data, 
      success: (data) => {
        this.setState({price: data});
      },
      error: function() {
        console.log("error!")
      }
    })

  }

  componentDidMount() {
    this.getPriceEstimates();
  }
  
  getGeoCoord(position) {
    if (position) {
      $.ajax({
        type: 'GET',
        url: '/geoCoord',
        contentType: 'application/json',
        data: {position: position.replace(/[, ]+/g, " ").trim()},
        dataType: 'text',
        success: (data) => {
          console.log(`success getGeoCoord`,  data)
          return data
        },
        fail: (data) => {
          console.log('dash.getGeoCoord FAIL ', err)
        }
      })
      .done(function(data) {
        console.log('after ajax geoCoord: ' , typeof data, data, position)
        return data;
      })
    } else { /* position === undefined */
      console.log('position undefined') 
  }
}

  componentDidMount() {
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

    const uberBar = './uberImage.png';
    const carIcon = './carIcon.png';

    const uberImageStyle = {
      backgroundImage: `url(${uberBar})`,
      width: '100%',
      paddingBottom: '20'
    }

    const carStyle = {
      backgroundImage: `url(${carIcon})`
    }

    const priceStyle = {
      textAlign: 'right',
      width: '300',
      height: '44',
      margin: 'auto'
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
              <div style={uberImageStyle}> 
                <p style={priceStyle}>Price Estimate: {this.state.price}</p>
              </div>
        </Card>
      </div>
    )
  }
}

export default NavigationCard;
