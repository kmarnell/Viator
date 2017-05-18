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
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import {
  amberA700, tealA700, white
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
      flightsArray: [],
      index: 0,
      weather: [],
      itinerary: {},
      location: '',
      drawerOpen: false
    }
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
  }

  searchEvents(location) {
    $.get('/events', {
      location: location
    })
    .done((data) => {
      this.setState({
        events: data
      })
    })
  }

  searchGoogle(location) {
    $.get('/sights', {
      location: location
    })
    .done((data) => {
      this.setState({
        sights: data
      })
    })
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
        flightsArray:data,
        location: data[0].destination
      })
      context.flightSearch(data[0].Airline,data[0].flight,data[0].month,data[0].day,data[0].year);
      context.searchGoogle(data[0].destination);
      context.searchFood(data[0].destination);
      context.searchWeather(data[0].destination);
      context.searchEvents(data[0].destination);
      console.log('success GET', data);
      })
    .fail(function(err) {
      console.log('failed to GET', err);
    })
  }

  flightSearch(airline, flight, month, day, year) {
    $.get('/flightStatus', {
      airline: airline,
      flight: flight,
      month: month,
      day: day,
      year: year
    })
    .done((data) => {
      console.log('flight data', data);
      var dateTime = data.flightStatuses[0].departureDate.dateLocal;
      var newTime;
      var dateOnly;
      var hours;
      var minutes;
      var count = 0;
      for (var i = 0; i < dateTime.length; i++) {
        if (dateTime[i] === 'T') {
          dateOnly = dateTime.slice(0,i);
          newTime =dateTime.slice(i+1,dateTime.length);
        }
      }
      hours = newTime.slice(0,2);
      minutes = newTime.slice(3,5);
      hours = Number(hours);
      if (hours > 12) {
        newTime = (Math.floor(hours - 12)).toString()+ ':' + minutes + ' PM'
      } else {
        newTime = hours.toString() + ':'+ minutes + ' AM'
      }

      var flightDuration = data.flightStatuses[0].flightDurations.scheduledAirMinutes;
      if (flightDuration > 60) {
        hours = Math.floor(flightDuration / 60);
        minutes = flightDuration - (hours * 60);
        flightDuration = hours.toString() + ' Hour(s) ' + minutes.toString() + ' Minute(s)';
      } else if (flightDuration <= 60) {
        flightDuration = flightDuration + ' Minute(s)';
      }
      dateOnly = dateOnly[5] === '0' ? (dateOnly.slice(6,7) + '/' + dateOnly.slice(8,10) + '/' + dateOnly.slice(0,4)) : (dateOnly.slice(5,7) + '/' + dateOnly.slice(8,10) + '/' + dateOnly.slice(0,4));
      var obj = {
        departurePort: data.appendix.airports[0].fs,
        arrivalPort: data.appendix.airports[1].fs,
        departureCity: data.appendix.airports[0].city + ', '+data.appendix.airports[0].stateCode,
        arrivalCity: data.appendix.airports[1].city + ',' + data.appendix.airports[1].stateCode,
        leaveTime: newTime,
        flightDuration: flightDuration,
        airline: data.appendix.airlines[0].name,
        leaveDate: dateOnly,
        flightNumber: flight,
      };
      this.setState({
        flight: obj
      });
    });

  }

  historyChange(event, index) {
    this.setState({
      index: index,
    }, function() {
      var flight = this.state.flightsArray[index];
      this.flightSearch(flight.Airline,flight.flight,flight.month,flight.day,flight.year);
      this.searchGoogle(flight.destination);
      this.searchFood(flight.destination);
      this.searchWeather(flight.destination);
      this.searchEvents(flight.destination);
    });
  }

  searchFood(location) {
    $.get('/food', {
      location: location
    })
    .done((data) => {
      this.setState({
        food: data,
        location: location
      })
    })
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

  submitToItinerary(date, primary, secondary) {
    console.log(primary);
    // let itineraryKey = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    // if (this.state.itinerary.hasOwnProperty(itineraryKey)) {
    //   console.log('HERE')
    //   let newItem = {
    //     primary: primary,
    //     secondary: secondary
    //   };
    //   // let itineraryItems = this.state.itinerary[itineraryKey].push(newItem);
    //   let itineraryItems = this.state.itinerary[itineraryKey];
    //   itineraryItems.push(newItem);

    //   console.log(itineraryItems);

    //   let newDateItem = {};
    //   newDateItem[itineraryKey] = itineraryItems;

    //   let newItineraryObj = Object.assign({}, this.state.itinerary, newDateItem);

    //   this.setState({
    //     itinerary: newItineraryObj
    //   });

    //   var context = this;
    //   setTimeout(function() {console.log(context.state.itinerary)}, 1000)

    // } else {
    //   let newItem = {};
    //   newItem[itineraryKey] = [{
    //     primary: primary,
    //     secondary: secondary
    //   }];
    //   let newItineraryObj = Object.assign({}, this.state.itinerary, newItem);

    //   this.setState({
    //     itinerary: newItineraryObj
    //   });
    //   var context = this;
    //   setTimeout(function() {console.log(context.state.itinerary)}, 1000)
    // }
  }

  toggleItinerary() {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  }

  exitToApp() {
    this.setState({
      drawerOpen: false
    });
  }

  componentDidMount() {
    this.databaseFlightSearch();
  }

  render() {
    const styles = {
      gridList: {
        width: 'auto',
        overflowX:'hidden',
        height: 'auto',
        overflowY:'visible',
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
      hist: {
        top: 50,
        left: 30,
        zIndex: 100,
        position: 'fixed',
      },
      exitToApp: {
        position: 'relative',
        bottom: 3
      },
      appBarTitle: {
        fontSize: 20,
        height: 56,
        position: 'relative',
        bottom: 3
      }
    }
    return(
      <div>
        <SignOutToolBar/>
        <div
          style={styles.gridList}>
          <MuiThemeProvider>
            <SelectField
              floatingLabelText='Trips'
              onChange={this.historyChange}
              value={this.state.index}>
              {this.state.flightsArray.map((index, ind) => {
                return <MenuItem key={ind} value={ind} label={index.Airline + ' ' +index.flight} primaryText={index.Airline + ' ' +index.flight} />
              })}
            </SelectField>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <GridList
              cellHeight={400}
              cols = {3}
              padding = {25}>
              <MuiThemeProvider><WeatherCard weather={this.state.weather} location={this.state.location}/></MuiThemeProvider>
              <MuiThemeProvider><FlightCard flight={this.state.flight}/></MuiThemeProvider>
              <MuiThemeProvider><FoodCard food={this.state.food}/></MuiThemeProvider>
              <MuiThemeProvider><SightsCard sights={this.state.sights} submitToItinerary={this.submitToItinerary}/></MuiThemeProvider>
              <MuiThemeProvider><NavigationCard/></MuiThemeProvider>
              <MuiThemeProvider><EventListCard events={this.state.events}/></MuiThemeProvider>
            </GridList>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Drawer
              width={600}
              docked={false}
              openSecondary={true}
              open={this.state.drawerOpen}
              onRequestChange={(open) => this.setState({drawerOpen: open})}
            >
              <AppBar
                title="Trip Itinerary"
                titleStyle={styles.appBarTitle}
                iconElementLeft={<IconButton style={styles.exitToApp}><ExitToApp style={{fill: white}} /></IconButton>}
                onLeftIconButtonTouchTap={this.exitToApp}
                style={{height: 56}}
              />
              <Itinerary />
            </Drawer>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <Link to='/trip'>
              <FloatingActionButton
                style={styles.fab}
                backgroundColor = {amberA700}
                label="Search"><ContentAdd />
              </FloatingActionButton>
            </Link>
          </MuiThemeProvider>
          <MuiThemeProvider>
            <FloatingActionButton
              style={styles.fab2}
              backgroundColor={tealA700}
              label="openItinerary"
              onClick={this.toggleItinerary}
            >
              <Event />
            </FloatingActionButton>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

export default DashBoard;
