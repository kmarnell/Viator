import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import MapNavigation from 'material-ui/svg-icons/maps/navigation';
import MapsPlace from 'material-ui/svg-icons/maps/place';
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


const AnyReactComponent = ({  img_src }) => <div><img src={mapPin}/></div>;

class NavigationCard extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      price: '',
      markers:[]
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
    //this.getMapRoute();
     this.setState({
      markers: [{lat: 37.7749, lng: -122.42}, {lat: 37.8044, lng: -122.2711}],
    });
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
      map: {
        height: '65%',
      },
      actions: {
        height: '20%',
      }
    }

    const uberImageStyle = {
      backgroundImage: `url(${uberBar})`,
      width: '100%',
      paddingBottom: '20'
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
              title="Navigation from Airport"
              subtitle='Address should go here.'
              avatar={<Avatar icon={<MapNavigation />}
                style={styles.avatar}
                color={white}/>}
              style={styles.cardHeader}/>
              <Divider/>
               <div
                style={styles.map}>
                <GoogleMapReact
                  bootstrapURLKeys={{key: config.STATIC_MAP}}
                  center={{lat: 37.8044, lng: -122.2711},{lat: 37.7749, lng: -122.42}}
                  zoom={11}
                >
                  {this.state.markers.map((marker, i) =>{
                  return(
                      <AnyReactComponent
                        key={i}
                        lat={marker.lat}
                        lng={marker.lng}
                        img_src={marker.img_src}
                      /> 

                    )
                  })} 
                </GoogleMapReact>
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
