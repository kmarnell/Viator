import React from 'react';
import {render} from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FlightCard from './FlightCard.jsx';
import FoodCard from './FoodCard.jsx';
import SightsCard from './SightsCard.jsx';
import WeatherCard from './WeatherCard.jsx';
import NavigationCard from './NavigationCard.jsx';
import EventListCard from './EventListCard.jsx';
import Itinerary from './Itinerary.jsx';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import GridList from 'material-ui/GridList';
import GoogleButton from 'react-google-button';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Event from 'material-ui/svg-icons/action/event';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Delete from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import { SpeedDial, SpeedDialItem } from 'react-mui-speeddial';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlightTakeoff from 'material-ui/svg-icons/action/flight-takeoff';
import TextField from 'material-ui/TextField';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import {
  amberA700, tealA700, white, redA700, cyan600
} from 'material-ui/styles/colors';
import $ from 'jquery';
import SignOutToolBar from './SignOutToolBar.jsx';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

class DashBoard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      food: [],
      sights: [],
      events: [],
      flight: {},
      returnFlight: {},
      flightsArray: [],
      index: 0,
      weather: [],
      itinerary: {},
      location: '',
      recipientEmail: '',
      drawerOpen: false,
      returnFlightStatus: false,
      alertIsOpen: false,
      newFlight: false,
      emailSelectionOpen: false
    };
    this.searchGoogle = this.searchGoogle.bind(this);
    this.flightSearch = this.flightSearch.bind(this);
    this.databaseFlightSearch = this.databaseFlightSearch.bind(this);
    this.historyChange = this.historyChange.bind(this);
    this.searchFood = this.searchFood.bind(this);
    this.searchWeather = this.searchWeather.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
    this.submitToItinerary = this.submitToItinerary.bind(this);
    this.toggleItinerary = this.toggleItinerary.bind(this);
    this.exitToApp = this.exitToApp.bind(this);
    this.deleteCurrent = this.deleteCurrent.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.newFlight = this.newFlight.bind(this);
    this.openEmailSelection = this.openEmailSelection.bind(this);
    this.closeEmailSelection = this.closeEmailSelection.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.setRecipient = this.setRecipient.bind(this);
  }

  searchEvents(location) {
    $.get('/events', {
      location: location
    })
    .done((data) => {
      this.setState({
        events: data
      });
    });
  }

 handleOpen() {
   this.setState({alertIsOpen: true});
 }

 handleClose() {
   this.setState({alertIsOpen: false});
 }

 newFlight() {
   this.setState({newFlight: true})
 }

  searchGoogle(location) {
    $.get('/sights', {
      location: location
    })
    .done((data) => {
      this.setState({
        sights: data
      });
    });
  }



  databaseFlightSearch() {
    var context = this;
    $.ajax({
      type: 'GET',
      url: '/database/return',
      datatype: 'json'
    })
    .done(function(data) {
      context.setState({
        flightsArray: data,
        location: data[0].destination

      });
      context.flightSearch(data[0].Airline, data[0].flight, data[0].month, data[0].day, data[0].year, 'flight');
      if (data[0].returnFlight) {
        context.flightSearch(data[0].Airline, data[0].returnFlight, data[0].returnMonth, data[0].returnDay, data[0].year, 'returnFlight');
        context.setState({returnFlightStatus: true});
      }
      context.searchGoogle(data[0].destination);
      context.searchFood(data[0].destination);
      context.searchWeather(data[0].destination);
      context.searchEvents(data[0].destination);
      console.log('success GET', data);
    })
    .fail(function(err) {
      console.log('failed to GET', err);
    });


  }

  flightSearch(airline, flight, month, day, year, flightType) {
    $.get('/flightStatus', {
      airline: airline,
      flight: flight,
      month: month,
      day: day,
      year: year
    })
    .done((data) => {
      if (flightType === 'flight') {
        console.log('departure data', data);
      } else if (flightType === 'returnFlight') {
        console.log('return data', data);
      }
      var dateTime = data.flightStatuses[0].departureDate.dateLocal;
      var newTime;
      var dateOnly;
      var hours;
      var minutes;
      var count = 0;
      for (var i = 0; i < dateTime.length; i++) {
        if (dateTime[i] === 'T') {
          dateOnly = dateTime.slice(0, i);
          newTime = dateTime.slice(i + 1, dateTime.length);
        }
      }
      hours = newTime.slice(0, 2);
      minutes = newTime.slice(3, 5);
      hours = Number(hours);
      if (hours > 12) {
        newTime = (Math.floor(hours - 12)).toString() + ':' + minutes + ' PM';
      } else {
        newTime = hours.toString() + ':' + minutes + ' AM';
      }

      var flightDuration = data.flightStatuses[0].flightDurations.scheduledBlockMinutes;
      if (flightDuration > 60) {
        hours = Math.floor(flightDuration / 60);
        minutes = flightDuration - (hours * 60);
        flightDuration = hours.toString() + ' Hour(s) ' + minutes.toString() + ' Minute(s)';
      } else if (flightDuration <= 60) {
        flightDuration = flightDuration + ' Minute(s)';
      }
      dateOnly = dateOnly[5] === '0' ? (dateOnly.slice(6, 7) + '/' + dateOnly.slice(8, 10) + '/' + dateOnly.slice(0, 4)) : (dateOnly.slice(5, 7) + '/' + dateOnly.slice(8, 10) + '/' + dateOnly.slice(0, 4));
      var departure;
      var arrival;
      if (data.flightStatuses[0].arrivalAirportFsCode === data.appendix.airports[0].faa) {
        arrival = data.appendix.airports[0].city + ', ' + data.appendix.airports[0].stateCode
      } else {
        arrival = data.appendix.airports[1].city + ', ' + data.appendix.airports[1].stateCode
      }
      if (data.flightStatuses[0].departureAirportFsCode === data.appendix.airports[0].faa) {
        departure = data.appendix.airports[0].city + ', ' + data.appendix.airports[0].stateCode
      } else {
        departure = data.appendix.airports[1].city + ', ' + data.appendix.airports[1].stateCode
      }
      var obj = {
        departurePort: data.flightStatuses[0].departureAirportFsCode,
        arrivalPort: data.flightStatuses[0].arrivalAirportFsCode,
        departureCity: departure,
        arrivalCity: arrival,
        leaveTime: newTime,
        flightDuration: flightDuration,
        airline: data.appendix.airlines[0].name,
        leaveDate: dateOnly,
        flightNumber: flight,
        status: data.flightStatuses[0].status
      }; //status: for flightCard
      if (flightType === 'flight') {
        this.setState({
          flight: obj
        });
      } else if (flightType === 'returnFlight') {
        this.setState({
          returnFlight: obj
        });
      }
    });
  }

  historyChange(event, index) {
    this.setState({
      index: index,
    }, function() {
      var flight = this.state.flightsArray[index];
      if (!flight.returnFlight) {
        this.setState({returnFlightStatus: false});
        this.flightSearch(flight.Airline, flight.flight, flight.month, flight.day, flight.year, 'flight');
      } else {
        this.setState({returnFlightStatus: true});
        this.flightSearch(flight.Airline, flight.flight, flight.month, flight.day, flight.year, 'flight');
        this.flightSearch(flight.Airline, flight.returnFlight, flight.returnMonth, flight.returnDay, flight.year, 'returnFlight');
      }
      this.searchGoogle(flight.destination);
      this.searchFood(flight.destination);
      this.searchWeather(flight.destination);
      this.searchEvents(flight.destination);
    });

    this.databaseItinerarySearch();
  }

  searchFood(location) {
    $.get('/food', {
      location: location
    })
    .done((data) => {
      this.setState({
        food: data,
        location: location
      });
    });
  }

  searchWeather(location) {
    $.get('/weather', {
      location: location
    })
    .done((data) => {
      this.setState({
        weather: data,
        location: location
      });
    });
  }

  submitToItinerary(date, primary, secondary, url, type) {
    let itineraryKey = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    let context = this;
    $.ajax({
      type: 'POST',
      url: '/database/itinerary',
      contentType: 'application/json',
      data: JSON.stringify({
        airline: context.state.flight.airline,
        flightNumber: context.state.flight.flightNumber,
        date: itineraryKey,
        primary: primary,
        secondary: secondary,
        url: url,
        type: type
      }),
      success: (data) => {
        console.log('Successfully posted itinerary data');
      },
      error: (error) => {
        console.log('Error posting itinerary data', error);
      }
    });
  }


  databaseItinerarySearch() {
    var context = this;
    $.get('/database/getItinerary', {
      airline: context.state.flight.airline,
      flightNumber: context.state.flight.flightNumber,
    })
    .done((data) => {
      let newItinerary = {};

      data.forEach((item) => {
        let newItem = {
          primary: item.primary,
          secondary: item.secondary,
          url: item.url,
          type: item.type
        };

        if (newItinerary[item.date]) {
          newItinerary[item.date].push(newItem);
        } else {
          newItinerary[item.date] = [newItem];
        }
      });

      context.setState({
        itinerary: newItinerary
      });
    })
    .fail((err) => {
      console.log('failed to receive itinerary data');
    });
  }

  toggleItinerary() {
    this.databaseItinerarySearch();

    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  deleteCurrent() {
    var context = this
    this.handleClose()
    this.state.flightsArray.splice(this.state.index, 1);
    var flightNum = this.state.flight.flightNumber
    $.ajax({
      type: 'POST',
      url: '/database/deleteTrip',
      contentType: 'application/json',
      data: JSON.stringify({
        flightNumber: context.state.flight.flightNumber,
      }),
      success: (data) => {
        console.log('Successfully deleted travel data');
      },
      error: (error) => {
        console.log('Error deleting travel data', error);
      }
    });
    this.historyChange(null, 0)
  }

  exitToApp() {
    this.setState({
      drawerOpen: false
    });
  }

  openEmailSelection() {
    this.setState({
      emailSelectionOpen: true
    });
  }

  closeEmailSelection() {
    this.setState({
      emailSelectionOpen: false
    });
  }

  setRecipient(address) {
    console.log(address)

    this.setState({
      recipientEmail: address
    });
  }

  sendEmail() {
    let context = this;
    $.ajax({
      type: 'POST',
      url: '/email/itinerary',
      contentType: 'application/json',
      data: JSON.stringify({
        flight: context.state.flight,
        itinerary: context.state.itinerary,
        recipientEmail: context.state.recipientEmail
      }),
      success: (data) => {
        console.log('Successfully sent email post request to server');
      },
      error: (error) => {
        console.log('Failed to send email post request to server', error);
      }
    });
  } 

  componentDidMount() {
    this.databaseFlightSearch();
  }

  render() {
    const actions = [
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleClose}
          />,
          <FlatButton
            label="Delete"
            primary={true}
            onTouchTap={this.deleteCurrent}
          />,
      ];

    const styles = {
      gridList: {
        width: 'auto',
        overflowX: 'hidden',
        height: 'auto',
        overflowY: 'visible',
        marginLeft: 20,
        marginRight: 20,
      },
      fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        zIndex: 100,
        position: 'fixed',
      },
      fab2: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 85,
        left: 'auto',
        zIndex: 200,
        position: 'fixed',
      },
      fab3: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 150,
        left: 'auto',
        zIndex: 250,
        position: 'fixed',
      },
      hist: {
        top: 50,
        left: 30,
        zIndex: 100,
        position: 'fixed',
      },
      itineraryIcon: {
        position: 'relative',
        bottom: 3
      },
      appBarTitle: {
        fontSize: 20,
        height: 56,
        position: 'relative',
        bottom: 3
      }
    };


    if (this.state.newFlight) {
      return <Redirect to="/trip" />
    }
    return (
      <MuiThemeProvider>
      <div>
        <Dialog
        actions={actions}
        modal={false}
        open={this.state.alertIsOpen}
        onRequestClose={this.handleClose}
       >
       Are you sure you want to delete this trip?
       </Dialog>
        <SignOutToolBar/>
        <div
          style={styles.gridList}>
            <SelectField
              floatingLabelText='Trips'
              onChange={this.historyChange}
              value={this.state.index}>
              {this.state.flightsArray.map((index, ind) => {
                return <MenuItem key={ind} value={ind} label={index.Airline + ' ' + index.flight} primaryText={index.Airline + ' ' + index.flight} />;
              })}
            </SelectField>

            <GridList
              cellHeight={400}
              cols = {3}
              padding = {25}>
              <MuiThemeProvider><WeatherCard weather={this.state.weather} location={this.state.location}/></MuiThemeProvider>
              <MuiThemeProvider><FlightCard returnFlightStatus = {this.state.returnFlightStatus} returnFlight = {this.state.returnFlight} flight={this.state.flight}/></MuiThemeProvider>
              <MuiThemeProvider><NavigationCard destination={this.state.location} arrivalPort={this.state.flight.arrivalPort} /></MuiThemeProvider>
              <MuiThemeProvider><FoodCard food={this.state.food} submitToItinerary={this.submitToItinerary}/></MuiThemeProvider>
              <MuiThemeProvider><SightsCard sights={this.state.sights} submitToItinerary={this.submitToItinerary}/></MuiThemeProvider>
              <MuiThemeProvider><EventListCard events={this.state.events} submitToItinerary={this.submitToItinerary}/></MuiThemeProvider>
            </GridList>
            <Drawer
              width={500}
              docked={false}
              openSecondary={true}
              open={this.state.drawerOpen}
              onRequestChange={(open) => this.setState({drawerOpen: open})}
            >
              <AppBar
                title="Trip Itinerary"
                titleStyle={styles.appBarTitle}
                iconElementLeft={<IconButton><ExitToApp style={{fill: white}} /></IconButton>}
                iconElementRight={<FlatButton label="Send via Email" onTouchTap={this.openEmailSelection} />}
                onLeftIconButtonTouchTap={this.exitToApp}
                iconStyleLeft={styles.itineraryIcon}
                iconStyleRight={styles.itineraryIcon}
                style={{height: 56}}
              />
              <Dialog
                open={this.state.emailSelectionOpen}
                onRequestClose={this.closeEmailSelection}
              >
                <TextField
                  hintText="recipient email address"
                  floatingLabelText="recipient email address"
                  fullWidth={true}
                  onChange={(event, address) => this.setRecipient(address)}
                />
                <FlatButton
                  label="Send"
                  primary={true}
                  onTouchTap={this.sendEmail}
                />
                <FlatButton 

                />
              </Dialog>
              <Itinerary itinerary={this.state.itinerary} />
            </Drawer>
            <SpeedDial
            fabContentOpen={
              <ContentAdd />
            }
            fabContentClose={
              <NavigationClose />
            }
            style = {styles.fab}
            >

            <SpeedDialItem
             fabContent={<Delete/>}
             onTouchTap={this.handleOpen}
           />

           <SpeedDialItem
             fabContent={<Event/>}
             onTouchTap={this.toggleItinerary}
           />
           <SpeedDialItem
            fabContent={<FlightTakeoff/>}
            onTouchTap={this.newFlight}
          />


          </SpeedDial>
        </div>
      </div>

      </MuiThemeProvider>
    )
  }
}

export default DashBoard;
