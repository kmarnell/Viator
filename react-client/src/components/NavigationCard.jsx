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



class NavigationCard extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      price: ''
    }
    this.getPriceEstimates = this.getPriceEstimates.bind(this);
    //this.getMapRoute = this.getMapRoute.bind(this);
    
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

  // getMapRoute() {
  //   $.ajax({
  //     type: 'GET',
  //     url: `https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=${config.STATIC_MAP}&signature=QVfZM7UYN-UckJivpuEFAUfGfbs`,
  //     contentType: 'application/json; charset=UTF-8',
  //     success: () => {
  //       console.log("success!")
  //     },
  //     error: function() {
  //       console.log("error!")
  //     }
  //   })
  // }

  componentDidMount() {
    this.getPriceEstimates();
    //this.getMapRoute();

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
                  center={{lat: 37.7749, lng: -122.42}}
                  zoom={11}
                >
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
